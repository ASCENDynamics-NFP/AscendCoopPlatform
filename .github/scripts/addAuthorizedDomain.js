// NOT BEING USED //
const { google } = require('googleapis');

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
const projectId = process.env.FIREBASE_PROJECT_ID;
const previewDomain = process.env.PREVIEW_DOMAIN;

async function addAuthorizedDomain() {
  try {
    // Initialize Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/identitytoolkit'],
    });

    // Acquire an authenticated client
    const authClient = await auth.getClient();

    // Initialize the Identity Toolkit API with the correct version
    const identityToolkit = google.identitytoolkit({
      version: 'v2', // Use v2 for projects.* methods
      auth: authClient,
    });

    // Retrieve current Firebase Auth configuration
    const configRes = await identityToolkit.projects.getConfig({
      name: `projects/${projectId}/config`,
    });

    const currentDomains = configRes.data.authorizedDomains || [];

    // Check if the preview domain is already authorized
    if (!currentDomains.includes(previewDomain)) {
      currentDomains.push(previewDomain);

      // Update the Firebase Auth configuration with the new domain
      await identityToolkit.projects.updateConfig({
        name: `projects/${projectId}/config`,
        updateMask: 'authorizedDomains',
        requestBody: {
          authorizedDomains: currentDomains,
        },
      });

      console.log(`Added ${previewDomain} to authorized domains.`);
    } else {
      console.log(`${previewDomain} is already authorized.`);
    }
  } catch (error) {
    console.error('Error adding authorized domain:', error);
    process.exit(1);
  }
}

addAuthorizedDomain();
