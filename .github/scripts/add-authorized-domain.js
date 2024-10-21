// NOT BEING USED //
const {google} = require("googleapis");
const PROJECT_ID = process.env.DEV_FIREBASE_PROJECT_ID; // Replace with your project ID
const DOMAIN = process.env.PREVIEW_DOMAIN; // Set this environment variable in your workflow

async function addAuthorizedDomain() {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/firebase"],
    credentials: JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_ASCENDCOOPPLATFORM_DEV,
    ),
  });

  const identityToolkit = google.identitytoolkit({
    auth,
    version: "v2",
  });

  const res = await identityToolkit.projects.getConfig({
    name: `projects/${PROJECT_ID}/config`,
  });

  const authorizedDomains = res.data.authorizedDomains || [];
  if (!authorizedDomains.includes(DOMAIN)) {
    authorizedDomains.push(DOMAIN);
    await identityToolkit.projects.updateConfig({
      name: `projects/${PROJECT_ID}/config`,
      updateMask: "authorizedDomains",
      requestBody: {
        authorizedDomains,
      },
    });
    console.log(`Added ${DOMAIN} to authorized domains.`);
  } else {
    console.log(`${DOMAIN} is already in authorized domains.`);
  }
}

addAuthorizedDomain().catch(console.error);
