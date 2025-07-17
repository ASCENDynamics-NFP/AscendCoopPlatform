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

/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// Auth triggers
export {createUserProfile} from "./auth/user/triggers/onCreate";
export {onUserRecordDeletion} from "./auth/user/triggers/onDelete";

// Account triggers
export {onUpdateAccount} from "./database/accounts/triggers/onUpdate";

// Related accounts triggers
export {onCreateRelatedAccount} from "./database/accounts/relatedAccounts/triggers/onCreate";
export {onDeleteRelatedAccount} from "./database/accounts/relatedAccounts/triggers/onDelete";
export {onUpdateRelatedAccount} from "./database/accounts/relatedAccounts/triggers/onUpdate";

// Related listings triggers
export {onDeleteAccountsRelatedListing} from "./database/accounts/relatedListings/triggers/onDelete";

// Listing triggers
export {onCreateListing} from "./database/listings/triggers/onCreate";
export {onDeleteListing} from "./database/listings/triggers/onDelete";
export {onUpdateListing} from "./database/listings/triggers/onUpdate";

// Listings related accounts triggers
export {onCreateListingsRelatedAccount} from "./database/listings/relatedAccounts/triggers/onCreate";
export {onUpdateListingsRelatedAccount} from "./database/listings/relatedAccounts/triggers/onUpdate";

// HTTP functions
export {getHomepageListings} from "./functions/listings/homepage";
export {submitLead} from "./functions/contactform";
