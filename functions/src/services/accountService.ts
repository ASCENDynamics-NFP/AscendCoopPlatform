/**
 * Account Service - Centralized business logic for account operations
 */
import {getFirestore, Timestamp, WriteBatch} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";
import {logger} from "firebase-functions/v2";
import {HttpsError} from "firebase-functions/v2/https";
import {geocodeAddress} from "../utils/geocoding";
import {ValidationUtils} from "../utils/validation";
import {
  STANDARD_ROLE_TEMPLATES,
  StandardRoleTemplate,
} from "../../../shared/models/standard-role-template.model";
import {
  STANDARD_PROJECT_TEMPLATES,
  StandardProjectTemplate,
} from "../../../shared/models/standard-project-template.model";

const db = getFirestore();
const auth = getAuth();

export interface CreateAccountRequest {
  type: "user" | "nonprofit" | "business" | "community";
  name: string;
  tagline?: string;
  contactInformation?: {
    emails?: Array<{email: string; type?: string}>;
    phoneNumbers?: Array<{number: string; type?: string}>;
    addresses?: Array<{
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    }>;
  };
  iconImage?: string;
  heroImage?: string;
}

export interface UpdateAccountRequest {
  accountId: string;
  updates: Partial<CreateAccountRequest>;
  userId: string; // for authorization
}

export class AccountService {
  /**
   * Create a new account with all related setup
   */
  static async createAccount(
    userId: string,
    data: CreateAccountRequest,
  ): Promise<{accountId: string; account: any}> {
    try {
      // Input validation
      ValidationUtils.validateUserId(userId);
      ValidationUtils.validateRequiredFields(
        data,
        ["name", "type"],
        "account data",
      );

      // Validate account fields
      const name = ValidationUtils.sanitizeString(data.name, 100);
      if (!name) {
        throw new HttpsError(
          "invalid-argument",
          "Account name cannot be empty",
        );
      }

      const tagline = data.tagline
        ? ValidationUtils.sanitizeString(data.tagline, 200)
        : "New and looking to help!";

      // Validate account type
      const allowedTypes = ["individual", "organization", "nonprofit"];
      ValidationUtils.validateEnum(data.type, allowedTypes, "account type");

      // Validate contact information if provided
      if (data.contactInformation) {
        if (data.contactInformation.emails) {
          data.contactInformation.emails.forEach((emailObj, index) => {
            if (!ValidationUtils.validateEmail(emailObj.email)) {
              throw new HttpsError(
                "invalid-argument",
                `Invalid email format at index ${index}`,
              );
            }
          });
        }

        if (data.contactInformation.phoneNumbers) {
          data.contactInformation.phoneNumbers.forEach((phoneObj, index) => {
            if (!ValidationUtils.validatePhoneNumber(phoneObj.number)) {
              throw new HttpsError(
                "invalid-argument",
                `Invalid phone number format at index ${index}`,
              );
            }
          });
        }

        if (data.contactInformation.addresses) {
          data.contactInformation.addresses.forEach((addr, index) => {
            try {
              ValidationUtils.validateLocation(addr);
            } catch (error: any) {
              throw new HttpsError(
                "invalid-argument",
                `Invalid address at index ${index}: ${error.message || "Unknown error"}`,
              );
            }
          });
        }
      }

      // Validate URLs if provided
      if (data.iconImage && !ValidationUtils.validateUrl(data.iconImage)) {
        throw new HttpsError("invalid-argument", "Invalid icon image URL");
      }
      if (data.heroImage && !ValidationUtils.validateUrl(data.heroImage)) {
        throw new HttpsError("invalid-argument", "Invalid hero image URL");
      }

      // Validate user exists
      const userRecord = await auth.getUser(userId);
      if (!userRecord) {
        throw new HttpsError("not-found", "User not found");
      }

      // Check if account already exists
      const existingAccount = await db.collection("accounts").doc(userId).get();
      if (existingAccount.exists) {
        throw new HttpsError(
          "already-exists",
          "Account already exists for this user",
        );
      }

      const batch = db.batch();
      const accountRef = db.collection("accounts").doc(userId);

      // Geocode addresses if provided
      let geocodedAddresses = data.contactInformation?.addresses || [];
      if (geocodedAddresses.length > 0) {
        geocodedAddresses = await Promise.all(
          geocodedAddresses.map(async (addr) => {
            // Convert address object to string for geocoding
            const addressString = [
              addr.street,
              addr.city,
              addr.state,
              addr.zipCode,
              addr.country,
            ]
              .filter(Boolean)
              .join(", ");

            if (addressString) {
              const geocoded = await geocodeAddress(addressString);
              return geocoded ? {...addr, ...geocoded} : addr;
            }
            return addr;
          }),
        );
      }

      // Prepare contact info for private subdocument only
      const contactInfoPayload = {
        emails: data.contactInformation?.emails || [{email: userRecord.email}],
        phoneNumbers: data.contactInformation?.phoneNumbers || [],
        addresses: geocodedAddresses,
      };

      const accountData = {
        id: userId,
        name: name,
        tagline: tagline,
        type: data.type,
        iconImage:
          data.iconImage ||
          "assets/image/logo/ASCENDynamics NFP-logos_transparent.png",
        heroImage: data.heroImage || "assets/image/userhero.png",
        email: userRecord.email,
        privacySettings: {
          profile: {visibility: "public"},
        },
        totalHours: 0,
        legalAgreements: {
          termsOfService: {
            accepted: true,
            datetime: Timestamp.now(),
            version: "1.0.0",
          },
          privacyPolicy: {
            accepted: true,
            datetime: Timestamp.now(),
            version: "1.0.0",
          },
        },
        isActive: true,
        createdAt: Timestamp.now(),
        createdBy: userId,
        lastLoginAt: Timestamp.now(),
        lastModifiedAt: Timestamp.now(),
        lastModifiedBy: userId,
      };

      // Set account document
      batch.set(accountRef, accountData);

      // Set up contact info in gated subdocument
      if (contactInfoPayload) {
        batch.set(
          accountRef.collection("sections").doc("contactInfo"),
          contactInfoPayload,
          {merge: true},
        );
      }

      // Initialize standard roles and projects based on account type
      await this.initializeAccountDefaults(batch, userId, data.type);

      await batch.commit();

      logger.info(`Account created successfully: ${userId}`);
      return {accountId: userId, account: accountData};
    } catch (error) {
      logger.error("Error creating account:", error);
      throw new HttpsError("internal", "Failed to create account");
    }
  }

