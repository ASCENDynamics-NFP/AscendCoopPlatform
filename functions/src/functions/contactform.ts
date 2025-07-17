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
import {onRequest} from "firebase-functions/v2/https";
import {config} from "firebase-functions";
import {admin} from "../utils/firebase";
import * as nodemailer from "nodemailer";
import cors from "cors";

// Initialize the Firebase admin SDK
// Configure CORS middleware
const corsHandler = cors({origin: true});

// Retrieve Gmail credentials from Firebase config
const gmailEmail = config().gmail.email;
const gmailPassword = config().gmail.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

export const submitLead = onRequest({cors: false}, (req, res) => {
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
    const {name, email, phone, inquiry, message, from} = req.body;

    // Validate required fields
    // Here, "phone" and "message" are optional, but "inquiry" is required.
    if (!name || !email || !inquiry || !from) {
      res
        .status(400)
        .send("Missing required fields: name, email, inquiry, from, or to");
      return;
    }

    // Create a lead data object to be stored in Firestore
    const leadData = {
      name,
      email,
      phone: phone || "",
      inquiry,
      message: message || "",
      from,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Prepare email options using the provided parameters
    const mailOptions = {
      from: `"${from}" <${gmailEmail}>`,
      to: gmailEmail,
      subject: "New Lead Submission",
      text: `You have a new lead submission:

Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Reason for Inquiry: ${inquiry}
Additional Information: ${message || "No message provided"}
`,
      html: `<p>You have a new lead submission:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || "N/A"}</p>
             <p><strong>Reason for Inquiry:</strong> ${inquiry}</p>
             <p><strong>Additional Information:</strong> ${message || "No message provided"}</p>`,
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      // We won't return here, because we still want to attempt saving the lead.
    }

    try {
      // Save the lead data to Firestore in the "leads" collection
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
