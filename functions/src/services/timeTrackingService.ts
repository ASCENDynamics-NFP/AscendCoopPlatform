/**
 * Time Tracking Service - Centralized time entry operations
 */
import {getFirestore, Timestamp} from "firebase-admin/firestore";
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
  static async updateTimeEntry(request: UpdateTimeEntryRequest): Promise<void> {
    try {
      const timeEntryDoc = await db
        .collection("timeEntries")
        .doc(request.timeEntryId)
        .get();

      if (!timeEntryDoc.exists) {
        throw new HttpsError("not-found", "Time entry not found");
      }

      const timeEntry = timeEntryDoc.data()!;

      // Check permissions
      if (
        timeEntry.userId !== request.userId &&
        timeEntry.createdBy !== request.userId
      ) {
        throw new HttpsError(
          "permission-denied",
          "Cannot update this time entry",
        );
      }

      const batch = db.batch();
      const now = Timestamp.now();

      const updates = {
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

      logger.info(`Time entry updated: ${request.timeEntryId}`);
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
    } = {},
  ): Promise<any[]> {
    try {
      // Check permissions
      await this.validateTimeEntryPermissions(userId, accountId);

      let query = db
        .collection("accounts")
        .doc(accountId)
        .collection("timeEntries")
        .orderBy("date", "desc");

      if (options.startDate) {
        query = query.where("date", ">=", options.startDate);
      }

      if (options.endDate) {
        query = query.where("date", "<=", options.endDate);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.offset(options.offset);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
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
      await this.validateTimeEntryPermissions(userId, accountId);

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
        .where("date", ">=", startDate.toISOString().split("T")[0])
        .get();

      let totalHours = 0;
      let volunteerHours = 0;
      let paidHours = 0;
      const categoryCounts: {[key: string]: number} = {};

      query.docs.forEach((doc) => {
        const data = doc.data();
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
  ): Promise<void> {
    // Basic permission check - user should be a member of the account
    const relatedAccountDoc = await db
      .collection("accounts")
      .doc(accountId)
      .collection("relatedAccounts")
      .doc(userId)
      .get();

    if (!relatedAccountDoc.exists) {
      throw new HttpsError("permission-denied", "No access to this account");
    }

    const relation = relatedAccountDoc.data()!;
    if (relation.status !== "accepted") {
      throw new HttpsError("permission-denied", "Account access not approved");
    }
  }
}