  /**
   * Update account with validation and side effects
   */
  static async updateAccount(request: UpdateAccountRequest): Promise<void> {
    try {
      // Authorization check
      if (request.userId !== request.accountId) {
        // Check if user has admin access to this account
        const hasAccess = await this.checkAccountAccess(
          request.userId,
          request.accountId,
        );
        if (!hasAccess) {
          throw new HttpsError("permission-denied", "Insufficient permissions");
        }
      }

      const batch = db.batch();
      const accountRef = db.collection("accounts").doc(request.accountId);

      // Get current account data
      const accountDoc = await accountRef.get();
      if (!accountDoc.exists) {
        throw new HttpsError("not-found", "Account not found");
      }

      const currentData = accountDoc.data()!;
      // Split updates: public account fields vs private contact info
      const updates: any = {
        ...request.updates,
        lastModifiedAt: Timestamp.now(),
        lastModifiedBy: request.userId,
      };

      // Prepare contact info payload separately (do not store on main doc)
      let contactInfoUpdate: any | null = null;
      if (request.updates.contactInformation) {
        const ci = request.updates.contactInformation;
        // Geocode addresses if provided
        let processedAddresses = ci.addresses || [];
        if (processedAddresses.length > 0) {
          processedAddresses = await Promise.all(
            processedAddresses.map(async (addr) => {
              const addressString = [
                addr.street,
                addr.city,
                addr.state,
                addr.zipCode,
                addr.country,
              ]
                .filter(Boolean)
                .join(", ");
              if (addressString) {
                const geocoded = await geocodeAddress(addressString);
                return geocoded ? {...addr, ...geocoded} : addr;
              }
              return addr;
            }),
          );
        }
        contactInfoUpdate = {
          ...ci,
          ...(processedAddresses.length > 0
            ? {addresses: processedAddresses}
            : {}),
        };
        // Remove from main account updates
        delete updates.contactInformation;
      }

      // Update main account document (without contactInformation)
      batch.update(accountRef, updates);

      // Update contact info subdocument if provided
      if (contactInfoUpdate) {
        batch.set(
          accountRef.collection("sections").doc("contactInfo"),
          contactInfoUpdate,
          {merge: true},
        );
      }

      // Update related documents (relatedAccounts, relatedListings)
      await this.updateRelatedDocuments(batch, request.accountId, updates);

      // Update custom claims if necessary
      if (this.shouldUpdateClaims(currentData, updates)) {
        await this.updateUserClaims(request.accountId, {
          ...currentData,
          ...updates,
        });
      }

      await batch.commit();
      logger.info(`Account updated successfully: ${request.accountId}`);
    } catch (error) {
      logger.error("Error updating account:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update account");
    }
  }

