import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const targetPath = path.resolve(
  __dirname,
  "../src/environments/environment.prod.ts",
);
const envConfigFile = `
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}'
  }
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Wrote variables to ${targetPath}`);
