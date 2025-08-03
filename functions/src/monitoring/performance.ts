import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {initializeApp} from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
try {
  initializeApp();
} catch (error) {
  // App already initialized
}

const db = getFirestore();

interface PerformanceMetrics {
  totalChats: number;
  totalMessages: number;
  activeChats24h: number;
  messagesLast24h: number;
  averageMessagesPerChat: number;
  largestChatSize: number;
  storageUsageEstimate: number;
  indexPerformance: {
    chatQueries: number;
    messageQueries: number;
    averageQueryTime: number;
  };
}

/**
 * Scheduled function to collect and log performance metrics
 */
export const collectPerformanceMetrics = onSchedule(
  {
    schedule: "every 24 hours",
    timeZone: "America/New_York",
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 540,
  },
  async (event) => {
    logger.info("Starting performance metrics collection");

    try {
      const metrics = await gatherSystemMetrics();

      // Store metrics in a dedicated collection for tracking
      await db.collection("system_metrics").add({
        type: "messaging_performance",
        timestamp: Timestamp.now(),
        metrics,
        collectedAt: new Date().toISOString(),
      });

      // Log key metrics for monitoring
      logger.info("Performance metrics collected", {
        totalChats: metrics.totalChats,
        totalMessages: metrics.totalMessages,
        activeChats24h: metrics.activeChats24h,
        messagesLast24h: metrics.messagesLast24h,
      });

      // Check for performance alerts
      await checkPerformanceAlerts(metrics);
    } catch (error) {
      logger.error("Error collecting performance metrics:", error);
    }
  },
);

/**
 * Callable function to get current system performance metrics
 */
export const getPerformanceMetrics = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request): Promise<PerformanceMetrics> => {
    // Only allow admin users to access performance metrics
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    // Check if user has admin privileges
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const userData = userDoc.data();

    if (!userData?.isAdmin) {
      throw new HttpsError("permission-denied", "Admin access required");
    }

    try {
      const metrics = await gatherSystemMetrics();
      logger.info(`Performance metrics requested by admin ${request.auth.uid}`);
      return metrics;
    } catch (error) {
      logger.error("Error gathering performance metrics:", error);
      throw new HttpsError("internal", "Failed to gather metrics");
    }
  },
);

/**
 * Gather comprehensive system performance metrics
 */
async function gatherSystemMetrics(): Promise<PerformanceMetrics> {
  const yesterday = Timestamp.fromDate(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
  );

  // Get total chat count
  const totalChatsSnapshot = await db.collection("chats").count().get();
  const totalChats = totalChatsSnapshot.data().count;

  // Get active chats in last 24 hours
  const activeChatsSnapshot = await db
    .collection("chats")
    .where("lastMessageTimestamp", ">=", yesterday)
    .count()
    .get();
  const activeChats24h = activeChatsSnapshot.data().count;

  // Sample message counts (using a representative sample for large datasets)
  let totalMessages = 0;
  let messagesLast24h = 0;
  let largestChatSize = 0;

  // Get a sample of chats to estimate message counts
  const chatSample = await db.collection("chats").limit(100).get();

  const samplePromises = chatSample.docs.map(async (chatDoc) => {
    const chatId = chatDoc.id;

    // Count total messages in this chat
    const totalMessagesSnapshot = await db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .count()
      .get();
    const chatMessageCount = totalMessagesSnapshot.data().count;

    // Count recent messages
    const recentMessagesSnapshot = await db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .where("createdAt", ">=", yesterday)
      .count()
      .get();
    const recentMessageCount = recentMessagesSnapshot.data().count;

    return {
      totalMessages: chatMessageCount,
      recentMessages: recentMessageCount,
    };
  });

  const sampleResults = await Promise.all(samplePromises);

  // Calculate estimates based on sample
  const avgMessagesPerSampleChat =
    sampleResults.reduce((sum, result) => sum + result.totalMessages, 0) /
    sampleResults.length;
  const avgRecentPerSampleChat =
    sampleResults.reduce((sum, result) => sum + result.recentMessages, 0) /
    sampleResults.length;

  totalMessages = Math.round(avgMessagesPerSampleChat * totalChats);
  messagesLast24h = Math.round(avgRecentPerSampleChat * totalChats);
  largestChatSize = Math.max(...sampleResults.map((r) => r.totalMessages));

  const averageMessagesPerChat =
    totalChats > 0 ? totalMessages / totalChats : 0;

  // Estimate storage usage (rough calculation)
  const avgMessageSize = 200; // bytes (estimate)
  const avgAttachmentSize = 500000; // 500KB (estimate)
  const attachmentRatio = 0.1; // 10% of messages have attachments

  const storageUsageEstimate = Math.round(
    totalMessages * avgMessageSize +
      totalMessages * attachmentRatio * avgAttachmentSize,
  );

  return {
    totalChats,
    totalMessages,
    activeChats24h,
    messagesLast24h,
    averageMessagesPerChat: Math.round(averageMessagesPerChat * 100) / 100,
    largestChatSize,
    storageUsageEstimate,
    indexPerformance: {
      chatQueries: 0, // Would need query performance monitoring
      messageQueries: 0,
      averageQueryTime: 0,
    },
  };
}