  /**
   * Update gated account sections (professionalInfo, laborRights)
   * - Only allowed for user accounts (owner only)
   * - Ignored for group accounts (no-op)
   */
  static async updateAccountSections(request: {
    userId: string;
    accountId: string;
    professionalInformation?: any;
    laborRights?: any;
  }): Promise<void> {
    try {
      const {userId, accountId, professionalInformation, laborRights} = request;

      const accountRef = db.collection("accounts").doc(accountId);
      const snap = await accountRef.get();
      if (!snap.exists) {
        throw new HttpsError("not-found", "Account not found");
      }
      const account = snap.data() as any;

      // For user accounts, only the owner can edit these sections
      if (account.type === "user") {
        if (userId !== accountId) {
          throw new HttpsError("permission-denied", "Insufficient permissions");
        }

        const batch = db.batch();
        const sectionsRef = accountRef.collection("sections");

        if (professionalInformation !== undefined) {
          batch.set(
            sectionsRef.doc("professionalInfo"),
            professionalInformation,
            {
              merge: true,
            },
          );
        }
        if (laborRights !== undefined) {
          batch.set(sectionsRef.doc("laborRights"), laborRights, {merge: true});
        }

        await batch.commit();
        logger.info("Account sections updated", {
          accountId,
          userId,
          updated: {
            professionalInformation: professionalInformation !== undefined,
            laborRights: laborRights !== undefined,
          },
        });
        return;
      }

      // For groups, ignore these sections (no-op)
      logger.info("Ignoring sections update for non-user account", {
        accountId,
        type: account.type,
      });
      return;
    } catch (error) {
      logger.error("Error updating account sections:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update account sections");
    }
  }

  /**
   * Delete account and all related data
   */
  static async deleteAccount(userId: string, accountId: string): Promise<void> {
    try {
      // Authorization check
      if (userId !== accountId) {
        throw new HttpsError(
          "permission-denied",
          "Can only delete own account",
        );
      }

      const batch = db.batch();

      // Delete all related documents
      await this.deleteAccountRelations(batch, accountId);

      // Delete main account document
      batch.delete(db.collection("accounts").doc(accountId));

      await batch.commit();

      // Delete from Firebase Auth (this will trigger cleanup triggers)
      await auth.deleteUser(accountId);

      logger.info(`Account deleted successfully: ${accountId}`);
    } catch (error) {
      logger.error("Error deleting account:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to delete account");
    }
  }

  /**
   * Purge all Firestore data for an account (without deleting Auth user).
   * Safe to call even if some pieces are already missing.
   */
  static async purgeAccountData(accountId: string): Promise<void> {
    try {
      const batch = db.batch();
      await this.deleteAccountRelations(batch, accountId);
      // Delete main account document
      batch.delete(db.collection("accounts").doc(accountId));
      await batch.commit();
      logger.info(`Purged Firestore data for account: ${accountId}`);
    } catch (error) {
      logger.error("Error purging account data:", error);
      throw new HttpsError("internal", "Failed to purge account data");
    }
  }

