const { google } = require('googleapis');

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
const projectId = process.env.FIREBASE_PROJECT_ID;
const previewDomain = process.env.PREVIEW_DOMAIN;

async function removeAuthorizedDomain() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/identitytoolkit'],
    });

    const authClient = await auth.getClient();

    const identityToolkit = google.identitytoolkit({
      version: 'v3',
      auth: authClient,
    });

    const configRes = await identityToolkit.projects.getConfig({
      name: `projects/${projectId}/config`,
    });

    let currentDomains = configRes.data.authorizedDomains || [];

    if (currentDomains.includes(previewDomain)) {
      currentDomains = currentDomains.filter((d) => d !== previewDomain);

      await identityToolkit.projects.updateConfig({
        name: `projects/${projectId}/config`,
        updateMask: 'authorizedDomains',
        requestBody: {
          authorizedDomains: currentDomains,
        },
      });

      console.log(`Removed ${previewDomain} from authorized domains.`);
    } else {
      console.log(`${previewDomain} not found in authorized domains.`);
    }
  } catch (error) {
    console.error('Error removing authorized domain:', error);
    process.exit(1);
  }
}

removeAuthorizedDomain();
