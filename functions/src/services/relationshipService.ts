/**
 * Relationship Service - Manage account-to-account relationships
 */
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {HttpsError} from "firebase-functions/v2/https";
import {NotificationService} from "./notificationService";
import {syncAdminIdsForAccount} from "./denorm";

const db = getFirestore();

export interface CreateRelationshipRequest {
  targetAccountId: string;
  // Access role for account memberships (for groups). Optional for plain connections.
  access?: "member" | "admin" | "moderator";
  // Optional request type flag for clarity
  requestType?: "request" | "invitation";
  // Optional role metadata for initial assignment
  role?: string;
  roleId?: string;
  roleIds?: string[];
  idempotencyKey?: string;
}

export interface UpdateRelationshipRequest {
  status?: "accepted" | "declined" | "blocked";
  // For account.relatedAccounts we no longer store relationship; use access roles
  access?: "member" | "admin" | "moderator";
  // Optional role metadata updates
  role?: string;
  roleId?: string;
  roleIds?: string[];
  // Optional: act on behalf of this account (e.g., group) if caller is owner/admin
  accountId?: string;
}

export class RelationshipService {
  /**
   * Send a relationship request (follow, join group, etc.)
   */
  static async createRelationship(
    initiatorId: string,
    request: CreateRelationshipRequest,
  ): Promise<void> {
    try {
      const {
        targetAccountId,
        access,
        idempotencyKey,
        requestType,
        role,
        roleId,
        roleIds,
      } = request;

      // Validate accounts exist
      const [initiatorDoc, targetDoc] = await Promise.all([
        db.collection("accounts").doc(initiatorId).get(),
        db.collection("accounts").doc(targetAccountId).get(),
      ]);

      if (!initiatorDoc.exists) {
        throw new HttpsError("not-found", "Initiator account not found");
      }
      if (!targetDoc.exists) {
        throw new HttpsError("not-found", "Target account not found");
      }

      const initiator = initiatorDoc.data()!;
      const target = targetDoc.data()!;

      // Check if relationship already exists
      const existingRelationship = await db
        .collection("accounts")
        .doc(targetAccountId)
        .collection("relatedAccounts")
        .doc(initiatorId)
        .get();

      if (existingRelationship.exists) {
        const existing = existingRelationship.data()! as {status?: string};
        if (existing.status === "accepted" || existing.status === "pending") {
          // Idempotent: already exists in desired state; nothing to do
          logger.info("Idempotent create: relationship already exists", {
            initiatorId,
            targetAccountId,
            status: existing.status,
          });
          return;
        }
      }

      // Determine initial status based on relationship type and target account settings
      // Default initial status for connections/memberships
      const initialStatus: "accepted" | "pending" = "pending";

      const now = Timestamp.now();
      // Determine request type if not supplied
      const inferredRequestType: "request" | "invitation" =
        requestType || (initiator.type === "group" ? "invitation" : "request");

      // Map requested relationship/access to access for group memberships
      const requestedAccess = access;
      const initialAccess =
        target.type === "group" ? requestedAccess : undefined;

      await db.runTransaction(async (tx) => {
        const targetRef = db
          .collection("accounts")
          .doc(targetAccountId)
          .collection("relatedAccounts")
          .doc(initiatorId);
        const initiatorRef = db
          .collection("accounts")
          .doc(initiatorId)
          .collection("relatedAccounts")
          .doc(targetAccountId);

        const [targetSnap, initiatorSnap] = await Promise.all([
          tx.get(targetRef),
          tx.get(initiatorRef),
        ]);
        if (targetSnap.exists && initiatorSnap.exists) {
          // Both already present -> idempotent
          return;
        }

        const targetRelationship = {
          id: initiatorId,
          accountId: targetAccountId,
          name: initiator.name,
          iconImage: initiator.iconImage || null,
          tagline: initiator.tagline || null,
          type: initiator.type || null,
          status: initialStatus,
          ...(initialAccess ? {access: initialAccess} : {}),
          requestType: inferredRequestType,
          ...(role ? {role} : {}),
          ...(roleId ? {roleId} : {}),
          ...(roleIds && roleIds.length ? {roleIds} : {}),
          initiatorId,
          targetId: targetAccountId,
          ...(idempotencyKey ? {idempotencyKey} : {}),
          createdAt: now,
          createdBy: initiatorId,
          lastModifiedAt: now,
          lastModifiedBy: initiatorId,
        };
        const initiatorRelationship = {
          id: targetAccountId,
          accountId: initiatorId,
          name: target.name,
          iconImage: target.iconImage || null,
          tagline: target.tagline || null,
          type: target.type || null,
          status: initialStatus,
          ...(initialAccess ? {access: initialAccess} : {}),
          requestType: inferredRequestType,
          ...(role ? {role} : {}),
          ...(roleId ? {roleId} : {}),
          ...(roleIds && roleIds.length ? {roleIds} : {}),
          initiatorId,
          targetId: targetAccountId,
          ...(idempotencyKey ? {idempotencyKey} : {}),
          createdAt: now,
          createdBy: initiatorId,
          lastModifiedAt: now,
          lastModifiedBy: initiatorId,
        };

        if (!targetSnap.exists) tx.set(targetRef, targetRelationship);
        if (!initiatorSnap.exists) tx.set(initiatorRef, initiatorRelationship);
      });

      // Recompute adminIds/moderatorIds for both sides (safe on non-groups)
      await Promise.all([
        syncAdminIdsForAccount(initiatorId),
        syncAdminIdsForAccount(targetAccountId),
      ]);

      // Trigger notification for pending requests
      if (initialStatus === "pending") {
        await this.sendRelationshipNotification(targetAccountId, initiatorId);
      }

      logger.info("Relationship created", {
        initiatorId,
        targetAccountId,
        status: initialStatus,
      });

      // Send notification if this is a request (not auto-accepted)
      if (initialStatus === "pending") {
        try {
          await NotificationService.notifyRelationshipRequest(
            targetAccountId,
            initiatorId,
            initiator.name || "Someone",
          );
        } catch (notificationError) {
          logger.error(
            "Failed to send relationship notification:",
            notificationError,
          );
          // Don't fail the whole operation for notification failures
        }
      }
    } catch (error) {
      logger.error("Error creating relationship:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to create relationship");
    }
  }

