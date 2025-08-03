import {onCall, HttpsError} from "firebase-functions/v2/https";
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

interface PaginatedMessagesRequest {
  chatId: string;
  limit?: number;
  startAfter?: string; // Timestamp ISO string or message ID
  orderBy?: "createdAt" | "id";
  direction?: "asc" | "desc";
}

interface PaginatedMessagesResponse {
  messages: any[];
  hasMore: boolean;
  nextCursor?: string;
  totalCount?: number;
}

/**
 * Efficiently fetch messages with cursor-based pagination
 * Optimized for chat message loading with proper indexing
 */
export const getMessages = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request): Promise<PaginatedMessagesResponse> => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const {
      chatId,
      limit = 50,
      startAfter,
      orderBy = "createdAt",
      direction = "desc",
    }: PaginatedMessagesRequest = request.data;

    // Validate input
    if (!chatId || typeof chatId !== "string") {
      throw new HttpsError("invalid-argument", "Valid chatId is required");
    }

    if (limit > 100) {
      throw new HttpsError(
        "invalid-argument",
        "Limit cannot exceed 100 messages",
      );
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

      // Build the query
      let query = db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .orderBy(orderBy, direction)
        .limit(limit + 1); // Fetch one extra to check if there are more

      // Apply cursor-based pagination
      if (startAfter) {
        if (orderBy === "createdAt") {
          // Parse timestamp string to Firestore Timestamp
          const timestamp = Timestamp.fromDate(new Date(startAfter));
          query = query.startAfter(timestamp);
        } else {
          // Use document ID for pagination
          const lastDoc = await db
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .doc(startAfter)
            .get();

          if (lastDoc.exists) {
            query = query.startAfter(lastDoc);
          }
        }
      }

      // Execute query
      const snapshot = await query.get();
      const messages = [];
      let hasMore = false;
      let nextCursor: string | undefined;

      // Process results
      for (let i = 0; i < snapshot.docs.length; i++) {
        if (i === limit) {
          // We have more messages
          hasMore = true;
          break;
        }

        const doc = snapshot.docs[i];
        const messageData = doc.data();

        messages.push({
          id: doc.id,
          ...messageData,
          createdAt:
            messageData.createdAt?.toDate?.()?.toISOString() ||
            messageData.createdAt,
          updatedAt:
            messageData.updatedAt?.toDate?.()?.toISOString() ||
            messageData.updatedAt,
        });
      }

      // Set next cursor for pagination
      if (hasMore && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        nextCursor =
          orderBy === "createdAt" ? lastMessage.createdAt : lastMessage.id;
      }

      logger.info(
        `Fetched ${messages.length} messages for chat ${chatId}, hasMore: ${hasMore}`,
      );

      return {
        messages,
        hasMore,
        nextCursor,
      };
    } catch (error) {
      logger.error("Error fetching messages:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Failed to fetch messages");
    }
  },
);

/**
 * Get paginated chat list for a user with efficient querying
 */
