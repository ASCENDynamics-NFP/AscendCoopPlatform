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
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {EventContext} from "firebase-functions";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

// Initialize the Firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
// Reference to the Firestore database
const db = admin.firestore();

/**
 * Cloud Function triggered when a new document is created in the `relatedAccounts` sub-collection of an `accounts` document.
 */
export const onCreateRelatedAccount = functions.firestore
  .document("accounts/{accountId}/relatedAccounts/{relatedAccountId}")
  .onCreate(handleRelatedAccountCreate);

/**
 * Handles the creation of a new related account document, ensuring corresponding reciprocal documents are created in both accounts.
 *
 * @param {QueryDocumentSnapshot} _snapshot - The snapshot of the newly created document.
 * @param {EventContext} context - The context of the event, providing parameters and identifiers.
 */
async function handleRelatedAccountCreate(
  _snapshot: QueryDocumentSnapshot,
  context: EventContext,
) {
  const accountId = context.params.accountId;
  const relatedAccountId = context.params.relatedAccountId;
  try {
    // Query the related account's details
    const initiatorAccountDoc = await db
      .collection("accounts")
      .doc(accountId)
      .get();
    const targetAccountDoc = await db
      .collection("accounts")
      .doc(relatedAccountId)
      .get();

    if (!initiatorAccountDoc.exists || !targetAccountDoc.exists) {
      logger.error(`Related account with ID ${accountId} does not exist.`);
      return;
    }

    const initiatorAccountData = initiatorAccountDoc.data();
    const targetAccountData = targetAccountDoc.data();

    // Create a relatedAccount document for the initiator
    // const initiatorRelatedAccountRef = db
    //   .collection("accounts")
    //   .doc(accountId)
    //   .collection("relatedAccounts")
    //   .doc(relatedAccountId);

    const relationship =
      initiatorAccountData?.type === "group" &&
      targetAccountData?.type === "group"
        ? "partner"
        : initiatorAccountData?.type === "group" ||
          targetAccountData?.type === "group"
        ? "member"
        : "friend";

    // const initiatorRelatedAccount = {
    //   id: relatedAccountId,
    //   name: targetAccountData?.name,
    //   iconImage: targetAccountData?.iconImage,
    //   tagline: targetAccountData?.tagline,
    //   type: targetAccountData?.type,
    //   status: "pending", // default status is pending
    //   relationship: relationship,
    //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
    //   createdBy: accountId,
    //   lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    //   lastModifiedBy: accountId,
    //   initiatorId: accountId,
    //   targetId: relatedAccountId,
    // };
    // await initiatorRelatedAccountRef.set(initiatorRelatedAccount);

    // Create a relatedAccount document for the target
    const targetRelatedAccountRef = db
      .collection("accounts")
      .doc(relatedAccountId)
      .collection("relatedAccounts")
      .doc(accountId);

    const targetRelatedAccount = {
      id: accountId,
      name: initiatorAccountData?.name,
      iconImage: initiatorAccountData?.iconImage,
      tagline: initiatorAccountData?.tagline,
      type: initiatorAccountData?.type,
      status: "pending", // default status is pending
      relationship: relationship,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: accountId,
      lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModifiedBy: accountId,
      initiatorId: accountId,
      targetId: relatedAccountId,
    };
    await targetRelatedAccountRef.set(targetRelatedAccount);

    logger.info("Related account documents created successfully.");
  } catch (error) {
    logger.error("Error creating related account documents: ", error);
  }
}
