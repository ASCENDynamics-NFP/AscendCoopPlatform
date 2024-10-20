// addAuthorizedDomain.js

/**
 * This script adds a specified domain to Firebase Authentication's authorized domains.
 * Usage: node addAuthorizedDomain.js your-preview-domain.web.app
 */

// Import the Firebase Admin SDK
const admin = require("firebase-admin");

// Parse the service account JSON from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * Adds a domain to the list of authorized domains in Firebase Authentication.
 * @param {string} domain - The domain to add.
 */
async function addAuthorizedDomain(domain) {
  try {
    // Retrieve current authentication settings
    const authSettings = await admin.auth().getAuthSettings();

    // Extract existing authorized domains or initialize an empty array
    const authorizedDomains =
      authSettings?.authDomainSettings?.allowedDomains || [];

    // Check if the domain is already authorized
    if (authorizedDomains.includes(domain)) {
      console.log(`✅ Domain "${domain}" is already authorized.`);
      return;
    }

    // Add the new domain to the list
    authorizedDomains.push(domain);

    // Update Firebase Authentication settings with the new list of authorized domains
    await admin.auth().updateAuthSettings({
      authDomainSettings: {
        allowedDomains: authorizedDomains,
      },
    });

    console.log(`✅ Successfully added "${domain}" to authorized domains.`);
  } catch (error) {
    console.error(`❌ Error adding domain "${domain}":`, error);
    process.exit(1); // Exit with failure
  }
}

// Retrieve the domain from command-line arguments
const domain = process.argv[2];

if (!domain) {
  console.error(
    "❌ No domain provided. Usage: node addAuthorizedDomain.js your-preview-domain.web.app",
  );
  process.exit(1); // Exit with failure
}

// Execute the function
addAuthorizedDomain(domain);
