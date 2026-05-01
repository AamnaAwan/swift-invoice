const express = require("express");
const router = express.Router();
const { admin } = require("../firebaseAdmin");

router.get("/", async (req, res) => {
  if (!admin) {
    return res.status(503).json({ success: false, message: "Firebase Admin is not configured." });
  }

  try {
    await admin.auth().listUsers(1);
    res.json({ success: true, message: "Firebase Admin is configured and reachable." });
  } catch (error) {
    console.error("Firebase test route error:", error);
    res.status(500).json({ success: false, message: "Firebase Admin test failed.", error: error.message });
  }
});

module.exports = router;
