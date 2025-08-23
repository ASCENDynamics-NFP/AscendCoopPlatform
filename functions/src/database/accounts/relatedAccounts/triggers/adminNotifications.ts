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
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 ***********************************************************************************************/

import {
  onDocumentCreated,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

const db = admin.firestore();

/**
 * Cloud Function to handle admin notifications when someone requests to join a group
 */
export const notifyAdminsOnMemberRequest = onDocumentCreated(
  {
    document: "accounts/{accountId}/relatedAccounts/{relatedAccountId}",
    region: "us-central1",
  },
  async (
    event: FirestoreEvent<
      QueryDocumentSnapshot | undefined,
      {accountId: string; relatedAccountId: string}
    >,
  ) => {
    if (!event.data) {
      logger.error("No document data found in member request event");
      return;
    }

    const requestData = event.data.data();
    const {accountId, relatedAccountId} = event.params;

    // Only process member join requests that are pending
    if (
      requestData.relationship !== "member" ||
      requestData.status !== "pending" ||
      requestData.initiatorId === accountId // Don't notify for self-initiated requests
    ) {
      return;
    }

    try {
      // Get group information
      const groupDoc = await db.collection("accounts").doc(accountId).get();
      if (!groupDoc.exists) {
        logger.error(`Group account ${accountId} not found`);
        return;
      }

      const groupData = groupDoc.data();
      if (!groupData) {
        logger.error(`No data found for group ${accountId}`);
        return;
      }

      // Check if admin notifications are enabled for member join requests
      const notificationPrefs =
        groupData.administrativeSettings?.notificationPreferences;
      if (notificationPrefs) {
        try {
          const prefs = JSON.parse(notificationPrefs);
          if (prefs.memberJoinRequests === false) {
            logger.info(
              `Member join request notifications disabled for group ${accountId}`,
            );
            return;
          }
        } catch (error) {
          logger.warn(
            "Error parsing notification preferences, proceeding with notification",
          );
        }
      }

      // Get requester information
      const requesterDoc = await db
        .collection("accounts")
        .doc(relatedAccountId)
        .get();
      if (!requesterDoc.exists) {
        logger.error(`Requester account ${relatedAccountId} not found`);
        return;
      }

      const requesterData = requesterDoc.data();
      if (!requesterData) {
        logger.error(`No data found for requester ${relatedAccountId}`);
        return;
      }

      // Find group admins (those with access="admin" in relatedAccounts)
      const relatedAccountsSnapshot = await db
        .collection("accounts")
        .doc(accountId)
        .collection("relatedAccounts")
        .where("access", "==", "admin")
        .where("status", "==", "accepted")
        .get();

      const adminIds: string[] = [];
      relatedAccountsSnapshot.forEach((doc) => {
        adminIds.push(doc.data().id);
      });

      // Also include the group owner
      if (groupData.createdBy && !adminIds.includes(groupData.createdBy)) {
        adminIds.push(groupData.createdBy);
      }

      if (adminIds.length === 0) {
        logger.warn(`No admins found for group ${accountId}`);
        return;
      }

      // Create notification documents for each admin
      const notificationPromises = adminIds.map(async (adminId) => {
        const notificationData = {
          id: `member-request-${accountId}-${relatedAccountId}-${Date.now()}`,
          type: "member_join_request",
          recipientId: adminId,
          groupId: accountId,
          groupName: groupData.name || "Unknown Group",
          requesterId: relatedAccountId,
          requesterName: requesterData.name || "Unknown User",
          requesterType: requesterData.type || "user",
          requesterIconImage: requesterData.iconImage || null,
          message: `${requesterData.name || "Someone"} has requested to join ${groupData.name || "your group"}`,
          isRead: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        };

        return db
          .collection("accounts")
          .doc(adminId)
          .collection("notifications")
          .add(notificationData);
      });

      await Promise.all(notificationPromises);

      logger.info(
        `Successfully created member join request notifications for ${adminIds.length} admins of group ${accountId}`,
      );

      // TODO: Send push notifications and emails based on admin preferences
      // This would integrate with FCM and email services
    } catch (error) {
      logger.error(
        "Error creating admin notifications for member request:",
        error,
      );
    }
  },
);
