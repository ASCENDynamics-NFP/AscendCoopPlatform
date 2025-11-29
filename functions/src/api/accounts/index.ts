/**
 * Account Management API - Callable functions for account operations
 */
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import {
  AccountService,
  CreateAccountRequest,
} from "../../services/accountService";
import {googleApiKey} from "../../utils/geocoding";

/**
 * Create a new account
 */
export const createAccount = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: [googleApiKey],
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const data = request.data as Partial<CreateAccountRequest>;
    const normalizedType: "user" | "group" =
      data?.type === "group" ? "group" : "user";

    if (!data?.name) {
      throw new HttpsError("invalid-argument", "Name is required");
    }

    const payload: CreateAccountRequest = {
      ...data,
      name: data.name,
      type: normalizedType,
    };

    try {
      const result = await AccountService.createAccount(userId, payload);

      logger.info(`Account created via API: ${result.accountId}`, {
        userId,
        accountType: payload.type,
      });

      return {
        success: true,
        accountId: result.accountId,
        account: result.account,
      };
    } catch (error) {
      logger.error("Account creation failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Account creation failed");
    }
  },
);

/**
 * Update an existing account
 */
export const updateAccount = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false, // Temporarily disabled for testing
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: [googleApiKey],
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {accountId, updates} = request.data as {
      accountId: string;
      updates: Partial<CreateAccountRequest>;
    };

    if (!accountId) {
      throw new HttpsError("invalid-argument", "Account ID is required");
    }

    try {
      await AccountService.updateAccount({
        accountId,
        updates,
        userId,
      });

      logger.info(`Account updated via API: ${accountId}`, {
        userId,
        updatedFields: Object.keys(updates),
      });

      return {
        success: true,
        message: "Account updated successfully",
      };
    } catch (error) {
      logger.error("Account update failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Account update failed");
    }
  },
);

/**
 * Get account details with privacy controls
 */
export const getAccount = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {accountId} = request.data as {accountId: string};

    if (!accountId) {
      throw new HttpsError("invalid-argument", "Account ID is required");
    }

    try {
      const account = await AccountService.getAccount(accountId, userId);

      return {
        success: true,
        account,
      };
    } catch (error) {
      logger.error("Get account failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to retrieve account");
    }
  },
);

/**
 * Search accounts with filters
 */
export const searchAccounts = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "512MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {
      query,
      type,
      location,
      limit = 20,
      startAfter,
    } = request.data as {
      query?: string;
      type?: string;
      location?: {latitude: number; longitude: number; radius?: number};
      limit?: number;
      startAfter?: string;
    };

    try {
      const results = await AccountService.searchAccounts({
        query,
        type,
        location,
        limit: Math.min(limit, 50), // Cap at 50
        startAfter,
        requesterId: userId,
      });

      return {
        success: true,
        accounts: results.accounts,
        hasMore: results.hasMore,
        nextCursor: results.nextCursor,
      };
    } catch (error) {
      logger.error("Account search failed:", error);
      throw new HttpsError("internal", "Search failed");
    }
  },
);

/**
 * Get groups where the current user is admin/moderator
 */
export const getUserManageableAccounts = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }
    const userId = request.auth.uid;
    try {
      const accounts = await AccountService.getUserManageableAccounts(userId);
      return {success: true, accounts};
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get manageable accounts");
    }
  },
);

/**
 * Delete account (self-service)
 */
export const deleteMyAccount = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "512MiB",
    timeoutSeconds: 120,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;

    try {
      await AccountService.deleteAccount(userId, userId);

      logger.info(`Account self-deleted: ${userId}`);

      return {
        success: true,
        message: "Account deleted successfully",
      };
    } catch (error) {
      logger.error("Account deletion failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Account deletion failed");
    }
  },
);

/**
 * Update gated account sections (professionalInfo, laborRights)
 */
export const updateAccountSections = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {accountId, professionalInformation, laborRights} = request.data as {
      accountId: string;
      professionalInformation?: any;
      laborRights?: any;
    };

    if (!accountId) {
      throw new HttpsError("invalid-argument", "Account ID is required");
    }

    try {
      await AccountService.updateAccountSections({
        userId,
        accountId,
        professionalInformation,
        laborRights,
      });

      logger.info("Account sections updated via API", {
        userId,
        accountId,
        professionalInformation: professionalInformation !== undefined,
        laborRights: laborRights !== undefined,
      });
      return {success: true};
    } catch (error) {
      logger.error("Update account sections failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Update account sections failed");
    }
  },
);

/**
 * Migration function: Add isActive: true to all existing accounts
 * Should be run once to fix legacy accounts
 */
export const migrateAccountsIsActive = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "512MiB",
    timeoutSeconds: 300,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    // Only allow admins to run migrations - you can customize this check
    // For now, we'll allow any authenticated user, but you should restrict this
    logger.info(`Migration requested by user: ${request.auth.uid}`);

    try {
      const result = await AccountService.migrateAccountsIsActive();

      logger.info("Migration completed successfully", result);

      return {
        success: true,
        ...result,
        message: `Migration completed: ${result.updated} accounts updated, ${result.alreadyHadField} already had isActive field`,
      };
    } catch (error) {
      logger.error("Migration failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Migration failed");
    }
  },
);
