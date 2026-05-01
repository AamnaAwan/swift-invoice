const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
let credential = null;
let adminApp = null;
let db = null;

if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    credential = admin.credential.cert(serviceAccount);
  } catch (err) {
    console.error("Unable to load Firebase service account file:", err.message);
  }
} else {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    credential = admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    });
  }
}

if (credential) {
  if (!admin.apps.length) {
    adminApp = admin.initializeApp({ credential });
  } else {
    adminApp = admin.app();
  }
  db = admin.firestore();
  console.log("Firebase Admin initialized successfully.");
} else {
  console.warn(
    "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in server/.env."
  );
}

module.exports = { admin: adminApp, db };
