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

      const accountData = {
        id: userId,
        name: name,
        tagline: tagline,
        type: data.type,
        iconImage:
          data.iconImage ||
          "assets/image/logo/ASCENDynamics NFP-logos_transparent.png",
        heroImage: data.heroImage || "assets/image/userhero.png",
        contactInformation: {
          emails: data.contactInformation?.emails || [
            {email: userRecord.email},
          ],
          phoneNumbers: data.contactInformation?.phoneNumbers || [],
          addresses: geocodedAddresses,
        },
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
        createdAt: Timestamp.now(),
        createdBy: userId,
        lastLoginAt: Timestamp.now(),
        lastModifiedAt: Timestamp.now(),
        lastModifiedBy: userId,
      };

      // Set account document
      batch.set(accountRef, accountData);

      // Set up contact info in gated subdocument
      if (accountData.contactInformation) {
        batch.set(
          accountRef.collection("sections").doc("contactInfo"),
          accountData.contactInformation,
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
      const updates: any = {
        ...request.updates,
        lastModifiedAt: Timestamp.now(),
        lastModifiedBy: request.userId,
      };

      // Handle address geocoding if addresses changed
      if (request.updates.contactInformation?.addresses) {
        const geocodedAddresses = await Promise.all(
          request.updates.contactInformation.addresses.map(async (addr) => {
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
        updates.contactInformation = {
          ...currentData.contactInformation,
          ...request.updates.contactInformation,
          addresses: geocodedAddresses,
        };
      }

      // Update main account document
      batch.update(accountRef, updates);

      // Update contact info subdocument if changed
      if (updates.contactInformation) {
        batch.set(
          accountRef.collection("sections").doc("contactInfo"),
          updates.contactInformation,
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
    // Check if user has admin role in the account
    const relatedAccountDoc = await db
      .collection("accounts")
      .doc(accountId)
      .collection("relatedAccounts")
      .doc(userId)
      .get();

    if (!relatedAccountDoc.exists) return false;

    const relation = relatedAccountDoc.data();
    return (
      relation?.status === "active" &&
      ["admin", "owner"].includes(relation?.relationship)
    );
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
      // Delete all subcollections of the account
      const subcollections = [
        "roles",
        "projects",
        "relatedAccounts",
        "relatedListings",
        "timeEntries",
        "contactInfo",
      ];

      for (const subcollection of subcollections) {
        const subColRef = db
          .collection("accounts")
          .doc(accountId)
          .collection(subcollection);
        const docs = await subColRef.get();
        docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      // Remove this account from other accounts' relatedAccounts
      const relatedAccountsQuery = await db
        .collectionGroup("relatedAccounts")
        .where("id", "==", accountId)
        .get();

      relatedAccountsQuery.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Remove this account from listings' relatedAccounts
      const listingRelationsQuery = await db
        .collectionGroup("relatedAccounts")
        .where("accountId", "==", accountId)
        .get();

      listingRelationsQuery.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Remove account references from relatedListings collections
      const relatedListingsQuery = await db
        .collectionGroup("relatedListings")
        .where("accountId", "==", accountId)
        .get();

      relatedListingsQuery.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      logger.info(
        `Queued deletion of related documents for account ${accountId}`,
      );
    } catch (error) {
      logger.error("Error deleting account relations:", error);
      throw new HttpsError("internal", "Failed to delete account relations");
    }
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
      let query = db
        .collection("accounts")
        .where("isActive", "==", true)
        .limit(limit + 1);

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
      let accounts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

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
        profileImage: account.profileImage,
        verified: account.verified,
        rating: account.rating,
        projectCount: account.projectCount,
        createdAt: account.createdAt,
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
}
