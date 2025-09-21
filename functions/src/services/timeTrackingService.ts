/**
 * Time Tracking Service - Centralized time entry operations
 */
import {getFirestore, Timestamp, Query} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {HttpsError} from "firebase-functions/v2/https";

const db = getFirestore();

export interface CreateTimeEntryRequest {
  accountId: string;
  listingId?: string;
  projectId?: string;
  date: string; // ISO date string
  hours: number;
  description?: string;
  category?: string;
  isVolunteer?: boolean;
  notes?: string;
  noteHistory?: any[];
  userName?: string;
  projectName?: string;
}

export interface UpdateTimeEntryRequest {
  timeEntryId: string;
  updates: Partial<
    CreateTimeEntryRequest & {
      status: "draft" | "pending" | "approved" | "rejected";
    }
  >;
  userId: string;
}

export class TimeTrackingService {
  /**
   * Create a new time entry
   */
  static async createTimeEntry(
    userId: string,
    request: CreateTimeEntryRequest,
  ): Promise<{timeEntryId: string; timeEntry: any}> {
    try {
      // Validate permissions
      await this.validateTimeEntryPermissions(userId, request.accountId);

      const timeEntryRef = db.collection("timeEntries").doc();
      const now = Timestamp.now();

      const timeEntryData = {
        id: timeEntryRef.id,
        accountId: request.accountId,
        listingId: request.listingId || null,
        projectId: request.projectId || null,
        userId,
        date: request.date,
        hours: request.hours,
        description: request.description || "",
        category: request.category || "general",
        isVolunteer: request.isVolunteer || false,
        notes: request.notes ?? request.description ?? "",
        noteHistory: request.noteHistory ?? [],
        userName: request.userName || "",
        projectName: request.projectName || "",
        status: "draft", // New entries start as draft
        createdAt: now,
        createdBy: userId,
        lastModifiedAt: now,
        lastModifiedBy: userId,
      };

      const batch = db.batch();

      // Create main time entry
      batch.set(timeEntryRef, timeEntryData);

      // Add to account's time entries subcollection
      const accountTimeEntryRef = db
        .collection("accounts")
        .doc(request.accountId)
        .collection("timeEntries")
        .doc(timeEntryRef.id);

      batch.set(accountTimeEntryRef, {
        ...timeEntryData,
        accountId: request.accountId,
      });

      // Add to listing's time entries if applicable
      if (request.listingId) {
        const listingTimeEntryRef = db
          .collection("listings")
          .doc(request.listingId)
          .collection("timeEntries")
          .doc(timeEntryRef.id);

        batch.set(listingTimeEntryRef, {
          ...timeEntryData,
          listingId: request.listingId,
        });
      }

      await batch.commit();

      logger.info(`Time entry created: ${timeEntryRef.id}`, {
        userId,
        accountId: request.accountId,
        hours: request.hours,
      });

      return {
        timeEntryId: timeEntryRef.id,
        timeEntry: timeEntryData,
      };
    } catch (error) {
      logger.error("Error creating time entry:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to create time entry");
    }
  }