export const getUserChats = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const {limit = 50, startAfter, includeMetadata = true} = request.data;

    if (limit > 100) {
      throw new HttpsError("invalid-argument", "Limit cannot exceed 100 chats");
    }

    try {
      const userId = request.auth.uid;

      // Build query for chats where user is a participant
      let query = db
        .collection("chats")
        .where("participants", "array-contains", userId)
        .orderBy("lastMessageTimestamp", "desc")
        .limit(limit + 1);

      // Apply cursor pagination
      if (startAfter) {
        const timestamp = Timestamp.fromDate(new Date(startAfter));
        query = query.startAfter(timestamp);
      }

      const snapshot = await query.get();
      const chats = [];
      let hasMore = false;
      let nextCursor: string | undefined;

      for (let i = 0; i < snapshot.docs.length; i++) {
        if (i === limit) {
          hasMore = true;
          break;
        }

        const doc = snapshot.docs[i];
        const chatData = doc.data();

        let processedChat: any = {
          id: doc.id,
          ...chatData,
          lastMessageTimestamp:
            chatData.lastMessageTimestamp?.toDate?.()?.toISOString() ||
            chatData.lastMessageTimestamp,
          createdAt:
            chatData.createdAt?.toDate?.()?.toISOString() || chatData.createdAt,
          updatedAt:
            chatData.updatedAt?.toDate?.()?.toISOString() || chatData.updatedAt,
        };

        // Include additional metadata if requested
        if (includeMetadata) {
          // Get unread count for current user
          const unreadCount = chatData.unreadCounts?.[userId] || 0;
          processedChat.unreadCount = unreadCount;

          // For group chats, get participant details
          if (chatData.type === "group" && chatData.participants) {
            const participantDetails = await getParticipantDetails(
              chatData.participants,
            );
            processedChat.participantDetails = participantDetails;
          }
        }

        chats.push(processedChat);
      }

      // Set next cursor
      if (hasMore && chats.length > 0) {
        const lastChat = chats[chats.length - 1];
        nextCursor = lastChat.lastMessageTimestamp;
      }

      logger.info(
        `Fetched ${chats.length} chats for user ${userId}, hasMore: ${hasMore}`,
      );

      return {
        chats,
        hasMore,
        nextCursor,
      };
    } catch (error) {
      logger.error("Error fetching user chats:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Failed to fetch chats");
    }
  },
);

/**
 * Search messages within a specific chat
 */
export const searchMessages = onCall(
  {
    region: "us-central1",
    enforceAppCheck: true,
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const {chatId, searchTerm, limit = 50, startAfter} = request.data;

    if (!chatId || !searchTerm) {
      throw new HttpsError(
        "invalid-argument",
        "chatId and searchTerm are required",
      );
    }

    if (searchTerm.length < 2) {
      throw new HttpsError(
        "invalid-argument",
        "Search term must be at least 2 characters",
      );
    }

    try {
      // Verify user access to chat
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

      // Note: This is a basic text search. For production, consider using
      // Algolia, Elasticsearch, or Firebase's full-text search solutions
      let query = db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .where("text", ">=", searchTerm)
        .where("text", "<=", searchTerm + "\uf8ff")
        .orderBy("text")
        .orderBy("createdAt", "desc")
        .limit(limit + 1);

      if (startAfter) {
        const lastDoc = await db
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .doc(startAfter)
          .get();

        if (lastDoc.exists) {
          query = query.startAfter(lastDoc);
        }
      }

      const snapshot = await query.get();
      const messages = [];
      let hasMore = false;
      let nextCursor: string | undefined;

      for (let i = 0; i < snapshot.docs.length; i++) {
        if (i === limit) {
          hasMore = true;
          break;
        }

        const doc = snapshot.docs[i];
        const messageData = doc.data();

        messages.push({
          id: doc.id,
          ...messageData,
          createdAt:
            messageData.createdAt?.toDate?.()?.toISOString() ||
            messageData.createdAt,
          updatedAt:
            messageData.updatedAt?.toDate?.()?.toISOString() ||
            messageData.updatedAt,
        });
      }

      if (hasMore && messages.length > 0) {
        nextCursor = messages[messages.length - 1].id;
      }

      return {
        messages,
        hasMore,
        nextCursor,
        searchTerm,
      };
    } catch (error) {
      logger.error("Error searching messages:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Message search failed");
    }
  },
);

/**
 * Helper function to get participant details for group chats
 */
async function getParticipantDetails(participantIds: string[]): Promise<any[]> {
  try {
    // Limit batch size to avoid Firestore limits
    const batchSize = 10;
    const participantDetails = [];

    for (let i = 0; i < participantIds.length; i += batchSize) {
      const batch = participantIds.slice(i, i + batchSize);
      const userDocs = await db.getAll(
        ...batch.map((id) => db.collection("users").doc(id)),
      );

      for (const doc of userDocs) {
        if (doc.exists) {
          const userData = doc.data();
          participantDetails.push({
            id: doc.id,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            photoURL: userData?.photoURL,
            status: userData?.status || "offline",
          });
        }
      }
    }

    return participantDetails;
  } catch (error) {
    logger.error("Error getting participant details:", error);
    return [];
  }
}
