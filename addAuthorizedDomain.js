// addAuthorizedDomain.js

const admin = require("firebase-admin");
const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT,
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function addAuthorizedDomain(previewUrl) {
  const domain = new URL(previewUrl).hostname;

  const auth = admin.auth();
  const config = await auth.getSettings();
  const domains = config.authorizedDomains || [];

  if (!domains.includes(domain)) {
    domains.push(domain);
    await auth.updateSettings({authorizedDomains: domains});
    console.log(`Added ${domain} to authorized domains.`);
  } else {
    console.log(`${domain} is already in authorized domains.`);
  }
}

const previewUrl = process.argv[2]; // Pass the preview URL as an argument

if (previewUrl) {
  addAuthorizedDomain(previewUrl).catch(console.error);
} else {
  console.error("Please provide the preview URL to add.");
  process.exit(1);
}
