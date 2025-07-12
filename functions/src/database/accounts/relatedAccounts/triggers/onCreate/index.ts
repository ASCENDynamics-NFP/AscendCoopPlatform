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
import * as functions from "firebase-functions";
import {admin} from "../../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {EventContext} from "firebase-functions";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

// Initialize the Firebase admin SDK
// Reference to the Firestore database
const db = admin.firestore();

/**
 * Cloud Function triggered when a new document is created in the `relatedAccounts` sub-collection of an `accounts` document.
 */
export const onCreateRelatedAccount = functions.firestore
  .document("accounts/{accountId}/relatedAccounts/{relatedAccountId}")
  .onCreate(async (_snapshot: QueryDocumentSnapshot, context: EventContext) => {
    const accountId = context.params.accountId;
    const relatedAccountId = context.params.relatedAccountId;

    // Early exit if IDs match to prevent self-referential relationships
    if (accountId === relatedAccountId) {
      logger.error(
        `Prevented self-referential relationship for account ${accountId}`,
      );
      return;
    }

    try {
      // Check if reciprocal relationship already exists
      const reciprocalDoc = await db
        .collection("accounts")
        .doc(relatedAccountId)
        .collection("relatedAccounts")
        .doc(accountId)
        .get();

      if (reciprocalDoc.exists) {
        logger.info(
          `Reciprocal relationship already exists between ${accountId} and ${relatedAccountId}`,
        );
        return;
      }

      const [initiatorDoc, targetDoc] = await Promise.all([
        db.collection("accounts").doc(accountId).get(),
        db.collection("accounts").doc(relatedAccountId).get(),
      ]);

      if (!initiatorDoc.exists || !targetDoc.exists) {
        logger.error(
          `One or both accounts do not exist: ${accountId}, ${relatedAccountId}`,
        );
        return;
      }

      const initiatorData = initiatorDoc.data();
      const targetData = targetDoc.data();

      const relationship = determineRelationshipType(
        initiatorData?.type,
        targetData?.type,
      );

      await db
        .collection("accounts")
        .doc(relatedAccountId)
        .collection("relatedAccounts")
        .doc(accountId)
        .set({
          id: accountId,
          accountId: relatedAccountId,
          name: initiatorData?.name,
          iconImage: initiatorData?.iconImage,
          tagline: initiatorData?.tagline,
          type: initiatorData?.type,
          status: "pending",
          relationship,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          createdBy: accountId,
          lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
          lastModifiedBy: accountId,
          initiatorId: accountId,
          targetId: relatedAccountId,
        });

      logger.info(
        `Successfully created reciprocal relationship between ${accountId} and ${relatedAccountId}`,
      );
    } catch (error) {
      logger.error(`Error creating reciprocal relationship: ${error}`);
    }
  });

/**
 * Determines the relationship type based on the account types of both parties
 * @param {string} initiatorType The account type of the initiator
 * @param {string} targetType The account type of the target
 * @return {string} The determined relationship type: "partner", "member", or "friend"
 */
function determineRelationshipType(
  initiatorType?: string,
  targetType?: string,
): string {
  if (initiatorType === "group" && targetType === "group") return "partner";
  if (initiatorType === "group" || targetType === "group") return "member";
  return "friend";
}
