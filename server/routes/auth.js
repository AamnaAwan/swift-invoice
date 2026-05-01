const express = require("express");
const router = express.Router();
const { admin, db } = require("../firebaseAdmin");

// Register
router.post("/register", async (req, res) => {
  if (!admin || !db) {
    return res.status(503).json({ msg: "Firebase backend is not configured" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await db.collection("users").doc(userRecord.uid).set({
      email,
      createdAt: new Date(),
    });

    res.json({ user: { id: userRecord.uid, email: userRecord.email } });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ msg: "Invalid data provided" });
    }
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", (req, res) => {
  res.status(400).json({ msg: "Login should be performed using Firebase Auth client-side." });
});

module.exports = router;