  /**
   * Update relationship status (accept, reject, block)
   */
  static async updateRelationship(
    userId: string,
    targetAccountId: string,
    request: UpdateRelationshipRequest,
  ): Promise<void> {
    try {
      const {status, access, role, roleId, roleIds, accountId} = request;

      // Determine which account's relationship is being updated.
      // Default to the caller's own account; allow acting on behalf of a group when admin.
      const sourceAccountId = accountId || userId;

      if (accountId && accountId !== userId) {
        const authorized = await this.isAccountAdmin(accountId, userId);
        if (!authorized) {
          throw new HttpsError(
            "permission-denied",
            "Not authorized to manage this account's relationships",
          );
        }
      }

      // Get existing relationships
      const [targetRelationship, initiatorRelationship] = await Promise.all([
        db
          .collection("accounts")
          .doc(sourceAccountId)
          .collection("relatedAccounts")
          .doc(targetAccountId)
          .get(),
        db
          .collection("accounts")
          .doc(targetAccountId)
          .collection("relatedAccounts")
          .doc(sourceAccountId)
          .get(),
      ]);

      if (!targetRelationship.exists || !initiatorRelationship.exists) {
        throw new HttpsError("not-found", "Relationship not found");
      }

      const now = Timestamp.now();
      await db.runTransaction(async (tx) => {
        const targetRef = db
          .collection("accounts")
          .doc(sourceAccountId)
          .collection("relatedAccounts")
          .doc(targetAccountId);
        const initiatorRef = db
          .collection("accounts")
          .doc(targetAccountId)
          .collection("relatedAccounts")
          .doc(sourceAccountId);

        const [targetSnap, initiatorSnap] = await Promise.all([
          tx.get(targetRef),
          tx.get(initiatorRef),
        ]);
        if (!targetSnap.exists || !initiatorSnap.exists) {
          throw new HttpsError("not-found", "Relationship not found");
        }

        const updates: any = {
          ...(status ? {status} : {}),
          ...(access ? {access} : {}),
          ...(role ? {role} : {}),
          ...(roleId ? {roleId} : {}),
          ...(roleIds !== undefined ? {roleIds} : {}),
          ...(status ? {reviewedAt: now, reviewedBy: userId} : {}),
          lastModifiedAt: now,
          lastModifiedBy: userId,
        };
        tx.update(targetRef, updates);
        tx.update(initiatorRef, updates);
      });

      // Recompute adminIds/moderatorIds for both sides
      await Promise.all([
        syncAdminIdsForAccount(sourceAccountId),
        syncAdminIdsForAccount(targetAccountId),
      ]);

      logger.info("Relationship updated", {
        userId,
        accountId: sourceAccountId,
        targetAccountId,
        status,
        access: access,
      });
    } catch (error) {
      logger.error("Error updating relationship:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update relationship");
    }
  }