/**
 * Check for performance alerts and log warnings
 */
async function checkPerformanceAlerts(
  metrics: PerformanceMetrics,
): Promise<void> {
  const alerts = [];

  // Check for high chat volume
  if (metrics.totalChats > 10000) {
    alerts.push(`High chat volume: ${metrics.totalChats} total chats`);
  }

  // Check for high message volume
  if (metrics.messagesLast24h > 50000) {
    alerts.push(
      `High message volume: ${metrics.messagesLast24h} messages in last 24h`,
    );
  }

  // Check for large chat sizes
  if (metrics.largestChatSize > 10000) {
    alerts.push(`Large chat detected: ${metrics.largestChatSize} messages`);
  }

  // Check for storage usage
  const storageGB = metrics.storageUsageEstimate / (1024 * 1024 * 1024);
  if (storageGB > 100) {
    alerts.push(`High storage usage: ~${storageGB.toFixed(2)} GB`);
  }

  // Log alerts
  if (alerts.length > 0) {
    logger.warn("Performance alerts detected:", {alerts});

    // Store alerts for admin notification
    await db.collection("system_alerts").add({
      type: "performance",
      alerts,
      metrics,
      timestamp: Timestamp.now(),
      severity: "warning",
    });
  }
}

/**
 * Callable function to optimize database indexes
 */
export const optimizeIndexes = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    // Check admin privileges
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const userData = userDoc.data();

    if (!userData?.isAdmin) {
      throw new HttpsError("permission-denied", "Admin access required");
    }

    try {
      logger.info(`Index optimization requested by admin ${request.auth.uid}`);

      // This would typically involve analyzing query patterns and suggesting
      // index optimizations. For now, we'll return recommended indexes.
      const recommendedIndexes = [
        {
          collection: "chats",
          fields: ["participants", "lastMessageTimestamp"],
          description: "Optimize chat list queries",
        },
        {
          collection: "chats/*/messages",
          fields: ["createdAt"],
          description: "Optimize message timeline queries",
        },
        {
          collection: "chats/*/messages",
          fields: ["senderId", "createdAt"],
          description: "Optimize sender-specific queries",
        },
        {
          collection: "chats",
          fields: ["type", "lastMessageTimestamp"],
          description: "Optimize chat type filtering",
        },
      ];

      return {
        recommendedIndexes,
        message:
          "Index recommendations generated. Apply these indexes in Firebase Console.",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error("Error generating index recommendations:", error);
      throw new HttpsError("internal", "Failed to optimize indexes");
    }
  },
);

/**
 * Clean up old performance metrics and alerts
 */
export const cleanupOldMetrics = onSchedule(
  {
    schedule: "every 7 days",
    timeZone: "America/New_York",
    region: "us-central1",
  },
  async (event) => {
    logger.info("Starting cleanup of old metrics");

    try {
      const thirtyDaysAgo = Timestamp.fromDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      );

      // Clean up old metrics
      const oldMetricsQuery = db
        .collection("system_metrics")
        .where("timestamp", "<", thirtyDaysAgo);

      const oldMetricsSnapshot = await oldMetricsQuery.get();
      const deletePromises = oldMetricsSnapshot.docs.map((doc) =>
        doc.ref.delete(),
      );

      await Promise.all(deletePromises);

      // Clean up old alerts
      const oldAlertsQuery = db
        .collection("system_alerts")
        .where("timestamp", "<", thirtyDaysAgo);

      const oldAlertsSnapshot = await oldAlertsQuery.get();
      const alertDeletePromises = oldAlertsSnapshot.docs.map((doc) =>
        doc.ref.delete(),
      );

      await Promise.all(alertDeletePromises);

      logger.info(
        `Cleaned up ${deletePromises.length} old metrics and ${alertDeletePromises.length} old alerts`,
      );
    } catch (error) {
      logger.error("Error cleaning up old metrics:", error);
    }
  },
);
