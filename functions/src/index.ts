import * as functions from 'firebase-functions';
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/* EXAMPLES FUNCTIONS (START) */
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
/* EXAMPLES FUNCTIONS (END) */

/* EXAMPLES TRIGGERS (START) */
// export const exampleCreateTrigger = functions.firestore
// .document('collection/{docId}')
// .onCreate((snap, context) => {
//   // Your logic here.
// });

// export const exampleUpdateTrigger = functions.firestore
// .document('collection/{docId}')
// .onUpdate((change, context) => {
//   // Your logic here.
// });

// export const exampleDeleteTrigger = functions.firestore
// .document('collection/{docId}')
// .onDelete((snap, context) => {
//   // Your logic here.
// });
/* EXAMPLES TRIGGERS (END) */



    