  /** Check if user is owner/admin/moderator of the given account (group) */
  private static async isAccountAdmin(
    accountId: string,
    userId: string,
  ): Promise<boolean> {
    const snap = await db.collection("accounts").doc(accountId).get();
    if (!snap.exists) return false;
    const acc = snap.data() as any;
    if (acc.type !== "group") return false;
    if (userId === accountId) return true; // group owner short-circuit
    const inAdmins =
      Array.isArray(acc.adminIds) && acc.adminIds.includes(userId);
    const inMods =
      Array.isArray(acc.moderatorIds) && acc.moderatorIds.includes(userId);
    return inAdmins || inMods;
  }

  /**
   * Remove/delete a relationship
   */
  static async deleteRelationship(
    userId: string,
    targetAccountId: string,
    accountId?: string,
  ): Promise<void> {
    try {
      const sourceAccountId = accountId || userId;
      if (accountId && accountId !== userId) {
        const authorized = await this.isAccountAdmin(accountId, userId);
        if (!authorized) {
          throw new HttpsError(
            "permission-denied",
            "Not authorized to manage this account's relationships",
          );
        }
      }
      await db.runTransaction(async (tx) => {
        const aRef = db
          .collection("accounts")
          .doc(sourceAccountId)
          .collection("relatedAccounts")
          .doc(targetAccountId);
        const bRef = db
          .collection("accounts")
          .doc(targetAccountId)
          .collection("relatedAccounts")
          .doc(sourceAccountId);
        tx.delete(aRef);
        tx.delete(bRef);
      });

      await Promise.all([
        syncAdminIdsForAccount(sourceAccountId),
        syncAdminIdsForAccount(targetAccountId),
      ]);

      logger.info("Relationship deleted", {
        userId,
        accountId: sourceAccountId,
        targetAccountId,
      });
    } catch (error) {
      logger.error("Error deleting relationship:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to delete relationship");
    }
  }

  /**
   * Get relationships for an account with pagination
   */
  static async getRelationships(
    accountId: string,
    requesterId: string,
    options: {
      status?: string;
      access?: "admin" | "moderator" | "member";
      limit?: number;
      startAfter?: string;
    } = {},
  ): Promise<{
    relationships: any[];
    hasMore: boolean;
    nextCursor?: string;
  }> {
    try {
      // Check if requester has permission to view relationships
      const canViewRelationships = await this.canViewRelationships(
        accountId,
        requesterId,
      );
      if (!canViewRelationships) {
        throw new HttpsError(
          "permission-denied",
          "Cannot view these relationships",
        );
      }

      let query = db
        .collection("accounts")
        .doc(accountId)
        .collection("relatedAccounts")
        .orderBy("createdAt", "desc");

      // Apply filters
      if (options.status) {
        query = query.where("status", "==", options.status);
      }
      if (options.access) {
        query = query.where("access", "==", options.access);
      }

      // Apply pagination
      const limit = Math.min(options.limit || 20, 50);
      if (options.startAfter) {
        const startAfterDoc = await db
          .collection("accounts")
          .doc(accountId)
          .collection("relatedAccounts")
          .doc(options.startAfter)
          .get();
        if (startAfterDoc.exists) {
          query = query.startAfter(startAfterDoc);
        }
      }

      const snapshot = await query.limit(limit + 1).get();
      const hasMore = snapshot.docs.length > limit;
      const relationships = snapshot.docs.slice(0, limit).map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const nextCursor = hasMore
        ? relationships[relationships.length - 1].id
        : undefined;

      return {
        relationships,
        hasMore,
        nextCursor,
      };
    } catch (error) {
      logger.error("Error getting relationships:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get relationships");
    }
  }

