/**
 * Notification Service - Centralized notification logic
 */
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {HttpsError} from "firebase-functions/v2/https";

const db = getFirestore();

export interface NotificationRequest {
  recipientId: string;
  type:
    | "relationship_request"
    | "application_received"
    | "application_update"
    | "admin_notification";
  title: string;
  message: string;
  data?: any;
  senderId?: string;
  relatedAccountId?: string;
  relatedListingId?: string;
}

export class NotificationService {
  /**
   * Send a notification to a user
   */
  static async sendNotification(request: NotificationRequest): Promise<string> {
    try {
      const notificationRef = db.collection("notifications").doc();

      const notificationData = {
        id: notificationRef.id,
        recipientId: request.recipientId,
        type: request.type,
        title: request.title,
        message: request.message,
        data: request.data || {},
        senderId: request.senderId,
        relatedAccountId: request.relatedAccountId,
        relatedListingId: request.relatedListingId,
        read: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await notificationRef.set(notificationData);

      logger.info(`Notification sent to ${request.recipientId}:`, {
        type: request.type,
        notificationId: notificationRef.id,
      });

      return notificationRef.id;
    } catch (error) {
      logger.error("Error sending notification:", error);
      throw new HttpsError("internal", "Failed to send notification");
    }
  }

  /**
   * Send relationship request notification
   */
  static async notifyRelationshipRequest(
    targetAccountId: string,
    senderAccountId: string,
    senderName: string,
  ): Promise<void> {
    await this.sendNotification({
      recipientId: targetAccountId,
      type: "relationship_request",
      title: "New Connection Request",
      message: `${senderName} wants to connect with you`,
      senderId: senderAccountId,
      relatedAccountId: senderAccountId,
    });
  }

  /**
   * Send listing application notification
   */
  static async notifyListingApplication(
    listingOwnerId: string,
    applicantId: string,
    applicantName: string,
    listingId: string,
    listingTitle: string,
  ): Promise<void> {
    await this.sendNotification({
      recipientId: listingOwnerId,
      type: "application_received",
      title: "New Application Received",
      message: `${applicantName} applied to "${listingTitle}"`,
      senderId: applicantId,
      relatedAccountId: applicantId,
      relatedListingId: listingId,
    });
  }

  /**
   * Send application status update notification
   */
  static async notifyApplicationUpdate(
    applicantId: string,
    listingId: string,
    listingTitle: string,
    status: string,
  ): Promise<void> {
    const statusMessages: {[key: string]: string} = {
      accepted: "Your application has been accepted!",
      rejected: "Your application was not accepted this time",
      pending: "Your application is under review",
    };

    await this.sendNotification({
      recipientId: applicantId,
      type: "application_update",
      title: "Application Update",
      message: `${listingTitle}: ${statusMessages[status] || "Status updated"}`,
      relatedListingId: listingId,
      data: {status},
    });
  }

  /**
   * Send admin notification
   */
  static async notifyAdmins(
    accountId: string,
    type: string,
    message: string,
    data?: any,
  ): Promise<void> {
    try {
      // Get all admin users for the account
      const adminQuery = await db
        .collection("accounts")
        .doc(accountId)
        .collection("relatedAccounts")
        .where("access", "==", "admin")
        .where("status", "==", "accepted")
        .get();

      const adminNotifications = adminQuery.docs.map((doc) => {
        const adminData = doc.data();
        return this.sendNotification({
          recipientId: adminData.id,
          type: "admin_notification",
          title: "Admin Notification",
          message,
          relatedAccountId: accountId,
          data: {...data, adminType: type},
        });
      });

      await Promise.all(adminNotifications);

      logger.info(`Admin notifications sent for account ${accountId}:`, {
        type,
        adminCount: adminQuery.size,
      });
    } catch (error) {
      logger.error("Error sending admin notifications:", error);
      // Don't throw - admin notifications are not critical
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    try {
      const notificationRef = db
        .collection("notifications")
        .doc(notificationId);
      const notification = await notificationRef.get();

      if (!notification.exists) {
        throw new HttpsError("not-found", "Notification not found");
      }

      const notificationData = notification.data();
      if (notificationData?.recipientId !== userId) {
        throw new HttpsError(
          "permission-denied",
          "Cannot access this notification",
        );
      }

      await notificationRef.update({
        read: true,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      logger.error("Error marking notification as read:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update notification");
    }
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(
    userId: string,
    limit: number = 20,
    lastNotificationId?: string,
  ): Promise<any[]> {
    try {
      let query = db
        .collection("notifications")
        .where("recipientId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(limit);

      if (lastNotificationId) {
        const lastDoc = await db
          .collection("notifications")
          .doc(lastNotificationId)
          .get();
        if (lastDoc.exists) {
          query = query.startAfter(lastDoc);
        }
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      logger.error("Error getting user notifications:", error);
      throw new HttpsError("internal", "Failed to get notifications");
    }
  }
}