  // Private helper methods
  private static async initializeAccountDefaults(
    batch: WriteBatch,
    accountId: string,
    accountType: string,
  ): Promise<void> {
    try {
      if (accountType !== "group") {
        logger.debug(
          `initializeAccountDefaults: skipping non-group account ${accountId} (${accountType})`,
        );
        return;
      }

      const accSnap = await db.collection("accounts").doc(accountId).get();
      if (!accSnap.exists) return;
      const acc = accSnap.data() || {};
      const groupType = acc.groupType || acc.groupDetails?.groupType;

      // Roles
      const roles = this.getStandardRolesForAccountType("group", groupType);
      const rolesCol = db
        .collection("accounts")
        .doc(accountId)
        .collection("roles");
      for (const role of roles) {
        const roleRef = rolesCol.doc();
        batch.set(roleRef, {
          id: roleRef.id,
          name: role.name,
          description: role.description,
          category: role.category,
          standardRoleTemplateId: role.id,
          permissions: role.defaultPermissions || [],
          icon: role.icon,
          isStandardRole: true,
          isCustomRole: false,
          applicableGroupTypes: role.applicableGroupTypes || [],
          suggestedChildRoles: role.suggestedChildRoles || [],
          createdAt: Timestamp.now(),
          lastModifiedAt: Timestamp.now(),
          createdBy: accountId,
          lastModifiedBy: accountId,
        });
      }

      // Projects
      const projects = this.getStandardProjectsForAccountType(
        "group",
        groupType,
      );
      const projectsCol = db
        .collection("accounts")
        .doc(accountId)
        .collection("projects");
      for (const project of projects) {
        const projRef = projectsCol.doc();
        batch.set(projRef, {
          id: projRef.id,
          name: project.name,
          description: project.description,
          accountId,
          archived: false,
          category: project.category,
          standardProjectTemplateId: project.id,
          icon: project.icon,
          color: project.color,
          complexity: project.complexity,
          estimatedTimeframe: project.estimatedTimeframe,
          defaultTasks: project.defaultTasks || [],
          requiredRoles: project.requiredRoles || [],
          suggestedMetrics: project.suggestedMetrics || [],
          createdAt: Timestamp.now(),
          lastModifiedAt: Timestamp.now(),
          createdBy: accountId,
          lastModifiedBy: accountId,
        });
      }
    } catch (err) {
      logger.warn("initializeAccountDefaults failed", {accountId, err});
    }
  }

  private static getStandardRolesForAccountType(
    accountType: string,
    groupType?: string,
  ): StandardRoleTemplate[] {
    if (accountType !== "group" || !groupType) return [];
    return STANDARD_ROLE_TEMPLATES.filter(
      (t) =>
        (t.applicableGroupTypes || []).includes(groupType) ||
        (t.applicableGroupTypes || []).includes("Community"),
    );
  }

  private static getStandardProjectsForAccountType(
    accountType: string,
    groupType?: string,
  ): StandardProjectTemplate[] {
    if (accountType !== "group" || !groupType) return [];
    const list = STANDARD_PROJECT_TEMPLATES.filter(
      (t) =>
        (t.applicableGroupTypes || []).includes(groupType) ||
        (t.applicableGroupTypes || []).includes("Community"),
    );
    if (list.length === 0) {
      const general = STANDARD_PROJECT_TEMPLATES.find(
        (t) => t.category === "General",
      );
      return general ? [general] : [];
    }
    return list;
  }

  private static async checkAccountAccess(
    userId: string,
    accountId: string,
  ): Promise<boolean> {
    // Owner can always update their own account
    if (userId === accountId) return true;

    // Fetch account to check denormalized admin/moderator arrays (for groups)
    const accountSnap = await db.collection("accounts").doc(accountId).get();
    if (!accountSnap.exists) return false;
    const account = accountSnap.data() as any;

    if (account?.type === "group") {
      const inAdmins =
        Array.isArray(account.adminIds) && account.adminIds.includes(userId);
      const inMods =
        Array.isArray(account.moderatorIds) &&
        account.moderatorIds.includes(userId);
      if (inAdmins || inMods) return true;
    }

    // Fallback to relatedAccounts membership: accepted + access admin/moderator
    const relSnap = await db
      .collection("accounts")
      .doc(accountId)
      .collection("relatedAccounts")
      .doc(userId)
      .get();
    if (relSnap.exists) {
      const rel = relSnap.data() as any;
      if (
        rel?.status === "accepted" &&
        ["admin", "moderator"].includes(rel?.access)
      ) {
        return true;
      }
    }

    return false;
  }

