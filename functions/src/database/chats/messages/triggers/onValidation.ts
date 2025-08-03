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

import {onDocumentWritten} from "firebase-functions/v2/firestore";
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
  isValid?: boolean;
  validationError?: string;
}

interface Chat {
  id: string;
  participants: string[];
  isGroup: boolean;
  name?: string;
  groupName?: string;
  createdAt: FirebaseFirestore.Timestamp;
  createdBy: string;
  isValid?: boolean;
}

interface RelatedAccount {
  id: string;
  status: "pending" | "accepted" | "blocked" | "declined";
  initiatorId: string;
  targetId: string;
  createdAt: FirebaseFirestore.Timestamp;
  relationshipType?: string;
}

/**
 * Trigger function that validates message permissions when messages are created/updated
 * Ensures that:
 * 1. Sender is a participant in the chat
 * 2. Sender has permission to message other participants
 * 3. Chat is valid and active
 */
export const onMessageValidation = onDocumentWritten(
  "chats/{chatId}/messages/{messageId}",
  async (event) => {
    try {
      const afterSnapshot = event.data?.after;
      if (!afterSnapshot || !afterSnapshot.exists) {
        // Message was deleted, no validation needed
        return;
      }

      const messageData = {
        id: afterSnapshot.id,
        ...afterSnapshot.data(),
      } as Message;
      const chatId = event.params.chatId;
      const messageId = event.params.messageId;

      // Skip validation if already processed
      if (messageData.isValid !== undefined) {
        return;
      }

      logger.info(`Validating message ${messageId} in chat ${chatId}`, {
        senderId: messageData.senderId,
        type: messageData.type,
      });

      // Get chat document
      const chatDoc = await db.collection("chats").doc(chatId).get();
      if (!chatDoc.exists) {
        await markMessageInvalid(
          chatId,
          messageId,
          "Chat document not found",
          messageData,
        );
        return;
      }

      const chatData = {id: chatDoc.id, ...chatDoc.data()} as Chat;

      // Validate message permissions
      const validationResult = await validateMessagePermissions(
        chatData,
        messageData,
      );

      if (!validationResult.isValid) {
        await markMessageInvalid(
          chatId,
          messageId,
          validationResult.error || "Unknown validation error",
          messageData,
        );
        return;
      }

      // Mark message as valid
      await db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(messageId)
        .update({
          isValid: true,
          validatedAt: new Date(),
        });

      logger.info(`Message ${messageId} validation completed successfully`);
    } catch (error) {
      logger.error("Error validating message:", error);
      // Don't throw to avoid affecting message creation
    }
  },
);

/**
 * Validate message sending permissions
 * @param {Chat} chatData - The chat data containing participant information
 * @param {Message} messageData - The message data to validate
 * @return {Promise<object>} Validation result with error details
 */
async function validateMessagePermissions(
  chatData: Chat,
  messageData: Message,
): Promise<{isValid: boolean; error?: string}> {
  try {
    const {senderId} = messageData;
    const {participants, isValid: chatIsValid} = chatData;

    // Check if chat is valid
    if (chatIsValid === false) {
      return {
        isValid: false,
        error: "Cannot send messages in invalid chat",
      };
    }

    // Check if sender is a participant
    if (!participants.includes(senderId)) {
      return {
        isValid: false,
        error: "Sender is not a participant in this chat",
      };
    }

    // For group chats, check that sender has relationships with all other participants
    if (chatData.isGroup) {
      const otherParticipants = participants.filter((p) => p !== senderId);

      for (const participantId of otherParticipants) {
        const hasPermission = await checkMessagePermission(
          senderId,
          participantId,
        );
        if (!hasPermission) {
          return {
            isValid: false,
            error: `Sender does not have permission to message participant ${participantId}`,
          };
        }
      }

      return {isValid: true};
    }

    // For 1-on-1 chats, check mutual relationship
    if (participants.length !== 2) {
      return {
        isValid: false,
        error: "Invalid participant count for 1-on-1 chat",
      };
    }

    const otherParticipant = participants.find((p) => p !== senderId);
    if (!otherParticipant) {
      return {
        isValid: false,
        error: "Could not find other participant",
      };
    }

    const hasPermission = await checkMessagePermission(
      senderId,
      otherParticipant,
    );
    if (!hasPermission) {
      return {
        isValid: false,
        error: "Sender does not have permission to message this participant",
      };
    }

    return {isValid: true};
  } catch (error) {
    logger.error("Error validating message permissions:", error);
    return {
      isValid: false,
      error: "Validation error occurred",
    };
  }
}

/**
 * Check if sender has permission to message a specific participant
 * @param {string} senderId - The ID of the message sender
 * @param {string} participantId - The ID of the participant to check permissions for
 * @return {Promise<boolean>} Promise that resolves to true if messaging is allowed
 */
async function checkMessagePermission(
  senderId: string,
  participantId: string,
): Promise<boolean> {
  try {
    // Users can always message themselves
    if (senderId === participantId) {
      return true;
    }

    // Check sender's relationship with participant
    const relationshipDoc = await db
      .collection("accounts")
      .doc(senderId)
      .collection("relatedAccounts")
      .doc(participantId)
      .get();

    if (!relationshipDoc.exists) {
      logger.info(`No relationship found from ${senderId} to ${participantId}`);
      return false;
    }

    const relationship = relationshipDoc.data() as RelatedAccount;

    // Only allow messaging if relationship is accepted
    if (relationship.status !== "accepted") {
      logger.info(
        `Cannot message: relationship status is ${relationship.status}`,
      );
      return false;
    }

    // Check if participant has blocked the sender
    const reverseRelationshipDoc = await db
      .collection("accounts")
      .doc(participantId)
      .collection("relatedAccounts")
      .doc(senderId)
      .get();

    if (reverseRelationshipDoc.exists) {
      const reverseRelationship =
        reverseRelationshipDoc.data() as RelatedAccount;
      if (reverseRelationship.status === "blocked") {
        logger.info(`Cannot message: sender is blocked by ${participantId}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    logger.error(
      `Error checking message permission from ${senderId} to ${participantId}:`,
      error,
    );
    return false;
  }
}

/**
 * Mark message as invalid and log violation
 * @param {string} chatId - The ID of the chat containing the invalid message
 * @param {string} messageId - The ID of the invalid message
 * @param {string} error - The validation error description
 * @param {Message} messageData - The message data that failed validation
 * @return {Promise<void>} Promise that resolves when message is marked invalid
 */
async function markMessageInvalid(
  chatId: string,
  messageId: string,
  error: string,
  messageData: Message,
): Promise<void> {
  try {
    // Update message with validation status
    await db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(messageId)
      .update({
        isValid: false,
        validationError: error,
        validatedAt: new Date(),
      });

    // Log violation for audit
    await db.collection("auditLogs").add({
      type: "message_validation_violation",
      chatId,
      messageId,
      messageData,
      error,
      timestamp: new Date(),
    });

    logger.warn(`Message ${messageId} marked as invalid: ${error}`);
  } catch (err) {
    logger.error(`Error marking message ${messageId} as invalid:`, err);
  }
}