  /**
   * Update an existing time entry
   */
  static async updateTimeEntry(
    request: UpdateTimeEntryRequest,
  ): Promise<{timeEntryId: string; timeEntry: any}> {
    try {
      const timeEntryDoc = await db
        .collection("timeEntries")
        .doc(request.timeEntryId)
        .get();

      if (!timeEntryDoc.exists) {
        throw new HttpsError("not-found", "Time entry not found");
      }

      const timeEntry = timeEntryDoc.data()!;

      // Prevent updates to approved time entries unless it's a status change by an admin
      if (timeEntry.status === "approved") {
        const isStatusChangeByAdmin =
          request.updates?.status && timeEntry.userId !== request.userId;

        if (!isStatusChangeByAdmin) {
          throw new HttpsError(
            "permission-denied",
            "Cannot modify approved time entries. Please contact an administrator if changes are needed.",
          );
        }
      }

      const requestedStatus = request.updates?.status;
      if (
        requestedStatus &&
        ["approved", "rejected"].includes(requestedStatus) &&
        timeEntry.userId === request.userId
      ) {
        throw new HttpsError(
          "permission-denied",
          "Cannot approve or reject your own time entry",
        );
      }

      const hasDirectAccess =
        timeEntry.userId === request.userId ||
        timeEntry.createdBy === request.userId;

      if (!hasDirectAccess) {
        try {
          await this.validateTimeEntryPermissions(
            request.userId,
            timeEntry.accountId,
            {
              requireAdmin: true,
            },
          );
        } catch (permissionError) {
          throw new HttpsError(
            "permission-denied",
            "Cannot update this time entry",
          );
        }
      }

      const batch = db.batch();
      const now = Timestamp.now();

      const updates: any = {
        ...request.updates,
        lastModifiedAt: now,
        lastModifiedBy: request.userId,
      };

      // Update main time entry
      batch.update(timeEntryDoc.ref, updates);

      // Update in account subcollection
      if (timeEntry.accountId) {
        const accountTimeEntryRef = db
          .collection("accounts")
          .doc(timeEntry.accountId)
          .collection("timeEntries")
          .doc(request.timeEntryId);

        batch.update(accountTimeEntryRef, updates);
      }

      // Update in listing subcollection if applicable
      if (timeEntry.listingId) {
        const listingTimeEntryRef = db
          .collection("listings")
          .doc(timeEntry.listingId)
          .collection("timeEntries")
          .doc(request.timeEntryId);

        batch.update(listingTimeEntryRef, updates);
      }

      await batch.commit();

      const updatedTimeEntry = {
        ...timeEntry,
        ...updates,
        notes: updates.notes ?? timeEntry.notes ?? "",
        noteHistory: updates.noteHistory ?? timeEntry.noteHistory ?? [],
        userName: updates.userName ?? timeEntry.userName ?? "",
        projectName: updates.projectName ?? timeEntry.projectName ?? "",
      };

      logger.info(`Time entry updated: ${request.timeEntryId}`);

      return {
        timeEntryId: request.timeEntryId,
        timeEntry: updatedTimeEntry,
      };
    } catch (error) {
      logger.error("Error updating time entry:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update time entry");
    }
  }

  /**
   * Delete a time entry
   */
  static async deleteTimeEntry(
    timeEntryId: string,
    userId: string,
  ): Promise<void> {
    try {
      const timeEntryDoc = await db
        .collection("timeEntries")
        .doc(timeEntryId)
        .get();

      if (!timeEntryDoc.exists) {
        throw new HttpsError("not-found", "Time entry not found");
      }

      const timeEntry = timeEntryDoc.data()!;

      // Prevent deletion of approved time entries
      if (timeEntry.status === "approved") {
        throw new HttpsError(
          "permission-denied",
          "Cannot delete approved time entries. Please contact an administrator if changes are needed.",
        );
      }

      // Check permissions
      if (timeEntry.userId !== userId && timeEntry.createdBy !== userId) {
        throw new HttpsError(
          "permission-denied",
          "Cannot delete this time entry",
        );
      }

      const batch = db.batch();

      // Delete main time entry
      batch.delete(timeEntryDoc.ref);

      // Delete from account subcollection
      if (timeEntry.accountId) {
        const accountTimeEntryRef = db
          .collection("accounts")
          .doc(timeEntry.accountId)
          .collection("timeEntries")
          .doc(timeEntryId);

        batch.delete(accountTimeEntryRef);
      }

      // Delete from listing subcollection if applicable
      if (timeEntry.listingId) {
        const listingTimeEntryRef = db
          .collection("listings")
          .doc(timeEntry.listingId)
          .collection("timeEntries")
          .doc(timeEntryId);

        batch.delete(listingTimeEntryRef);
      }

      await batch.commit();

      logger.info(`Time entry deleted: ${timeEntryId}`);
    } catch (error) {
      logger.error("Error deleting time entry:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to delete time entry");
    }
  }