  private static async updateRelatedDocuments(
    batch: WriteBatch,
    accountId: string,
    updates: any,
  ): Promise<void> {
    try {
      // Update denormalized account references across the system
      const fieldsToSync = ["name", "iconImage"];
      const syncUpdates: any = {};

      // Only include fields that are being updated and need to be synced
      fieldsToSync.forEach((field) => {
        if (updates[field] !== undefined) {
          syncUpdates[field] = updates[field];
        }
      });

      if (Object.keys(syncUpdates).length === 0) {
        return; // No fields to sync
      }

      // Update related accounts that reference this account
      const relatedAccountsQuery = await db
        .collectionGroup("relatedAccounts")
        .where("id", "==", accountId)
        .get();

      relatedAccountsQuery.docs.forEach((doc) => {
        batch.update(doc.ref, syncUpdates);
      });

      // Update related listings that reference this account
      const relatedListingsQuery = await db
        .collectionGroup("relatedListings")
        .where("accountId", "==", accountId)
        .get();

      relatedListingsQuery.docs.forEach((doc) => {
        batch.update(doc.ref, syncUpdates);
      });

      logger.info(
        `Updated ${relatedAccountsQuery.size + relatedListingsQuery.size} related documents for account ${accountId}`,
      );
    } catch (error) {
      logger.error("Error updating related documents:", error);
      // Don't throw - this is a non-critical operation
    }
  }

  private static shouldUpdateClaims(currentData: any, updates: any): boolean {
    const claimFields = [
      "type",
      "name",
      "heroImage",
      "iconImage",
      "tagline",
      "settings",
    ];
    return claimFields.some((field) => currentData[field] !== updates[field]);
  }

  private static async updateUserClaims(
    userId: string,
    accountData: any,
  ): Promise<void> {
    const customClaims = {
      accountType: accountData.type,
      accountName: accountData.name,
      heroImage: accountData.heroImage,
      iconImage: accountData.iconImage,
      tagline: accountData.tagline,
      settings: accountData.settings,
    };

    await auth.setCustomUserClaims(userId, customClaims);
  }

  private static async deleteAccountRelations(
    batch: WriteBatch,
    accountId: string,
  ): Promise<void> {
    try {
      // Delete all subcollections recursively
      await this.deleteDocumentWithSubcollections(
        db.collection("accounts").doc(accountId),
      );

      // Delete all listings owned by this account (and their subcollections)
      const ownedListingsQuery = await db
        .collection("listings")
        .where("ownerAccountId", "==", accountId)
        .get();

      logger.info(
        `Found ${ownedListingsQuery.size} listings owned by account ${accountId}`,
      );

      for (const listingDoc of ownedListingsQuery.docs) {
        logger.info(`Deleting owned listing: ${listingDoc.id}`);
        // First delete all subcollections of this listing
        await this.deleteDocumentWithSubcollections(listingDoc.ref);
        // Then delete the listing document itself
        batch.delete(listingDoc.ref);
      }

      // Handle cross-collection references using the main batch
      // Remove this account from other accounts' relatedAccounts
      const relatedAccountsQuery = await db
        .collectionGroup("relatedAccounts")
        .where("id", "==", accountId)
        .get();

      logger.info(
        `Deleting ${relatedAccountsQuery.size} related account references`,
      );
      relatedAccountsQuery.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Remove this account from listings' relatedAccounts
      const listingRelationsQuery = await db
        .collectionGroup("relatedAccounts")
        .where("accountId", "==", accountId)
        .get();

      logger.info(
        `Deleting ${listingRelationsQuery.size} listing relation references`,
      );
      listingRelationsQuery.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Remove account references from relatedListings collections
      const relatedListingsQuery = await db
        .collectionGroup("relatedListings")
        .where("accountId", "==", accountId)
        .get();

      logger.info(
        `Deleting ${relatedListingsQuery.size} related listings references`,
      );
      relatedListingsQuery.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      logger.info(
        `Completed deletion of subcollections and queued cross-collection references for account ${accountId}`,
      );
    } catch (error) {
      logger.error("Error deleting account relations:", error);
      throw new HttpsError("internal", "Failed to delete account relations");
    }
  }

  /**
   * Recursively delete a document and all its subcollections
   */
  private static async deleteDocumentWithSubcollections(
    docRef: FirebaseFirestore.DocumentReference,
  ): Promise<void> {
    // Get all subcollections of this document
    const subcollections = await docRef.listCollections();

    logger.info(
      `Found ${subcollections.length} subcollections for document ${docRef.path}`,
    );

    // Delete each subcollection recursively
    for (const subcollection of subcollections) {
      logger.info(`Processing subcollection: ${subcollection.path}`);

      // Get all documents in this subcollection
      const docs = await subcollection.get();

      if (docs.size > 0) {
        logger.info(
          `Deleting ${docs.size} documents from ${subcollection.path}`,
        );

        // Process documents in batches
        const chunks = [];
        for (let i = 0; i < docs.docs.length; i += 450) {
          chunks.push(docs.docs.slice(i, i + 450));
        }

        for (const chunk of chunks) {
          const subBatch = db.batch();

          for (const doc of chunk) {
            // Recursively delete this document's subcollections first
            await this.deleteDocumentWithSubcollections(doc.ref);
            // Then delete the document itself
            subBatch.delete(doc.ref);
          }

          await subBatch.commit();
        }
      }
    }

    logger.info(`Completed deletion of all subcollections for ${docRef.path}`);
  }

