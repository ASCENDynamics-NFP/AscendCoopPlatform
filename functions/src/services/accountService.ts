/**
 * Account Service - Centralized business logic for account operations
 */
import {
  getFirestore,
  Timestamp,
  WriteBatch,
  FieldValue,
  GeoPoint,
} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";
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
// Lazy access to Storage (without require)
type AdminStorage = ReturnType<typeof getStorage>;
let storageSingleton: AdminStorage | undefined;
function getAdminStorage(): AdminStorage {
  if (!storageSingleton) {
    storageSingleton = getStorage();
  }
  return storageSingleton as AdminStorage;
}

export interface CreateAccountRequest {
  type?: "user" | "group" | "new";
  name: string;
  tagline?: string;
  contactInformation?: {
    emails?: Array<{email: string; type?: string}>;
    phoneNumbers?: Array<{number: string; type?: string}>;
    addresses?: Array<{
      street?: string;
      city?: string;
      state?: string;
      zipcode?: string;
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
      const normalizedType: "user" | "group" =
        data?.type === "group" ? "group" : "user";
      const payload: CreateAccountRequest = {
        ...data,
        type: normalizedType,
      };
      // Input validation
      ValidationUtils.validateUserId(userId);
      ValidationUtils.validateRequiredFields(
        payload,
        ["name", "type"],
        "account data",
      );

      // Validate account fields
      const name = ValidationUtils.sanitizeString(payload.name, 100);
      if (!name) {
        throw new HttpsError(
          "invalid-argument",
          "Account name cannot be empty",
        );
      }

      const tagline = payload.tagline
        ? ValidationUtils.sanitizeString(payload.tagline, 200)
        : "New and looking to help!";

      // Validate account type
      const allowedTypes = ["user", "group", "new"];
      ValidationUtils.validateEnum(
        normalizedType,
        allowedTypes,
        "account type",
      );

      // Validate contact information if provided
      if (payload.contactInformation) {
        if (payload.contactInformation.emails) {
          payload.contactInformation.emails.forEach((emailObj, index) => {
            if (!ValidationUtils.validateEmail(emailObj.email)) {
              throw new HttpsError(
                "invalid-argument",
                `Invalid email format at index ${index}`,
              );
            }
          });
        }

        if (payload.contactInformation.phoneNumbers) {
          payload.contactInformation.phoneNumbers.forEach((phoneObj, index) => {
            if (!ValidationUtils.validatePhoneNumber(phoneObj.number)) {
              throw new HttpsError(
                "invalid-argument",
                `Invalid phone number format at index ${index}`,
              );
            }
          });
        }

        if (payload.contactInformation.addresses) {
          payload.contactInformation.addresses.forEach((addr, index) => {
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
      if (
        payload.iconImage &&
        !ValidationUtils.validateUrl(payload.iconImage)
      ) {
        throw new HttpsError("invalid-argument", "Invalid icon image URL");
      }
      if (
        payload.heroImage &&
        !ValidationUtils.validateUrl(payload.heroImage)
      ) {
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
      let geocodedAddresses = payload.contactInformation?.addresses || [];
      if (geocodedAddresses.length > 0) {
        geocodedAddresses = await Promise.all(
          geocodedAddresses.map(async (addr) => {
            // Convert address object to string for geocoding
            const addressString = [
              addr.street,
              addr.city,
              addr.state,
              addr.zipcode,
              addr.country,
            ]
              .filter(Boolean)
              .join(", ");

            if (addressString) {
              const geocoded = await geocodeAddress(addressString);
              if (geocoded) {
                return {
                  ...addr,
                  formatted: geocoded.formatted_address,
                  geopoint: new GeoPoint(geocoded.lat, geocoded.lng),
                };
              }
            }
            return addr;
          }),
        );
      }

      // Prepare contact info for private subdocument only
      const contactInfoPayload = {
        emails: payload.contactInformation?.emails || [
          {email: userRecord.email},
        ],
        phoneNumbers: payload.contactInformation?.phoneNumbers || [],
        addresses: geocodedAddresses,
      };

      const accountData = {
        id: userId,
        name: name,
        tagline: tagline,
        type: normalizedType,
        iconImage:
          payload.iconImage ||
          "assets/image/logo/ASCENDynamics NFP-logos_transparent.png",
        heroImage: payload.heroImage || "assets/image/userhero.png",
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

      // Set up contact info in sections/contactInfo document (not on main account)
      if (contactInfoPayload) {
        const contactInfoDocRef = accountRef
          .collection("sections")
          .doc("contactInfo");
        batch.set(
          contactInfoDocRef,
          {
            ...contactInfoPayload,
            createdAt: Timestamp.now(),
            createdBy: userId,
            lastModifiedAt: Timestamp.now(),
            lastModifiedBy: userId,
          },
          {merge: true},
        );
      }

      // Initialize standard roles and projects based on account type
      await this.initializeAccountDefaults(batch, userId, normalizedType);

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
                addr.zipcode,
                addr.country,
              ]
                .filter(Boolean)
                .join(", ");
              if (addressString) {
                const geocoded = await geocodeAddress(addressString);
                if (geocoded) {
                  return {
                    ...addr,
                    formatted: geocoded.formatted_address,
                    geopoint: new GeoPoint(geocoded.lat, geocoded.lng),
                  };
                }
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

      // Update contact info in sections/contactInfo document if provided
      // Use a transaction to safely handle createdAt/createdBy preservation
      if (contactInfoUpdate) {
        const contactInfoDocRef = accountRef
          .collection("sections")
          .doc("contactInfo");
        await db.runTransaction(async (transaction) => {
          const existingContactDoc = await transaction.get(contactInfoDocRef);
          const isNewDoc = !existingContactDoc.exists;
          // Use set WITHOUT merge to fully replace the document
          // This ensures arrays (addresses, emails, phoneNumbers) are completely replaced
          // Only add createdAt/createdBy on new document creation
          transaction.set(contactInfoDocRef, {
            ...contactInfoUpdate,
            ...(isNewDoc
              ? {createdAt: Timestamp.now(), createdBy: request.userId}
              : {}),
            lastModifiedAt: Timestamp.now(),
            lastModifiedBy: request.userId,
          });
        });
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

      // Delete from Firebase Auth (best-effort; ignore if already gone)
      try {
        await auth.deleteUser(accountId);
      } catch (e: any) {
        if (e?.code !== "auth/user-not-found") {
          throw e;
        }
        logger.warn("Auth user already absent during deleteAccount", {
          accountId,
        });
      }

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

      const ownedListingRefs: FirebaseFirestore.DocumentReference[] = [];
      for (const listingDoc of ownedListingsQuery.docs) {
        logger.info(`Deleting owned listing: ${listingDoc.id}`);

        // Before deleting the listing, remove mirrored relatedListings from all accounts
        try {
          const relatedAccountsSnap = await listingDoc.ref
            .collection("relatedAccounts")
            .get();
          const relatedAccountIds = relatedAccountsSnap.docs.map((d) => d.id);

          if (relatedAccountIds.length > 0) {
            await this.deleteInChunks(
              relatedAccountIds.map((relatedId) =>
                db
                  .collection("accounts")
                  .doc(relatedId)
                  .collection("relatedListings")
                  .doc(listingDoc.id),
              ),
            );
          }

          // Best-effort cleanup: remove any stray mirrors via collection group
          try {
            const cg = await db
              .collectionGroup("relatedListings")
              .where("id", "==", listingDoc.id)
              .get();
            if (!cg.empty) {
              await this.deleteInChunks(cg.docs.map((d) => d.ref));
            }
          } catch (cgErr) {
            logger.warn(
              "Best-effort CG cleanup for relatedListings failed (non-fatal):",
              cgErr,
            );
          }
        } catch (mirrorErr) {
          logger.warn(
            "Failed to remove mirrored relatedListings prior to listing delete (non-fatal):",
            mirrorErr,
          );
        }

        // First delete all subcollections of this listing
        await this.deleteDocumentWithSubcollections(listingDoc.ref);
        // Then queue the listing document itself for chunked deletion
        ownedListingRefs.push(listingDoc.ref);
      }

      if (ownedListingRefs.length > 0) {
        await this.deleteInChunks(ownedListingRefs);
      }

      // Handle cross-collection references using best-effort cleanups
      // Remove this account from any relatedAccounts (across accounts and listings)
      try {
        const relatedAccountsQuery = await db
          .collectionGroup("relatedAccounts")
          .where("id", "==", accountId)
          .get();

        logger.info(
          `Deleting ${relatedAccountsQuery.size} relatedAccounts references for account ${accountId}`,
        );
        if (!relatedAccountsQuery.empty) {
          await this.deleteInChunks(
            relatedAccountsQuery.docs.map((d) => d.ref),
          );
        }
      } catch (e) {
        logger.warn(
          "Best-effort CG cleanup for relatedAccounts failed (non-fatal)",
          e,
        );
      }

      // Remove any remaining relatedListings documents that belong to this account
      // Note: direct subcollection under this account was already deleted recursively above
      // This collection group query is a safety net for legacy or stray docs
      try {
        const strayRelatedListings = await db
          .collectionGroup("relatedListings")
          .where("accountId", "==", accountId)
          .get();
        if (!strayRelatedListings.empty) {
          logger.info(
            `Deleting ${strayRelatedListings.size} stray relatedListings for account ${accountId}`,
          );
          await this.deleteInChunks(
            strayRelatedListings.docs.map((d) => d.ref),
          );
        }
      } catch (e) {
        logger.warn(
          "Best-effort CG cleanup for relatedListings (by accountId) failed (non-fatal)",
          e,
        );
      }

      // Messaging cleanup: remove user's messages, detach from chats, and delete any attached files
      await this.cleanupMessagingForAccount(accountId);

      // Delete any user encryption/public key documents (if present)
      try {
        await db.collection("userKeys").doc(accountId).delete();
      } catch (e) {
        logger.warn("userKeys doc deletion non-fatal", {accountId, e});
      }

      // Remove user-owned files under accounts/{accountId}/ in Storage (resume, applications, etc.)
      try {
        const bucket = getAdminStorage().bucket();
        const prefix = `accounts/${accountId}/`;
        const [files] = await bucket.getFiles({prefix});
        if (files.length > 0) {
          // Delete in manageable chunks
          for (let i = 0; i < files.length; i += 400) {
            const chunk = files.slice(i, i + 400);
            await Promise.all(
              chunk.map((f) =>
                f.delete().catch((err: any) =>
                  logger.warn("Storage delete (accounts/*) non-fatal", {
                    path: f.name,
                    err,
                  }),
                ),
              ),
            );
          }
        }
      } catch (e) {
        logger.warn(
          "Failed to cleanup Storage under accounts/{accountId} (non-fatal)",
          {
            accountId,
            e,
          },
        );
      }

      logger.info(
        `Completed deletion of subcollections and queued cross-collection references for account ${accountId}`,
      );
    } catch (error) {
      logger.error("Error deleting account relations:", error);
      throw new HttpsError("internal", "Failed to delete account relations");
    }
  }

  /** Delete a list of DocumentReferences in batch chunks */
  private static async deleteInChunks(
    refs: FirebaseFirestore.DocumentReference[],
    chunkSize: number = 450,
  ): Promise<void> {
    for (let i = 0; i < refs.length; i += chunkSize) {
      const chunk = refs.slice(i, i + chunkSize);
      const batch = db.batch();
      chunk.forEach((ref) => batch.delete(ref));
      await batch.commit();
    }
  }

  /**
   * Remove a user's messages and detach them from chats; delete any files they attached.
   */
  private static async cleanupMessagingForAccount(
    accountId: string,
  ): Promise<void> {
    try {
      // Find chats where the user participates
      const chatsSnap = await db
        .collection("chats")
        .where("participants", "array-contains", accountId)
        .get();

      if (chatsSnap.empty) {
        logger.info("No chats found for account; messaging cleanup skipped", {
          accountId,
        });
        return;
      }

      const bucket = getAdminStorage().bucket();

      for (const chatDoc of chatsSnap.docs) {
        const chatRef = chatDoc.ref;
        const chatId = chatDoc.id;

        // 1) Delete this user's messages in the chat (and any attached files)
        const userMessagesSnap = await chatRef
          .collection("messages")
          .where("senderId", "==", accountId)
          .get();

        if (!userMessagesSnap.empty) {
          // Collect storage files to delete
          const storagePathsToDelete: string[] = [];

          userMessagesSnap.docs.forEach((msg) => {
            const data: any = msg.data() || {};
            // Direct fileUrl (legacy)
            if (data.fileUrl) {
              const p = this.tryParseStoragePath(data.fileUrl, bucket.name);
              if (p) storagePathsToDelete.push(p);
            }
            // Attachments array (newer)
            const attachments = Array.isArray(data.attachments)
              ? data.attachments
              : [];
            attachments.forEach((att: any) => {
              if (att?.fileUrl) {
                const p = this.tryParseStoragePath(att.fileUrl, bucket.name);
                if (p) storagePathsToDelete.push(p);
              }
              if (att?.thumbnailUrl) {
                const p = this.tryParseStoragePath(
                  att.thumbnailUrl,
                  bucket.name,
                );
                if (p) storagePathsToDelete.push(p);
              }
            });
          });

          // Delete message documents in chunks
          await this.deleteInChunks(userMessagesSnap.docs.map((d) => d.ref));

          // Delete associated storage files (best-effort)
          for (let i = 0; i < storagePathsToDelete.length; i += 400) {
            const chunk = storagePathsToDelete.slice(i, i + 400);
            await Promise.all(
              chunk.map((path) =>
                bucket
                  .file(path)
                  .delete()
                  .catch((err: any) =>
                    logger.warn("Storage delete (chat files) non-fatal", {
                      path,
                      err,
                    }),
                  ),
              ),
            );
          }
        }

        // 2) Detach user from chat participants
        try {
          await chatRef.update({
            participants: FieldValue.arrayRemove(accountId),
            admins: FieldValue.arrayRemove(accountId),
            lastModifiedAt: Timestamp.now(),
            lastModifiedBy: accountId,
          });
        } catch (e) {
          logger.warn("Chat update (participants remove) non-fatal", {
            chatId,
            accountId,
            e,
          });
        }

        // 3) If the chat now has no participants, delete it entirely (and its subcollections)
        try {
          const refreshed = await chatRef.get();
          const participants = (refreshed.data() || {}).participants || [];
          if (!Array.isArray(participants) || participants.length === 0) {
            await this.deleteDocumentWithSubcollections(chatRef);
            await chatRef.delete();

            // Best-effort: remove any remaining chat storage directory (supports both chatMedia/ and chats/ schemes)
            const prefixes = [`chatMedia/${chatId}/`, `chats/${chatId}/`];
            for (const prefix of prefixes) {
              try {
                const [files] = await bucket.getFiles({prefix});
                if (files && files.length > 0) {
                  for (let i = 0; i < files.length; i += 400) {
                    const chunk = files.slice(i, i + 400);
                    await Promise.all(
                      chunk.map((f) =>
                        f.delete().catch((err: any) =>
                          logger.warn("Storage delete (chat dir) non-fatal", {
                            path: f.name,
                            err,
                          }),
                        ),
                      ),
                    );
                  }
                }
              } catch (e) {
                logger.warn(
                  "Failed to cleanup chat storage prefix (non-fatal)",
                  {
                    chatId,
                    prefix,
                    e,
                  },
                );
              }
            }
          }
        } catch (e) {
          logger.warn("Chat empty-check/cleanup non-fatal", {chatId, e});
        }
      }
    } catch (err) {
      logger.warn("Messaging cleanup finished with warnings", {accountId, err});
    }
  }

  /**
   * Attempt to turn a Firebase Storage URL into an object path within the bucket.
   * Supports gs://, firebasestorage.googleapis.com, and storage.googleapis.com.
   */
  private static tryParseStoragePath(
    url: string,
    bucketName: string,
  ): string | null {
    try {
      if (!url || typeof url !== "string") return null;
      if (url.startsWith("gs://")) {
        const rest = url.replace(/^gs:\/\//, "");
        const idx = rest.indexOf("/");
        if (idx === -1) return null;
        const b = rest.substring(0, idx);
        const path = rest.substring(idx + 1);
        return b === bucketName ? path : null;
      }
      if (url.includes("firebasestorage.googleapis.com")) {
        // Format: https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<encodedPath>?alt=media
        const m = url.match(/\/o\/([^?]+)/);
        if (!m) return null;
        const encoded = m[1];
        const path = decodeURIComponent(encoded);
        return path.startsWith(bucketName + "/")
          ? path.substring(bucketName.length + 1)
          : path; // sometimes path is already without bucket prefix
      }
      if (url.includes("storage.googleapis.com")) {
        // Format: https://storage.googleapis.com/<bucket>/<path>
        const m = url.match(/storage\.googleapis\.com\/([^/]+)\/(.+)$/);
        if (!m) return null;
        const b = m[1];
        const path = m[2];
        return b === bucketName ? path : null;
      }
      // Might already be a path-like string
      if (
        url.startsWith("chatMedia/") ||
        url.startsWith("chats/") ||
        url.startsWith("accounts/")
      ) {
        return url;
      }
    } catch (e) {
      // ignore
    }
    return null;
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

      // Fetch contactInformation for group accounts (for map display)
      // PRIVACY: Only include addresses if contactInformation visibility is 'public'
      // This respects the privacy settings without requiring viewer authentication
      const accountsWithContactInfo = await Promise.all(
        resultAccounts.map(async (account) => {
          if (account.type === "group") {
            try {
              // Check privacy settings first
              const contactInfoVisibility =
                account.privacySettings?.contactInformation?.visibility;

              // Only include contact info if visibility is explicitly 'public'
              // Default to NOT including if visibility is missing or set to anything else
              if (contactInfoVisibility !== "public") {
                return account;
              }

              const contactInfoDoc = await db
                .collection("accounts")
                .doc(account.id)
                .collection("sections")
                .doc("contactInfo")
                .get();

              if (contactInfoDoc.exists) {
                const contactData = contactInfoDoc.data();
                // Only include addresses (with geopoints) for map display
                // Exclude sensitive data like emails and phone numbers
                if (
                  contactData?.addresses &&
                  contactData.addresses.length > 0
                ) {
                  return {
                    ...account,
                    contactInformation: {
                      addresses: contactData.addresses.map((addr: any) => ({
                        street: addr.street,
                        city: addr.city,
                        state: addr.state,
                        country: addr.country,
                        zipcode: addr.zipcode,
                        isPrimaryAddress: addr.isPrimaryAddress,
                        geopoint: addr.geopoint, // Include geopoint for map
                        formatted: addr.formatted,
                      })),
                    },
                  };
                }
              }
            } catch (err) {
              // If we can't fetch contact info, just return account without it
              logger.warn(
                `Could not fetch contactInfo for group ${account.id}:`,
                err,
              );
            }
          }
          return account;
        }),
      );

      // Remove sensitive data
      const publicAccounts = accountsWithContactInfo.map((account) => ({
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
        // Include contactInformation for groups (addresses only, for map display)
        contactInformation: account.contactInformation || null,
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