  // Private helper methods (reserved for future use)

  // No reciprocal relationship stored for account.relatedAccounts

  // Relationship-to-access mapping removed

  // normalizeAccess removed (not needed currently)

  private static async sendRelationshipNotification(
    targetAccountId: string,
    initiatorId: string,
  ): Promise<void> {
    // Implementation would depend on your notification system
    // This is where you'd trigger push notifications, emails, etc.
    logger.info("Relationship notification sent", {
      targetAccountId,
      initiatorId,
    });
  }

  // adminIds sync handled via denorm helper

  private static async canViewRelationships(
    accountId: string,
    requesterId: string,
  ): Promise<boolean> {
    // Owner can always view their own relationships
    if (accountId === requesterId) {
      return true;
    }

    // Check if requester has admin access to the account
    const relationshipDoc = await db
      .collection("accounts")
      .doc(accountId)
      .collection("relatedAccounts")
      .doc(requesterId)
      .get();

    if (relationshipDoc.exists) {
      const relationship = relationshipDoc.data()!;
      return (
        relationship.status === "accepted" &&
        ["admin", "moderator"].includes(relationship.access)
      );
    }

    // Check account privacy settings
    const accountDoc = await db.collection("accounts").doc(accountId).get();
    if (accountDoc.exists) {
      const account = accountDoc.data()!;
      return account.privacySettings?.relationships?.visibility === "public";
    }

    return false;
  }

  /**
   * Get relationship statistics for an account
   */
  static async getRelationshipStats(
    accountId: string,
    requesterId: string,
  ): Promise<{
    total: number;
    accepted: number;
    pending: number;
    byAccess: Record<string, number>;
  }> {
    try {
      const canView = await this.canViewRelationships(accountId, requesterId);
      if (!canView) {
        throw new HttpsError(
          "permission-denied",
          "Cannot view relationship stats",
        );
      }

      const snapshot = await db
        .collection("accounts")
        .doc(accountId)
        .collection("relatedAccounts")
        .get();

      const stats = {
        total: snapshot.size,
        accepted: 0,
        pending: 0,
        byAccess: {} as Record<string, number>,
      };

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.status === "accepted") stats.accepted++;
        if (data.status === "pending") stats.pending++;

        const access = data.access || "unknown";
        stats.byAccess[access] = (stats.byAccess[access] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error("Error getting relationship stats:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get relationship stats");
    }
  }

  /**
   * Bulk update multiple relationships
   */
  static async bulkUpdateRelationships(
    userId: string,
    targetAccountIds: string[],
    updates: {status: string; access?: string},
  ): Promise<{updated: number; failed: string[]}> {
    try {
      const results = {updated: 0, failed: [] as string[]};

      // Process in batches to avoid Firestore limits
      const batchSize = 500;
      for (let i = 0; i < targetAccountIds.length; i += batchSize) {
        const batch = targetAccountIds.slice(i, i + batchSize);

        for (const targetId of batch) {
          try {
            await this.updateRelationship(userId, targetId, {
              status: updates.status as any,
              access: updates.access as any,
            });
            results.updated++;
          } catch (error) {
            logger.warn(
              `Failed to update relationship with ${targetId}:`,
              error,
            );
            results.failed.push(targetId);
          }
        }
      }

      return results;
    } catch (error) {
      logger.error("Error in bulk update relationships:", error);
      throw new HttpsError("internal", "Bulk update failed");
    }
  }
}