  /**
   * Get account details with privacy controls
   */
  static async getAccount(
    accountId: string,
    requesterId: string,
  ): Promise<any> {
    try {
      const accountDoc = await db.collection("accounts").doc(accountId).get();
      if (!accountDoc.exists) {
        throw new HttpsError("not-found", "Account not found");
      }

      const account = accountDoc.data()!;

      // Apply privacy filtering based on requester permissions
      // TODO: Implement privacy controls

      return account;
    } catch (error) {
      logger.error("Error getting account:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get account");
    }
  }

  /**
   * Search accounts with advanced filters
   */
  static async searchAccounts(options: {
    query?: string;
    type?: string;
    location?: {latitude: number; longitude: number; radius?: number};
    skills?: string[];
    limit?: number;
    startAfter?: string;
    requesterId: string;
  }): Promise<{
    accounts: any[];
    hasMore: boolean;
    nextCursor?: string;
  }> {
    try {
      // Input validation
      if (options.limit && (options.limit < 1 || options.limit > 50)) {
        throw new HttpsError(
          "invalid-argument",
          "Limit must be between 1 and 50",
        );
      }

      if (options.location) {
        const {latitude, longitude, radius} = options.location;
        if (
          typeof latitude !== "number" ||
          typeof longitude !== "number" ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          throw new HttpsError(
            "invalid-argument",
            "Invalid location coordinates",
          );
        }
        if (radius && (radius < 1 || radius > 100)) {
          throw new HttpsError(
            "invalid-argument",
            "Radius must be between 1 and 100 km",
          );
        }
      }

      if (options.skills && options.skills.length > 10) {
        throw new HttpsError(
          "invalid-argument",
          "Maximum 10 skills allowed in search",
        );
      }

      const limit = Math.min(options.limit || 20, 50);

      // Query only active accounts
      let query = db
        .collection("accounts")
        .where("isActive", "==", true)
        .limit(limit + 1);

      logger.info("Search accounts - Starting query", {
        originalOptions: options,
        limit,
        filters: {
          isActive: true,
          type: options.type,
          hasLocation: !!options.location,
          hasSkills: !!options.skills,
          hasQuery: !!options.query,
        },
      });

      // Apply type filter
      if (options.type) {
        query = query.where("type", "==", options.type);
      }

      // Apply pagination
      if (options.startAfter) {
        const startAfterDoc = await db
          .collection("accounts")
          .doc(options.startAfter)
          .get();
        if (startAfterDoc.exists) {
          query = query.startAfter(startAfterDoc);
        }
      }

      const snapshot = await query.get();
      logger.info("Search accounts - After Firestore query", {
        foundDocuments: snapshot.docs.length,
        isEmpty: snapshot.empty,
      });

      let accounts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      logger.info("Search accounts - Raw accounts", {
        accountCount: accounts.length,
        accountIds: accounts.map((acc) => acc.id),
        accountNames: accounts.map((acc) => acc.name),
        accountTypes: accounts.map((acc) => acc.type),
      });

      // Apply location filtering (post-query for geographic search)
      if (options.location) {
        const {latitude, longitude, radius = 25} = options.location;
        accounts = accounts.filter((account) => {
          if (!account.location?.coordinates) return false;
          const distance = this.calculateDistance(
            latitude,
            longitude,
            account.location.coordinates.latitude,
            account.location.coordinates.longitude,
          );
          return distance <= radius;
        });
      }

      // Apply skills filtering
      if (options.skills && options.skills.length > 0) {
        const skillsLower = options.skills.map((s) => s.toLowerCase());
        accounts = accounts.filter((account) => {
          if (!account.skills || !Array.isArray(account.skills)) return false;
          const accountSkills = account.skills.map((s: string) =>
            s.toLowerCase(),
          );
          return skillsLower.some((skill) =>
            accountSkills.some((accountSkill: string) =>
              accountSkill.includes(skill),
            ),
          );
        });
      }

      // Apply text search (name, description)
      if (options.query) {
        const queryLower = options.query.toLowerCase();
        accounts = accounts.filter((account) => {
          const searchText = [
            account.name || "",
            account.description || "",
            account.username || "",
          ]
            .join(" ")
            .toLowerCase();
          return searchText.includes(queryLower);
        });
      }

      // Determine pagination
      const hasMore = accounts.length > limit;
      const resultAccounts = accounts.slice(0, limit);

      // Remove sensitive data
      const publicAccounts = resultAccounts.map((account) => ({
        id: account.id,
        name: account.name,
        username: account.username,
        type: account.type,
        description: account.description,
        skills: account.skills,
        location: account.location
          ? {
              address: account.location.address,
              city: account.location.city,
              state: account.location.state,
              country: account.location.country,
            }
          : null,
        iconImage: account.iconImage, // Keep using iconImage for consistency
        verified: account.verified,
        rating: account.rating,
        projectCount: account.projectCount,
        createdAt: account.createdAt,
        tagline: account.tagline, // Add tagline to the returned data
      }));

      return {
        accounts: publicAccounts,
        hasMore,
        nextCursor: hasMore
          ? resultAccounts[resultAccounts.length - 1].id
          : undefined,
      };
    } catch (error) {
      if (error instanceof HttpsError) {
        throw error;
      }
      logger.error("Error searching accounts:", error);
      throw new HttpsError("internal", "Failed to search accounts");
    }
  }

