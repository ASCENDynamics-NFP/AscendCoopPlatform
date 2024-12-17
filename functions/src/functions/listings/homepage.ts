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

/** Firebase Cloud Function for Homepage Listings */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

// Initialize the Firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const corsHandler = cors({origin: true}); // Allow all origins for development

export const getHomepageListings = functions.https.onRequest(
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const {
          limit = 4,
          status = "active",
          // latitude,
          // longitude,
          category,
        } = req.query;

        // Validate inputs
        const queryLimit = Math.min(
          Math.max(parseInt(limit as string) || 4, 1),
          100,
        ); // Min 1, Max 100
        const queryStatus = typeof status === "string" ? status : "active";
        const queryCategory =
          category && typeof category === "string" ? category : null;

        // Firestore query
        let query = admin
          .firestore()
          .collection("listings")
          .where("status", "==", queryStatus)
          .limit(queryLimit);
        if (queryCategory) {
          query = query.where("category", "==", queryCategory);
        }

        // Execute query
        const snapshot = await query.get();
        const listings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        res.status(200).json(listings);
      } catch (error) {
        console.error("Error fetching homepage listings:", error);
        res.status(500).json({error: "Internal server error"});
      }
    });
  },
);
