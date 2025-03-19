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
import * as nodemailer from "nodemailer";
import * as cors from "cors";

// Initialize the Firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configure CORS middleware
const corsHandler = cors({origin: true});

// Retrieve Gmail credentials from Firebase config
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

export const submitLead = functions.https.onRequest((req, res) => {
  // Use CORS middleware to allow cross-origin requests
  corsHandler(req, res, async () => {
    if (req.method === "OPTIONS") {
      // Stop preflight requests here
      res.status(204).send("");
      return;
    }

    // Only accept POST requests
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // Extract parameters from the request body
    const {name, email, message, from, to} = req.body;

    // Validate required fields
    if (!name || !email || !message || !from || !to) {
      res.status(400).send("Missing required fields: name, email, from, or to");
      return;
    }

    // Create a lead data object to be stored in Firestore
    const leadData = {
      name,
      email,
      message: message || "",
      from,
      to,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Prepare email options using the provided parameters
    const mailOptions = {
      from: `"${from}" <${gmailEmail}>`,
      to: to,
      subject: "New Lead Submission",
      text: `You have a new lead submission:

    Name: ${name}
    Email: ${email}
    Message: ${message || "No message provided"}`,
      html: `<p>You have a new lead submission:</p>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Message:</strong> ${message || "No message provided"}</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    try {
      await admin.firestore().collection("leads").add(leadData);
      res
        .status(200)
        .send("Lead submitted, email sent, and data saved successfully");
    } catch (error) {
      console.error("Error processing submission:", error);
      res.status(500).send("Error processing submission");
    }
  });
});
