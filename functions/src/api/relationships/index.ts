/**
 * Relationship Management API - Callable functions for account relationships
 */
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import {
  RelationshipService,
  CreateRelationshipRequest,
  UpdateRelationshipRequest,
} from "../../services/relationshipService";

/**
 * Send a relationship request (follow, join group, etc.)
 */
export const createRelationship = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const data = request.data as CreateRelationshipRequest & {
      access?: "admin" | "moderator" | "member";
      idempotencyKey?: string;
    };

    // Validate required fields: targetAccountId AND at least one of (relationship, access)
    if (!data.targetAccountId || (!data.relationship && !data.access)) {
      throw new HttpsError(
        "invalid-argument",
        "Target account ID and relationship or access are required",
      );
    }

    // Validate relationship/access values when present
    const validRelationships = ["member", "admin", "follower", "friend"];
    if (data.relationship && !validRelationships.includes(data.relationship)) {
      throw new HttpsError("invalid-argument", "Invalid relationship type");
    }
    const validAccess = ["admin", "moderator", "member"] as const;
    if (data.access && !validAccess.includes(data.access as any)) {
      throw new HttpsError("invalid-argument", "Invalid access role");
    }

    // Prevent self-relationships
    if (userId === data.targetAccountId) {
      throw new HttpsError(
        "invalid-argument",
        "Cannot create relationship with yourself",
      );
    }

    try {
      await RelationshipService.createRelationship(userId, data);

      logger.info(`Relationship request created`, {
        initiatorId: userId,
        targetAccountId: data.targetAccountId,
        relationship: data.relationship,
      });

      return {
        success: true,
        message: "Relationship request sent successfully",
      };
    } catch (error) {
      logger.error("Relationship creation failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Relationship request failed");
    }
  },
);

/**
 * Update relationship status (accept, reject, block)
 */
export const updateRelationship = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {targetAccountId, ...updateData} = request.data as {
      targetAccountId: string;
    } & UpdateRelationshipRequest;

    if (!targetAccountId || !updateData.status) {
      throw new HttpsError(
        "invalid-argument",
        "Target account ID and status are required",
      );
    }

    // Validate status
    const validStatuses = ["accepted", "rejected", "blocked"];
    if (!validStatuses.includes(updateData.status)) {
      throw new HttpsError("invalid-argument", "Invalid status");
    }

    try {
      await RelationshipService.updateRelationship(
        userId,
        targetAccountId,
        updateData,
      );

      logger.info(`Relationship updated`, {
        userId,
        targetAccountId,
        status: updateData.status,
      });

      return {
        success: true,
        message: `Relationship ${updateData.status} successfully`,
      };
    } catch (error) {
      logger.error("Relationship update failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Relationship update failed");
    }
  },
);

/**
 * Remove/delete a relationship
 */
export const deleteRelationship = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {targetAccountId} = request.data as {targetAccountId: string};

    if (!targetAccountId) {
      throw new HttpsError("invalid-argument", "Target account ID is required");
    }

    try {
      await RelationshipService.deleteRelationship(userId, targetAccountId);

      logger.info(`Relationship deleted`, {
        userId,
        targetAccountId,
      });

      return {
        success: true,
        message: "Relationship removed successfully",
      };
    } catch (error) {
      logger.error("Relationship deletion failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Relationship deletion failed");
    }
  },
);

/**
 * Get relationships for an account
 */
export const getRelationships = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "512MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {
      accountId,
      status,
      access,
      limit = 20,
      startAfter,
    } = request.data as {
      accountId?: string;
      status?: string;
      access?: "admin" | "moderator" | "member";
      limit?: number;
      startAfter?: string;
    };

    const targetAccountId = accountId || userId; // Default to own account

    try {
      const results = await RelationshipService.getRelationships(
        targetAccountId,
        userId,
        {
          status,
          access,
          limit: Math.min(limit, 50),
          startAfter,
        },
      );

      return {
        success: true,
        relationships: results.relationships,
        hasMore: results.hasMore,
        nextCursor: results.nextCursor,
      };
    } catch (error) {
      logger.error("Get relationships failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get relationships");
    }
  },
);

/**
 * Get pending relationship requests for the current user
 */
export const getPendingRequests = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {limit = 20, access} = request.data as {
      limit?: number;
      access?: "admin" | "moderator" | "member";
    };

    try {
      const results = await RelationshipService.getRelationships(
        userId,
        userId,
        {
          status: "pending",
          access,
          limit: Math.min(limit, 50),
        },
      );

      return {
        success: true,
        pendingRequests: results.relationships,
        hasMore: results.hasMore,
        nextCursor: results.nextCursor,
      };
    } catch (error) {
      logger.error("Get pending requests failed:", error);
      throw new HttpsError("internal", "Failed to get pending requests");
    }
  },
);

/**
 * Get relationship stats for an account
 */
export const getRelationshipStats = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {accountId} = request.data as {accountId?: string};

    const targetAccountId = accountId || userId;

    try {
      const stats = await RelationshipService.getRelationshipStats(
        targetAccountId,
        userId,
      );

      return {
        success: true,
        stats,
      };
    } catch (error) {
      logger.error("Get relationship stats failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get relationship stats");
    }
  },
);

/**
 * Bulk manage relationships (for admin operations)
 */
export const bulkUpdateRelationships = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {targetAccountIds, status, access} = request.data as {
      targetAccountIds: string[];
      status: "accepted" | "rejected" | "blocked";
      access?: "admin" | "moderator" | "member";
    };

    if (!targetAccountIds || !Array.isArray(targetAccountIds) || !status) {
      throw new HttpsError(
        "invalid-argument",
        "Target account IDs and status are required",
      );
    }

    if (targetAccountIds.length > 50) {
      throw new HttpsError(
        "invalid-argument",
        "Cannot update more than 50 relationships at once",
      );
    }

    try {
      const results = await RelationshipService.bulkUpdateRelationships(
        userId,
        targetAccountIds,
        {status, access},
      );

      logger.info(`Bulk relationship update completed`, {
        userId,
        count: targetAccountIds.length,
        status,
      });

      return {
        success: true,
        updated: results.updated,
        failed: results.failed,
      };
    } catch (error) {
      logger.error("Bulk relationship update failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Bulk relationship update failed");
    }
  },
);
