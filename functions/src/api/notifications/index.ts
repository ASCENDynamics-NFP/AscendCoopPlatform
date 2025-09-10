/**
 * Notification API - Callable functions for notification management
 */
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import {NotificationService} from "../../services/notificationService";

/**
 * Get user notifications
 */
export const getUserNotifications = onCall(
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
    const {limit, lastNotificationId} = request.data as {
      limit?: number;
      lastNotificationId?: string;
    };

    try {
      const notifications = await NotificationService.getUserNotifications(
        userId,
        limit || 20,
        lastNotificationId,
      );

      return {
        success: true,
        notifications,
      };
    } catch (error) {
      logger.error("Failed to get user notifications:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get notifications");
    }
  },
);

/**
 * Mark notification as read
 */
export const markNotificationAsRead = onCall(
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
    const {notificationId} = request.data as {
      notificationId: string;
    };

    if (!notificationId) {
      throw new HttpsError("invalid-argument", "Notification ID is required");
    }

    try {
      await NotificationService.markAsRead(notificationId, userId);

      return {
        success: true,
        message: "Notification marked as read",
      };
    } catch (error) {
      logger.error("Failed to mark notification as read:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update notification");
    }
  },
);

/**
 * Send admin notification (admin-only function)
 */
export const sendAdminNotification = onCall(
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

    // TODO: Add admin permission check
    const {accountId, type, message, data} = request.data as {
      accountId: string;
      type: string;
      message: string;
      data?: any;
    };

    if (!accountId || !type || !message) {
      throw new HttpsError(
        "invalid-argument",
        "Account ID, type, and message are required",
      );
    }

    try {
      await NotificationService.notifyAdmins(accountId, type, message, data);

      return {
        success: true,
        message: "Admin notifications sent",
      };
    } catch (error) {
      logger.error("Failed to send admin notifications:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to send notifications");
    }
  },
);