  /**
   * Get groups where the user is an admin or moderator (owner implicit via adminIds short-circuit)
   */
  static async getUserManageableAccounts(
    userId: string,
    limit: number = 50,
  ): Promise<any[]> {
    try {
      const groupsAdmin = await db
        .collection("accounts")
        .where("type", "==", "group")
        .where("adminIds", "array-contains", userId)
        .limit(limit)
        .get();
      const groupsModerator = await db
        .collection("accounts")
        .where("type", "==", "group")
        .where("moderatorIds", "array-contains", userId)
        .limit(limit)
        .get();

      const map: Record<string, any> = {};
      groupsAdmin.docs.forEach(
        (doc) => (map[doc.id] = {id: doc.id, ...doc.data()}),
      );
      groupsModerator.docs.forEach(
        (doc) => (map[doc.id] = {id: doc.id, ...doc.data()}),
      );

      // Return minimal fields needed for selection
      return Object.values(map).map((acc: any) => ({
        id: acc.id,
        name: acc.name,
        type: acc.type,
        iconImage: acc.iconImage,
      }));
    } catch (error) {
      logger.error("Error getting manageable accounts:", error);
      throw new HttpsError("internal", "Failed to get manageable accounts");
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Migration function: Add isActive: true to all existing accounts that don't have it
   * This should be run once to fix legacy accounts
   */
  static async migrateAccountsIsActive(): Promise<{
    updated: number;
    alreadyHadField: number;
    total: number;
  }> {
    try {
      logger.info("Starting accounts isActive migration...");

      const batch = db.batch();
      let batchCount = 0;
      let updated = 0;
      let alreadyHadField = 0;
      let total = 0;

      // Get all accounts
      const snapshot = await db.collection("accounts").get();
      total = snapshot.docs.length;

      logger.info(`Found ${total} accounts to check`);

      for (const doc of snapshot.docs) {
        const data = doc.data();

        if (data.isActive === undefined) {
          // Account doesn't have isActive field, add it
          batch.update(doc.ref, {isActive: true});
          updated++;
          batchCount++;

          // Firestore batch limit is 500 operations
          if (batchCount >= 450) {
            await batch.commit();
            logger.info(`Committed batch of ${batchCount} updates`);
            batchCount = 0;
          }
        } else {
          alreadyHadField++;
        }
      }

      // Commit remaining operations
      if (batchCount > 0) {
        await batch.commit();
        logger.info(`Committed final batch of ${batchCount} updates`);
      }

      const result = {updated, alreadyHadField, total};
      logger.info("Migration completed:", result);
      return result;
    } catch (error) {
      logger.error("Error in accounts isActive migration:", error);
      throw new HttpsError("internal", "Migration failed");
    }
  }
}
