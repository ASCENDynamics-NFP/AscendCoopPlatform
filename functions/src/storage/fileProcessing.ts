import {onObjectFinalized} from "firebase-functions/v2/storage";
import {getStorage} from "firebase-admin/storage";
import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {HttpsError} from "firebase-functions/v2/https";
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
 * Cloud Function triggered when a file is uploaded to Firebase Storage
 * Handles file validation, thumbnail generation, and metadata updates
 */
export const onFileUpload = onObjectFinalized(
  {
    region: "us-central1",
    timeoutSeconds: 300,
    memory: "1GiB",
  },
  async (event) => {
    const filePath = event.data.name;
    const contentType = event.data.contentType;
    const bucket = storage.bucket();

    logger.info(`Processing file upload: ${filePath}`, {
      contentType,
      size: event.data.size,
    });

    // Skip if this is a thumbnail or processed file
    if (filePath.includes("_thumb") || filePath.includes("_processed")) {
      logger.info("Skipping thumbnail or processed file");
      return null;
    }

    try {
      // Extract chat ID and message ID from file path
      // Expected path: chats/{chatId}/messages/{messageId}/{fileName}
      const pathParts = filePath.split("/");
      if (
        pathParts.length < 4 ||
        pathParts[0] !== "chats" ||
        pathParts[2] !== "messages"
      ) {
        logger.warn(`Invalid file path structure: ${filePath}`);
        return null;
      }

      const chatId = pathParts[1];
      const messageId = pathParts[3];
      const fileName = pathParts.slice(4).join("/");

      // Validate file type and size
      const validationResult = await validateFile(
        contentType,
        event.data.size?.toString(),
      );
      if (!validationResult.isValid) {
        logger.error(`File validation failed: ${validationResult.error}`);
        await deleteFile(filePath);
        await updateMessageWithError(
          chatId,
          messageId,
          validationResult.error || "Validation failed",
        );
        return null;
      }

      // Generate thumbnail for images
      let thumbnailUrl = null;
      if (contentType && contentType.startsWith("image/")) {
        thumbnailUrl = await generateThumbnail(filePath, bucket);
      }

      // Update message document with file metadata
      await updateMessageWithFileData(chatId, messageId, {
        fileName,
        fileUrl: `gs://${bucket.name}/${filePath}`,
        thumbnailUrl,
        contentType,
        size: parseInt(event.data.size?.toString() || "0"),
        uploadComplete: true,
      });

      logger.info(`File processing completed for: ${filePath}`);
      return null;
    } catch (error) {
      logger.error("Error processing file upload:", error);
      throw new HttpsError("internal", "File processing failed");
    }
  },
);

/**
 * Validates uploaded file type and size
 * @param {string | undefined} contentType - The MIME type of the file to validate
 * @param {string | undefined} size - The size of the file to validate
 */
async function validateFile(
  contentType: string | undefined,
  size: string | undefined,
): Promise<{
  isValid: boolean;
  error?: string;
}> {
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  const fileSize = parseInt(size || "0");

  if (fileSize > maxSize) {
    return {
      isValid: false,
      error: "File size exceeds 10MB limit",
    };
  }

  // Check file type
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "audio/mpeg",
    "audio/wav",
    "audio/webm",
    "application/pdf",
    "text/plain",
  ];

  if (!contentType || !allowedTypes.includes(contentType)) {
    return {
      isValid: false,
      error: "File type not allowed",
    };
  }

  return {isValid: true};
}

/**
 * Generates thumbnail for image files
 * @param {string} filePath - The path to the file to generate a thumbnail for
 * @param {object} bucket - The storage bucket containing the file
 */
async function generateThumbnail(
  filePath: string,
  bucket: any,
): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sharp = require("sharp");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require("path");

    const fileName = path.basename(filePath);
    const thumbFileName = `thumb_${fileName}`;
    const thumbPath = filePath.replace(fileName, thumbFileName);

    // Download original file
    const file = bucket.file(filePath);
    const [fileBuffer] = await file.download();

    // Generate thumbnail (300px max width/height)
    const thumbnailBuffer = await sharp(fileBuffer)
      .resize(300, 300, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({quality: 80})
      .toBuffer();

    // Upload thumbnail
    const thumbFile = bucket.file(thumbPath);
    await thumbFile.save(thumbnailBuffer, {
      metadata: {
        contentType: "image/jpeg",
        cacheControl: "public, max-age=31536000", // 1 year
      },
    });

    // Make thumbnail publicly readable
    await thumbFile.makePublic();

    return `https://storage.googleapis.com/${bucket.name}/${thumbPath}`;
  } catch (error) {
    logger.error("Error generating thumbnail:", error);
    return null;
  }
}

/**
 * Updates message document with file metadata
 * @param {string} chatId - The ID of the chat containing the message
 * @param {string} messageId - The ID of the message to update
 * @param {object} fileData - The file metadata to update the message with
 */
async function updateMessageWithFileData(
  chatId: string,
  messageId: string,
  fileData: FirebaseFirestore.DocumentData,
): Promise<void> {
  try {
    const messageRef = db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(messageId);

    await messageRef.update({
      attachments: [
        {
          ...fileData,
          uploadedAt: new Date(),
        },
      ],
      updatedAt: new Date(),
    });

    logger.info(`Updated message ${messageId} with file data`);
  } catch (error) {
    logger.error("Error updating message with file data:", error);
    throw error;
  }
}

/**
 * Updates message document with error information
 * @param {string} chatId - The ID of the chat containing the message
 * @param {string} messageId - The ID of the message to update with error
 * @param {string} error - The error message to record
 */
async function updateMessageWithError(
  chatId: string,
  messageId: string,
  error: string,
): Promise<void> {
  try {
    const messageRef = db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(messageId);

    await messageRef.update({
      attachments: [
        {
          uploadError: error,
          uploadComplete: false,
        },
      ],
      updatedAt: new Date(),
    });
  } catch (updateError) {
    logger.error("Error updating message with error:", updateError);
  }
}

/**
 * Deletes file from storage
 * @param {string} filePath - The path of the file to delete from storage
 */
async function deleteFile(filePath: string): Promise<void> {
  try {
    const bucket = storage.bucket();
    await bucket.file(filePath).delete();
    logger.info(`Deleted invalid file: ${filePath}`);
  } catch (error) {
    logger.error("Error deleting file:", error);
  }
}
