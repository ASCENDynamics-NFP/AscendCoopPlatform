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

import {onCall, HttpsError} from "firebase-functions/v2/https";
import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore, FieldValue} from "firebase-admin/firestore";
import {logger} from "firebase-functions";

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

interface CreateGroupChatRequest {
  name: string;
  participantIds: string[];
  description?: string;
}

interface AddUserToChatRequest {
  chatId: string;
  newUserId: string;
}

interface RemoveUserFromChatRequest {
  chatId: string;
  userId: string;
}

interface Chat {
  id: string;
  participants: string[];
  isGroup: boolean;
  name?: string;
  groupName?: string;
  createdAt: FirebaseFirestore.Timestamp;
  createdBy: string;
  admins?: string[];
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
 * Create a new group chat with validation
 */
export const createGroupChat = onCall(async (request) => {
  try {
    // Check authentication
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const currentUserId = request.auth.uid;
    const data = request.data as CreateGroupChatRequest;

    // Validate input
    if (
      !data.name ||
      !data.participantIds ||
      data.participantIds.length === 0
    ) {
      throw new HttpsError(
        "invalid-argument",
        "Group name and participant IDs are required",
      );
    }

    // Ensure current user is in participants
    const allParticipants = Array.from(
      new Set([currentUserId, ...data.participantIds]),
    );

    // Validate that creator has relationships with all participants
    for (const participantId of data.participantIds) {
      if (participantId === currentUserId) continue;

      const hasRelationship = await checkAcceptedRelationship(
        currentUserId,
        participantId,
      );
      if (!hasRelationship) {
        throw new HttpsError(
          "permission-denied",
          `You don't have an accepted relationship with user ${participantId}`,
        );
      }
    }

    // Create group chat document
    const chatData = {
      participants: allParticipants,
      isGroup: true,
      name: data.name,
      groupName: data.name,
      description: data.description || null,
      createdAt: FieldValue.serverTimestamp(),
      createdBy: currentUserId,
      lastModifiedAt: FieldValue.serverTimestamp(),
      lastModifiedBy: currentUserId,
      admins: [currentUserId],
      isValid: true,
      validatedAt: FieldValue.serverTimestamp(),
    };

    const chatRef = await db.collection("chats").add(chatData);

    // Add system message about group creation
    await chatRef.collection("messages").add({
      type: "system",
      text: `Group "${data.name}" was created by ${currentUserId}`,
      senderId: "system",
      timestamp: FieldValue.serverTimestamp(),
      isValid: true,
    });

    logger.info(`Group chat created: ${chatRef.id}`, {
      name: data.name,
      createdBy: currentUserId,
      participants: allParticipants,
    });

    return {
      success: true,
      chatId: chatRef.id,
      message: "Group chat created successfully",
    };
  } catch (error) {
    logger.error("Error creating group chat:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to create group chat");
  }
});

/**
 * Add a user to an existing group chat
 */
export const addUserToChat = onCall(async (request) => {
  try {
    // Check authentication
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const currentUserId = request.auth.uid;
    const data = request.data as AddUserToChatRequest;

    // Validate input
    if (!data.chatId || !data.newUserId) {
      throw new HttpsError(
        "invalid-argument",
        "Chat ID and new user ID are required",
      );
    }

    // Get chat document
    const chatDoc = await db.collection("chats").doc(data.chatId).get();
    if (!chatDoc.exists) {
      throw new HttpsError("not-found", "Chat not found");
    }

    const chatData = {id: chatDoc.id, ...chatDoc.data()} as Chat;

    // Validate permissions
    if (!chatData.isGroup) {
      throw new HttpsError(
        "permission-denied",
        "Cannot add users to 1-on-1 chats",
      );
    }

    if (!chatData.participants.includes(currentUserId)) {
      throw new HttpsError(
        "permission-denied",
        "You are not a participant in this chat",
      );
    }

    // Check if user is already a participant
    if (chatData.participants.includes(data.newUserId)) {
      throw new HttpsError("already-exists", "User is already in this chat");
    }

    // Validate that current user has relationship with new user
    const hasRelationship = await checkAcceptedRelationship(
      currentUserId,
      data.newUserId,
    );
    if (!hasRelationship) {
      throw new HttpsError(
        "permission-denied",
        "You don't have an accepted relationship with this user",
      );
    }

    // Add user to chat
    await db
      .collection("chats")
      .doc(data.chatId)
      .update({
        participants: FieldValue.arrayUnion(data.newUserId),
        lastModifiedAt: FieldValue.serverTimestamp(),
        lastModifiedBy: currentUserId,
      });

    // Add system message
    await db
      .collection("chats")
      .doc(data.chatId)
      .collection("messages")
      .add({
        type: "system",
        text: `${data.newUserId} was added to the group by ${currentUserId}`,
        senderId: "system",
        timestamp: FieldValue.serverTimestamp(),
        isValid: true,
      });

    logger.info(`User ${data.newUserId} added to chat ${data.chatId}`, {
      addedBy: currentUserId,
    });

    return {
      success: true,
      message: "User added to chat successfully",
    };
  } catch (error) {
    logger.error("Error adding user to chat:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to add user to chat");
  }
});

/**
 * Remove a user from a group chat
 */
export const removeUserFromChat = onCall(async (request) => {
  try {
    // Check authentication
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const currentUserId = request.auth.uid;
    const data = request.data as RemoveUserFromChatRequest;

    // Validate input
    if (!data.chatId || !data.userId) {
      throw new HttpsError(
        "invalid-argument",
        "Chat ID and user ID are required",
      );
    }

    // Get chat document
    const chatDoc = await db.collection("chats").doc(data.chatId).get();
    if (!chatDoc.exists) {
      throw new HttpsError("not-found", "Chat not found");
    }

    const chatData = {id: chatDoc.id, ...chatDoc.data()} as Chat;

    // Validate permissions
    if (!chatData.isGroup) {
      throw new HttpsError(
        "permission-denied",
        "Cannot remove users from 1-on-1 chats",
      );
    }

    if (!chatData.participants.includes(currentUserId)) {
      throw new HttpsError(
        "permission-denied",
        "You are not a participant in this chat",
      );
    }

    // Check if user can remove (admin or removing themselves)
    const isAdmin = chatData.admins?.includes(currentUserId);
    const isRemovingSelf = data.userId === currentUserId;

    if (!isAdmin && !isRemovingSelf) {
      throw new HttpsError(
        "permission-denied",
        "Only admins can remove other users",
      );
    }

    // Check if user is in the chat
    if (!chatData.participants.includes(data.userId)) {
      throw new HttpsError("not-found", "User is not in this chat");
    }

    // Remove user from chat
    await db
      .collection("chats")
      .doc(data.chatId)
      .update({
        participants: FieldValue.arrayRemove(data.userId),
        lastModifiedAt: FieldValue.serverTimestamp(),
        lastModifiedBy: currentUserId,
      });

    // If removing an admin, remove from admins array too
    if (chatData.admins?.includes(data.userId)) {
      await db
        .collection("chats")
        .doc(data.chatId)
        .update({
          admins: FieldValue.arrayRemove(data.userId),
        });
    }

    // Add system message
    const actionText = isRemovingSelf ? "left" : "was removed from";
    const byText = isRemovingSelf ? "" : ` by ${currentUserId}`;
    await db
      .collection("chats")
      .doc(data.chatId)
      .collection("messages")
      .add({
        type: "system",
        text: `${data.userId} ${actionText} the group${byText}`,
        senderId: "system",
        timestamp: FieldValue.serverTimestamp(),
        isValid: true,
      });

    logger.info(`User ${data.userId} removed from chat ${data.chatId}`, {
      removedBy: currentUserId,
      isRemovingSelf,
    });

    return {
      success: true,
      message: "User removed from chat successfully",
    };
  } catch (error) {
    logger.error("Error removing user from chat:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to remove user from chat");
  }
});

/**
 * Check if two users have an accepted relationship
 * @param {string} userId1 - The first user ID to check
 * @param {string} userId2 - The second user ID to check
 * @return {Promise<boolean>} Promise that resolves to true if relationship exists
 */
async function checkAcceptedRelationship(
  userId1: string,
  userId2: string,
): Promise<boolean> {
  try {
    if (userId1 === userId2) return true;

    const relationshipDoc = await db
      .collection("accounts")
      .doc(userId1)
      .collection("relatedAccounts")
      .doc(userId2)
      .get();

    if (!relationshipDoc.exists) return false;

    const relationship = relationshipDoc.data() as RelatedAccount;
    return relationship.status === "accepted";
  } catch (error) {
    logger.error("Error checking relationship:", error);
    return false;
  }
}