  /**
   * Get time entries for an account
   */
  static async getAccountTimeEntries(
    accountId: string,
    userId: string,
    options: {
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
      userId?: string;
      projectId?: string;
    } = {},
  ): Promise<any[]> {
    try {
      const filterUserId = options.userId;
      const requireAdmin = !filterUserId || filterUserId !== userId;

      // Check permissions
      await this.validateTimeEntryPermissions(userId, accountId, {
        requireAdmin,
      });

      let query: Query = db
        .collection("accounts")
        .doc(accountId)
        .collection("timeEntries");

      if (filterUserId) {
        query = query.where("userId", "==", filterUserId);
      }

      if (options.projectId) {
        query = query.where("projectId", "==", options.projectId);
      }

      const snapshot = await query.get();
      let entries = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

      if (options.startDate || options.endDate) {
        const startDate = options.startDate
          ? this.toDate(options.startDate)
          : null;
        const endDate = options.endDate ? this.toDate(options.endDate) : null;

        entries = entries.filter((entry) => {
          const entryDate = this.toDate((entry as any).date);
          if (!entryDate) return false;
          if (startDate && entryDate < startDate) return false;
          if (endDate && entryDate > endDate) return false;
          return true;
        });
      }

      entries.sort((a, b) => {
        const dateA = this.toDate((a as any).date) || new Date(0);
        const dateB = this.toDate((b as any).date) || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      if (options.offset) {
        entries = entries.slice(options.offset);
      }

      if (options.limit) {
        entries = entries.slice(0, options.limit);
      }

      return entries;
    } catch (error) {
      logger.error("Error getting account time entries:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get time entries");
    }
  }

  /**
   * Get time tracking stats for an account
   */
  static async getTimeTrackingStats(
    accountId: string,
    userId: string,
    period: "week" | "month" | "year" = "month",
  ): Promise<any> {
    try {
      // Check permissions
      await this.validateTimeEntryPermissions(userId, accountId, {
        requireAdmin: true,
      });

      const now = new Date();
      let startDate: Date;

      switch (period) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const query = await db
        .collection("accounts")
        .doc(accountId)
        .collection("timeEntries")
        .get();

      let totalHours = 0;
      let volunteerHours = 0;
      let paidHours = 0;
      const categoryCounts: {[key: string]: number} = {};

      query.docs.forEach((doc) => {
        const data = doc.data();
        const entryDate = this.toDate(data.date);
        if (!entryDate || entryDate < startDate) {
          return;
        }

        const hours = data.hours || 0;

        totalHours += hours;

        if (data.isVolunteer) {
          volunteerHours += hours;
        } else {
          paidHours += hours;
        }

        const category = data.category || "general";
        categoryCounts[category] = (categoryCounts[category] || 0) + hours;
      });

      return {
        period,
        totalHours,
        volunteerHours,
        paidHours,
        totalEntries: query.size,
        categoryCounts,
        startDate: startDate.toISOString().split("T")[0],
        endDate: now.toISOString().split("T")[0],
      };
    } catch (error) {
      logger.error("Error getting time tracking stats:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get time tracking stats");
    }
  }

  // Private helper methods
  private static async validateTimeEntryPermissions(
    userId: string,
    accountId: string,
    options: {requireAdmin?: boolean} = {},
  ): Promise<void> {
    const requireAdmin = options.requireAdmin ?? false;

    const accountSnap = await db.collection("accounts").doc(accountId).get();
    if (!accountSnap.exists) {
      throw new HttpsError("not-found", "Account not found");
    }

    const account = accountSnap.data() as any;

    // Allow access when acting on one's own account document
    if (userId === accountId) {
      return;
    }

    const adminIds = Array.isArray(account?.adminIds) ? account.adminIds : [];
    const moderatorIds = Array.isArray(account?.moderatorIds)
      ? account.moderatorIds
      : [];
    const isCreator = account?.createdBy === userId;
    const hasElevatedAccess =
      adminIds.includes(userId) || moderatorIds.includes(userId);

    if (isCreator || hasElevatedAccess) {
      return;
    }

    const relatedAccountsRef = db
      .collection("accounts")
      .doc(accountId)
      .collection("relatedAccounts");

    let relationDoc = await relatedAccountsRef.doc(userId).get();

    if (!relationDoc.exists) {
      const relationQuery = await relatedAccountsRef
        .where("targetId", "==", userId)
        .limit(1)
        .get();

      if (!relationQuery.empty) {
        relationDoc = relationQuery.docs[0];
      }
    }

    if (!relationDoc.exists) {
      const altRelationQuery = await relatedAccountsRef
        .where("relatedAccountId", "==", userId)
        .limit(1)
        .get();

      if (!altRelationQuery.empty) {
        relationDoc = altRelationQuery.docs[0];
      }
    }

    if (!relationDoc.exists) {
      throw new HttpsError("permission-denied", "No access to this account");
    }

    const relation = relationDoc.data() as any;
    const approvedStatuses = ["accepted"];
    if (!approvedStatuses.includes(relation?.status)) {
      throw new HttpsError("permission-denied", "Account access not approved");
    }

    if (requireAdmin) {
      const accessLevel = relation?.access || relation?.role;
      const hasAdminPrivileges = ["admin", "moderator"].includes(accessLevel);
      if (!hasAdminPrivileges) {
        throw new HttpsError(
          "permission-denied",
          "Admin access required for this action",
        );
      }
    }
  }

  private static toDate(value: any): Date | null {
    if (!value) {
      return null;
    }

    if (value && typeof value.seconds === "number") {
      return new Date(value.seconds * 1000 + (value.nanoseconds ?? 0) / 1e6);
    }

    if (value && typeof value._seconds === "number") {
      return new Date(value._seconds * 1000 + (value._nanoseconds ?? 0) / 1e6);
    }

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }
}
