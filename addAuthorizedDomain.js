const admin = require("firebase-admin");
const {google} = require("googleapis");

const serviceAccount = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
);
const projectId = process.env.FIREBASE_PROJECT_ID;
const previewDomain = process.env.PREVIEW_DOMAIN;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function addAuthorizedDomain() {
  try {
    const identityToolkit = google.identitytoolkit({
      version: "v1",
      auth: admin.credential.applicationDefault(),
    });

    // Retrieve current config
    const configRes = await identityToolkit.projects.getConfig({
      name: `projects/${projectId}/config`,
    });

    const currentDomains = configRes.data.authorizedDomains || [];

    if (!currentDomains.includes(previewDomain)) {
      currentDomains.push(previewDomain);
      await identityToolkit.projects.updateConfig({
        name: `projects/${projectId}/config`,
        updateMask: "authorizedDomains",
        requestBody: {
          authorizedDomains: currentDomains,
        },
      });
      console.log(`Added ${previewDomain} to authorized domains.`);
    } else {
      console.log(`${previewDomain} is already authorized.`);
    }
  } catch (error) {
    console.error("Error adding authorized domain:", error);
    process.exit(1);
  }
}

addAuthorizedDomain();
