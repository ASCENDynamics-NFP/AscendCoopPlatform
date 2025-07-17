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
import {defineString} from "firebase-functions/params";
import {admin} from "../utils/firebase";
import * as nodemailer from "nodemailer";
import * as logger from "firebase-functions/logger";

// Define environment parameters for Gmail credentials
const gmailEmail = defineString("GMAIL_EMAIL");
const gmailPassword = defineString("GMAIL_PASSWORD");

export const submitLead = onRequest(
  {
    cors: true,
    invoker: "public", // Allow unauthenticated access
  },
  async (req, res) => {
    // Log the incoming request for debugging
    logger.info("submitLead called", {
      method: req.method,
      origin: req.headers.origin,
    });

    // Set CORS headers manually for more control
    const origin = req.headers.origin;
    const allowedOrigins = [
      "http://localhost:8100",
      "http://localhost:4200",
      "https://app.ascendynamics.org",
      "https://ascendcoopplatform.web.app",
      "https://ascendcoopplatform.firebaseapp.com",
      "https://ascendcoopplatform-dev.web.app",
      "https://ascendcoopplatform-dev.firebaseapp.com",
    ];

    // Always set CORS headers first
    if (origin && allowedOrigins.includes(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
    } else {
      res.set("Access-Control-Allow-Origin", "*"); // Allow all for now to debug
    }

    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Max-Age", "3600");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      logger.info("Handling OPTIONS preflight request");
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
    if (!name || !email || !inquiry || !from) {
      res
        .status(400)
        .send("Missing required fields: name, email, inquiry, from");
      return;
    }

    // Create transporter at runtime
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailEmail.value(),
        pass: gmailPassword.value(),
      },
    });

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

    // Prepare email options
    const mailOptions = {
      from: `"${from}" <${gmailEmail.value()}>`,
      to: gmailEmail.value(),
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
      logger.error("Error sending email:", error);
      // Continue to save the lead even if email fails
    }

    try {
      // Save the lead data to Firestore
      await admin.firestore().collection("leads").add(leadData);

      res
        .status(200)
        .send("Lead submitted, email sent, and data saved successfully");
    } catch (error) {
      logger.error("Error processing submission:", error);
      res.status(500).send("Error processing submission");
    }
  },
);
