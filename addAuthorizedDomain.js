// addAuthorizedDomain.js

const {google} = require("googleapis");

// Parse the service account JSON from environment variables
const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT,
);

// Function to add an authorized domain using Firebase Management API
async function addAuthorizedDomain(previewUrl) {
  const domain = new URL(previewUrl).hostname;

  // Initialize the Google Auth client
  const authClient = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: [
      "https://www.googleapis.com/auth/firebase",
      "https://www.googleapis.com/auth/cloud-platform",
    ],
  });

  const auth = await authClient.getClient();

  // Initialize the Firebase Management API client
  const firebaseManagement = google.firebase({
    version: "v1beta1",
    auth: auth,
  });

  const projectId = serviceAccount.project_id;

  try {
    // Get current Firebase project config
    const res = await firebaseManagement.projects.getConfig({
      name: `projects/${projectId}/config`,
    });

    const currentDomains = res.data.authorizedDomains || [];

    if (currentDomains.includes(domain)) {
      console.log(`✅ Domain "${domain}" is already authorized.`);
      return;
    }

    // Add the new domain
    const updatedDomains = [...currentDomains, domain];

    // Update the project config with the new authorized domains
    await firebaseManagement.projects.updateConfig({
      name: `projects/${projectId}/config`,
      requestBody: {
        authorizedDomains: updatedDomains,
      },
    });

    console.log(`✅ Successfully added "${domain}" to authorized domains.`);
  } catch (error) {
    console.error(`❌ Error adding domain "${domain}":`, error.message);
    process.exit(1);
  }
}

const previewUrl = process.argv[2]; // Pass the preview URL as an argument

if (previewUrl) {
  addAuthorizedDomain(previewUrl).catch(console.error);
} else {
  console.error("❌ Please provide the preview URL to add.");
  process.exit(1);
}
