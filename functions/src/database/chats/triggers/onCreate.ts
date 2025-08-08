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

interface Chat {
  id: string;
  participants: string[];
  isGroup: boolean;
  name?: string;
  groupName?: string;
  createdAt: FirebaseFirestore.Timestamp;
  createdBy: string;
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
 * Trigger function that runs when a new chat is created
 * Validates that all participants have accepted relationships
 */
export const onCreateChat = onDocumentCreated(
  "chats/{chatId}",
  async (event) => {
    try {
      const snapshot = event.data;
      if (!snapshot) {
        logger.error("No data associated with the event");
        return;
      }

      const chatData = {id: snapshot.id, ...snapshot.data()} as Chat;
      const chatId = event.params.chatId;

      logger.info(`New chat created: ${chatId}`, {
        participants: chatData.participants,
        isGroup: chatData.isGroup,
        createdBy: chatData.createdBy,
      });

      // Auto-create relationships if they don't exist (for 1-on-1 chats)
      if (!chatData.isGroup && chatData.participants.length === 2) {
        await autoCreateRelationshipsForChat(
          chatData.participants,
          chatData.createdBy,
        );
      }

      // Validate relationships between participants
      const isValid = await validateChatParticipants(chatData);

      if (!isValid) {
        logger.warn(`Invalid chat detected: ${chatId}. Marking for review.`);

        // Mark chat as invalid rather than deleting it immediately
        // This allows for audit trails and potential manual review
        await db.collection("chats").doc(chatId).update({
          isValid: false,
          validationError:
            "Participants do not have mutual accepted relationships",
          validatedAt: new Date(),
        });

        // Log the violation for audit purposes
        await logChatViolation(
          chatId,
          chatData,
          "Invalid participant relationships",
        );

        return;
      }

      // Mark chat as valid
      await db.collection("chats").doc(chatId).update({
        isValid: true,
        validatedAt: new Date(),
      });

      logger.info(`Chat ${chatId} validation completed successfully`);
    } catch (error) {
      logger.error("Error validating new chat:", error);
      // Don't throw to avoid affecting chat creation in case of validation errors
    }
  },
);

/**
 * Validate that all participants have mutual accepted relationships
 * @param {Chat} chatData - The chat data containing participants and metadata
 * @return {Promise<boolean>} Promise that resolves to true if all relationships are valid
 */
async function validateChatParticipants(chatData: Chat): Promise<boolean> {
  try {
    const {participants, isGroup, createdBy} = chatData;

    // For group chats, validate that creator has accepted relationships with all other participants
    if (isGroup) {
      const otherParticipants = participants.filter((p) => p !== createdBy);

      for (const participantId of otherParticipants) {
        const hasRelationship = await checkMutualRelationship(
          createdBy,
          participantId,
        );
        if (!hasRelationship) {
          logger.warn(
            `Group chat creator ${createdBy} does not have accepted relationship with ${participantId}`,
          );
          return false;
        }
      }

      return true;
    }

    // For 1-on-1 chats, validate mutual relationship between the two participants
    if (participants.length !== 2) {
      logger.warn("1-on-1 chat must have exactly 2 participants", {
        participants,
      });
      return false;
    }

    const [participant1, participant2] = participants;
    return await checkMutualRelationship(participant1, participant2);
  } catch (error) {
    logger.error("Error validating chat participants:", error);
    return false;
  }
}

/**
 * Check if two users have mutual accepted relationships
 * @param {string} userId1 - The first user ID to check
 * @param {string} userId2 - The second user ID to check
 * @return {Promise<boolean>} Promise that resolves to true if relationship exists
 */
async function checkMutualRelationship(
  userId1: string,
  userId2: string,
): Promise<boolean> {
  try {
    // Users can always message themselves (for testing purposes)
    if (userId1 === userId2) {
      return true;
    }

    // Check relationship from user1 to user2
    const relationship1Doc = await db
      .collection("accounts")
      .doc(userId1)
      .collection("relatedAccounts")
      .doc(userId2)
      .get();

    if (!relationship1Doc.exists) {
      logger.info(`No relationship found from ${userId1} to ${userId2}`);
      return false;
    }

    const relationship1 = relationship1Doc.data() as RelatedAccount;
    if (relationship1.status !== "accepted") {
      logger.info(
        `Relationship from ${userId1} to ${userId2} is not accepted: ${relationship1.status}`,
      );
      return false;
    }

    // Check relationship from user2 to user1
    const relationship2Doc = await db
      .collection("accounts")
      .doc(userId2)
      .collection("relatedAccounts")
      .doc(userId1)
      .get();

    if (!relationship2Doc.exists) {
      logger.info(`No relationship found from ${userId2} to ${userId1}`);
      return false;
    }

    const relationship2 = relationship2Doc.data() as RelatedAccount;
    if (relationship2.status !== "accepted") {
      logger.info(
        `Relationship from ${userId2} to ${userId1} is not accepted: ${relationship2.status}`,
      );
      return false;
    }

    logger.info(
      `Mutual accepted relationship confirmed between ${userId1} and ${userId2}`,
    );
    return true;
  } catch (error) {
    logger.error(
      `Error checking mutual relationship between ${userId1} and ${userId2}:`,
      error,
    );
    return false;
  }
}

/**
 * Log chat validation violations for audit purposes
 * @param {string} chatId - The ID of the chat with validation issues
 * @param {Chat} chatData - The chat data that failed validation
 * @param {string} reason - The reason for the validation failure
 * @return {Promise<void>} Promise that resolves when violation is logged
 */
async function logChatViolation(
  chatId: string,
  chatData: Chat,
  reason: string,
): Promise<void> {
  try {
    const violationData = {
      chatId,
      chatData,
      reason,
      timestamp: new Date(),
      type: "chat_validation_violation",
    };

    await db.collection("auditLogs").add(violationData);
    logger.info(`Logged chat violation: ${chatId} - ${reason}`);
  } catch (error) {
    logger.error(`Error logging chat violation for ${chatId}:`, error);
  }
}

/**
 * Auto-create mutual friend relationships when users start chatting
 * @param {string[]} participants - Array of participant IDs
 * @param {string} createdBy - ID of the user who created the chat
 * @return {Promise<void>} Promise that resolves when relationships are created
 */
async function autoCreateRelationshipsForChat(
  participants: string[],
  createdBy: string,
): Promise<void> {
  try {
    if (participants.length !== 2) {
      logger.info("Auto-relationship creation only applies to 1-on-1 chats");
      return;
    }

    const [user1, user2] = participants;

    // Check if they already have relationships
    const [relationship1, relationship2] = await Promise.all([
      db
        .collection("accounts")
        .doc(user1)
        .collection("relatedAccounts")
        .doc(user2)
        .get(),
      db
        .collection("accounts")
        .doc(user2)
        .collection("relatedAccounts")
        .doc(user1)
        .get(),
    ]);

    // If relationships already exist, no need to create new ones
    if (relationship1.exists && relationship2.exists) {
      logger.info(`Relationships already exist between ${user1} and ${user2}`);
      return;
    }

    // Get account data for both users
    const [account1Doc, account2Doc] = await Promise.all([
      db.collection("accounts").doc(user1).get(),
      db.collection("accounts").doc(user2).get(),
    ]);

    if (!account1Doc.exists || !account2Doc.exists) {
      logger.error(`One or both accounts do not exist: ${user1}, ${user2}`);
      return;
    }

    const account1Data = account1Doc.data();
    const account2Data = account2Doc.data();

    // Determine relationship type (friend for user-to-user relationships)
    const relationshipType =
      account1Data?.type === "group" || account2Data?.type === "group"
        ? account1Data?.type === "group" && account2Data?.type === "group"
          ? "partner"
          : "member"
        : "friend";

    const timestamp = new Date();

    // Create relationship from user1 to user2 (if doesn't exist)
    if (!relationship1.exists) {
      await db
        .collection("accounts")
        .doc(user1)
        .collection("relatedAccounts")
        .doc(user2)
        .set({
          id: user2,
          accountId: user1,
          name: account2Data?.name,
          iconImage: account2Data?.iconImage,
          tagline: account2Data?.tagline,
          type: account2Data?.type,
          status: "accepted", // Auto-accept when starting chat
          relationship: relationshipType,
          createdAt: timestamp,
          createdBy: createdBy,
          lastModifiedAt: timestamp,
          lastModifiedBy: createdBy,
          initiatorId: createdBy,
          targetId: user2,
        });

      logger.info(`Auto-created relationship from ${user1} to ${user2}`);
    }

    // Create relationship from user2 to user1 (if doesn't exist)
    if (!relationship2.exists) {
      await db
        .collection("accounts")
        .doc(user2)
        .collection("relatedAccounts")
        .doc(user1)
        .set({
          id: user1,
          accountId: user2,
          name: account1Data?.name,
          iconImage: account1Data?.iconImage,
          tagline: account1Data?.tagline,
          type: account1Data?.type,
          status: "accepted", // Auto-accept when starting chat
          relationship: relationshipType,
          createdAt: timestamp,
          createdBy: createdBy,
          lastModifiedAt: timestamp,
          lastModifiedBy: createdBy,
          initiatorId: createdBy,
          targetId: user1,
        });

      logger.info(`Auto-created relationship from ${user2} to ${user1}`);
    }

    logger.info(
      `Successfully auto-created mutual relationships for chat participants ${user1} and ${user2}`,
    );
  } catch (error) {
    logger.error("Error auto-creating relationships for chat:", error);
  }
}
