/**
 * Time Tracking API - Callable functions for time tracking
 */
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import {
  TimeTrackingService,
  CreateTimeEntryRequest,
} from "../../services/timeTrackingService";

/**
 * Create a new time entry
 */
export const createTimeEntry = onCall(
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
    const data = request.data as CreateTimeEntryRequest;

    // Validate required fields
    if (!data.accountId || !data.date || typeof data.hours !== "number") {
      throw new HttpsError(
        "invalid-argument",
        "Account ID, date, and hours are required",
      );
    }

    if (data.hours <= 0 || data.hours > 24) {
      throw new HttpsError(
        "invalid-argument",
        "Hours must be between 0 and 24",
      );
    }

    try {
      const result = await TimeTrackingService.createTimeEntry(userId, data);

      logger.info(`Time entry created via API: ${result.timeEntryId}`, {
        userId,
        accountId: data.accountId,
        hours: data.hours,
      });

      return {
        success: true,
        timeEntryId: result.timeEntryId,
        timeEntry: result.timeEntry,
      };
    } catch (error) {
      logger.error("Time entry creation failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Time entry creation failed");
    }
  },
);

/**
 * Update an existing time entry
 */
export const updateTimeEntry = onCall(
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
    const {timeEntryId, updates} = request.data as {
      timeEntryId: string;
      updates: Partial<
        CreateTimeEntryRequest & {
          status: "draft" | "pending" | "approved" | "rejected";
        }
      >;
    };

    if (!timeEntryId) {
      throw new HttpsError("invalid-argument", "Time entry ID is required");
    }

    if (
      updates.hours !== undefined &&
      (updates.hours <= 0 || updates.hours > 24)
    ) {
      throw new HttpsError(
        "invalid-argument",
        "Hours must be between 0 and 24",
      );
    }

    try {
      await TimeTrackingService.updateTimeEntry({
        timeEntryId,
        updates,
        userId,
      });

      return {
        success: true,
        message: "Time entry updated successfully",
      };
    } catch (error) {
      logger.error("Time entry update failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Time entry update failed");
    }
  },
);

/**
 * Delete a time entry
 */
export const deleteTimeEntry = onCall(
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
    const {timeEntryId} = request.data as {timeEntryId: string};

    if (!timeEntryId) {
      throw new HttpsError("invalid-argument", "Time entry ID is required");
    }

    try {
      await TimeTrackingService.deleteTimeEntry(timeEntryId, userId);

      return {
        success: true,
        message: "Time entry deleted successfully",
      };
    } catch (error) {
      logger.error("Time entry deletion failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Time entry deletion failed");
    }
  },
);

/**
 * Get time entries for an account
 */
export const getAccountTimeEntries = onCall(
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
    const {accountId, startDate, endDate, limit, offset} = request.data as {
      accountId: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    };

    if (!accountId) {
      throw new HttpsError("invalid-argument", "Account ID is required");
    }

    try {
      const timeEntries = await TimeTrackingService.getAccountTimeEntries(
        accountId,
        userId,
        {startDate, endDate, limit, offset},
      );

      return {
        success: true,
        timeEntries,
      };
    } catch (error) {
      logger.error("Failed to get time entries:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get time entries");
    }
  },
);

/**
 * Get time tracking statistics
 */
export const getTimeTrackingStats = onCall(
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
    const {accountId, period} = request.data as {
      accountId: string;
      period?: "week" | "month" | "year";
    };

    if (!accountId) {
      throw new HttpsError("invalid-argument", "Account ID is required");
    }

    try {
      const stats = await TimeTrackingService.getTimeTrackingStats(
        accountId,
        userId,
        period || "month",
      );

      return {
        success: true,
        stats,
      };
    } catch (error) {
      logger.error("Failed to get time tracking stats:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get time tracking stats");
    }
  },
);
