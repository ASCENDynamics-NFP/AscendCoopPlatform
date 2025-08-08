/**
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/

import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions";

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  text?: string;
  fileUrl?: string;
  fileName?: string;
  type: string;
  timestamp: FirebaseFirestore.Timestamp;
}

interface Chat {
  id: string;
  participants: string[];
  isGroup: boolean;
  name?: string;
  groupName?: string;
}

/**
 * Trigger function that runs when a new message is created
 * Handles:
 * 1. Sending push notifications to recipients
 * 2. Updating chat metadata (lastMessage, timestamp, etc.)
 */
export const onCreateMessage = onDocumentCreated(
  "chats/{chatId}/messages/{messageId}",
  async (event) => {
    try {
      const snapshot = event.data;
      if (!snapshot) {
        logger.error("No data associated with the event");
        return;
      }

      const messageData = snapshot.data() as Message;
      const messageId = snapshot.id;
      const chatId = event.params.chatId;

      logger.info(`New message created in chat ${chatId}:`, {
        messageId,
        senderId: messageData.senderId,
        type: messageData.type,
      });

      // Get chat document to find participants
      const chatDoc = await db.collection("chats").doc(chatId).get();
      if (!chatDoc.exists) {
        logger.error(`Chat document ${chatId} not found`);
        return;
      }

      const chatData = {id: chatDoc.id, ...chatDoc.data()} as Chat;

      // Update chat metadata in parallel with notifications
      await Promise.all([
        updateChatMetadata(chatId, messageData, chatData),
        sendNotificationsToParticipants(chatData, messageData),
      ]);

      logger.info(
        `Successfully processed message ${messageId} in chat ${chatId}`,
      );
    } catch (error) {
      logger.error("Error processing new message:", error);
      throw error;
    }
  },
);

/**
 * Update chat document with latest message metadata
 * @param {string} chatId - The ID of the chat to update
 * @param {Message} messageData - The message data containing metadata
 * @param {Chat} chatData - The chat data (currently unused but kept for future use)
 * @return {Promise<void>} Promise that resolves when update is complete
 */
async function updateChatMetadata(
  chatId: string,
  messageData: Message,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chatData: Chat,
): Promise<void> {
  try {
    const lastMessage = getLastMessageText(messageData);
    const updateData = {
      lastMessage,
      lastMessageTimestamp: messageData.timestamp,
      lastMessageSender: messageData.senderId,
      lastMessageSenderName: messageData.senderName || null,
      lastModifiedAt: messageData.timestamp,
      lastModifiedBy: messageData.senderId,
    };

    await db.collection("chats").doc(chatId).update(updateData);
    logger.info(`Updated chat metadata for ${chatId}`);
  } catch (error) {
    logger.error(`Error updating chat metadata for ${chatId}:`, error);
    throw error;
  }
}

/**
 * Send push notifications to all participants except the sender
 * @param {Chat} chatData - The chat data containing participant information
 * @param {Message} messageData - The message data for notification content
 * @return {Promise<void>} Promise that resolves when notifications are sent
 */
async function sendNotificationsToParticipants(
  chatData: Chat,
  messageData: Message,
): Promise<void> {
  try {
    // Get recipients (all participants except sender)
    const recipients = chatData.participants.filter(
      (participantId) => participantId !== messageData.senderId,
    );

    if (recipients.length === 0) {
      logger.info("No recipients for notifications");
      return;
    }

    // Get FCM tokens for recipients
    const tokenPromises = recipients.map(async (userId) => {
      try {
        // TODO: Implement token retrieval from user profile or tokens collection
        // For now, we'll log what would happen
        logger.info(`Would send notification to user ${userId}`);
        return null; // Return null when no token found
      } catch (error) {
        logger.warn(`Error getting tokens for user ${userId}:`, error);
        return null;
      }
    });

    const tokenResults = await Promise.all(tokenPromises);
    const validTokens = tokenResults.filter((token) => token !== null);

    if (validTokens.length === 0) {
      logger.info("No valid FCM tokens found for recipients");
      return;
    }

    // Prepare notification payload
    const notificationTitle = getChatDisplayName(
      chatData,
      messageData.senderId,
    );
    const notificationBody = getNotificationBody(messageData);

    const payload = {
      notification: {
        title: notificationTitle,
        body: notificationBody,
      },
      data: {
        chatId: chatData.id,
        messageId: messageData.id,
        senderId: messageData.senderId,
        type: "chat_message",
      },
    };

    // TODO: Send notifications using messaging.sendMulticast()
    logger.info("Would send notification payload:", payload);

    logger.info(`Notifications prepared for ${recipients.length} recipients`);
  } catch (error) {
    logger.error("Error sending notifications:", error);
    // Don't throw here to avoid affecting chat metadata update
  }
}

/**
 * Get display name for notification title
 * @param {Chat} chatData - The chat data containing name information
 * @param {string} senderId - The ID of the message sender (currently unused)
 * @return {string} The display name for the notification
 */
function getChatDisplayName(
  chatData: Chat,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  senderId: string,
): string {
  if (chatData.isGroup) {
    return chatData.name || chatData.groupName || "Group Chat";
  }

  // For 1-on-1 chats, use sender's name
  // TODO: Get sender's name from account document
  return "New Message"; // Fallback
}

/**
 * Get appropriate notification body text
 * @param {Message} messageData - The message data to create notification body for
 * @return {string} The notification body text
 */
function getNotificationBody(messageData: Message): string {
  switch (messageData.type) {
    case "text":
      return messageData.text || "New message";
    case "image":
      return "📷 Photo";
    case "file":
      return `📎 ${messageData.fileName || "File"}`;
    case "video":
      return "🎥 Video";
    case "audio":
      return "🎵 Audio";
    default:
      return "New message";
  }
}

/**
 * Get last message text for chat metadata
 * @param {Message} messageData - The message data to extract text from
 * @return {string} The formatted message text for chat metadata
 */
function getLastMessageText(messageData: Message): string {
  switch (messageData.type) {
    case "text":
      return messageData.text || "";
    case "image":
      return "📷 Photo";
    case "file":
      return `📎 ${messageData.fileName || "Attachment"}`;
    case "video":
      return "🎥 Video";
    case "audio":
      return "🎵 Audio";
    default:
      return "Message";
  }
}
