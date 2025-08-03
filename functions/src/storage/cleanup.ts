import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {getStorage} from "firebase-admin/storage";
import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {initializeApp} from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
try {
  initializeApp();
} catch (error) {
  // App already initialized
}

const db = getFirestore();
const storage = getStorage();

/**
 * Scheduled function to clean up orphaned files
 * Runs daily to remove files that don't have corresponding messages
 */
export const cleanupOrphanedFiles = onSchedule(
  {
    schedule: "every day 02:00",
    timeZone: "America/New_York",
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 540, // 9 minutes
  },
  async (event) => {
    logger.info("Starting orphaned file cleanup");

    try {
      const bucket = storage.bucket();
      let filesProcessed = 0;
      let filesDeleted = 0;

      // Get all files in the chats directory
      const [files] = await bucket.getFiles({
        prefix: "chats/",
        autoPaginate: false,
        maxResults: 1000, // Process in batches
      });

      for (const file of files) {
        filesProcessed++;

        // Skip directories and thumbnails
        if (file.name.endsWith("/") || file.name.includes("_thumb")) {
          continue;
        }

        // Parse file path: chats/{chatId}/messages/{messageId}/{fileName}
        const pathParts = file.name.split("/");
        if (pathParts.length < 4 || pathParts[0] !== "chats") {
          continue;
        }

        const chatId = pathParts[1];
        const messageId = pathParts[3];

        // Check if corresponding message exists
        const messageExists = await checkMessageExists(chatId, messageId);
        if (!messageExists) {
          // Delete orphaned file
          await file.delete();
          filesDeleted++;
          logger.info(`Deleted orphaned file: ${file.name}`);
        }

        // Process in smaller batches to avoid timeout
        if (filesProcessed % 100 === 0) {
          logger.info(
            `Processed ${filesProcessed} files, deleted ${filesDeleted} orphaned files`,
          );
        }
      }

      logger.info(
        `Cleanup completed: processed ${filesProcessed} files, deleted ${filesDeleted} orphaned files`,
      );
    } catch (error) {
      logger.error("Error during file cleanup:", error);
      throw new HttpsError("internal", "File cleanup failed");
    }
  },
);

/**
 * Callable function to manually trigger file cleanup for a specific chat
 */
export const cleanupChatFiles = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
  },
  async (request) => {
    // Verify user is authenticated
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const {chatId} = request.data;
    if (!chatId || typeof chatId !== "string") {
      throw new HttpsError("invalid-argument", "Valid chatId is required");
    }

    try {
      // Verify user has access to this chat
      const chatDoc = await db.collection("chats").doc(chatId).get();
      if (!chatDoc.exists) {
        throw new HttpsError("not-found", "Chat not found");
      }

      const chatData = chatDoc.data();
      if (!chatData?.participants?.includes(request.auth.uid)) {
        throw new HttpsError(
          "permission-denied",
          "User not authorized for this chat",
        );
      }

      logger.info(
        `Manual cleanup requested for chat ${chatId} by user ${request.auth.uid}`,
      );

      const bucket = storage.bucket();
      const prefix = `chats/${chatId}/`;
      let filesProcessed = 0;
      let filesDeleted = 0;

      // Get all files for this chat
      const [files] = await bucket.getFiles({prefix});

      for (const file of files) {
        filesProcessed++;

        // Skip directories and thumbnails
        if (file.name.endsWith("/") || file.name.includes("_thumb")) {
          continue;
        }

        // Parse message ID from path
        const pathParts = file.name.split("/");
        if (pathParts.length >= 4 && pathParts[2] === "messages") {
          const messageId = pathParts[3];

          // Check if message exists
          const messageExists = await checkMessageExists(chatId, messageId);
          if (!messageExists) {
            await file.delete();
            filesDeleted++;
            logger.info(`Deleted orphaned file: ${file.name}`);
          }
        }
      }

      return {
        success: true,
        filesProcessed,
        filesDeleted,
        message: `Cleanup completed for chat ${chatId}`,
      };
    } catch (error) {
      logger.error("Error during manual chat cleanup:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Chat cleanup failed");
    }
  },
);

/**
 * Check if a message document exists in Firestore
 */
async function checkMessageExists(
  chatId: string,
  messageId: string,
): Promise<boolean> {
  try {
    const messageDoc = await db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(messageId)
      .get();

    return messageDoc.exists;
  } catch (error) {
    logger.error("Error checking message existence:", error);
    // If we can't verify, assume it exists to be safe
    return true;
  }
}

/**
 * Callable function to get storage usage statistics for a chat
 */
export const getChatStorageStats = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const {chatId} = request.data;
    if (!chatId || typeof chatId !== "string") {
      throw new HttpsError("invalid-argument", "Valid chatId is required");
    }

    try {
      // Verify user has access to this chat
      const chatDoc = await db.collection("chats").doc(chatId).get();
      if (!chatDoc.exists) {
        throw new HttpsError("not-found", "Chat not found");
      }

      const chatData = chatDoc.data();
      if (!chatData?.participants?.includes(request.auth.uid)) {
        throw new HttpsError(
          "permission-denied",
          "User not authorized for this chat",
        );
      }

      const bucket = storage.bucket();
      const prefix = `chats/${chatId}/`;

      const [files] = await bucket.getFiles({prefix});

      let totalSize = 0;
      let fileCount = 0;
      const fileTypes: {[key: string]: number} = {};

      for (const file of files) {
        if (!file.name.endsWith("/")) {
          const [metadata] = await file.getMetadata();
          const size =
            typeof metadata.size === "number"
              ? metadata.size
              : parseInt(metadata.size || "0");
          const contentType = metadata.contentType || "unknown";

          totalSize += size;
          fileCount++;
          fileTypes[contentType] = (fileTypes[contentType] || 0) + 1;
        }
      }

      return {
        chatId,
        totalSizeBytes: totalSize,
        totalSizeMB: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
        fileCount,
        fileTypes,
      };
    } catch (error) {
      logger.error("Error getting storage stats:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Failed to get storage stats");
    }
  },
);
