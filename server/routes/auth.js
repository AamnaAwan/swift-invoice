const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

// In-memory storage for testing when MongoDB is not available
let inMemoryUsers = [];
let userIdCounter = 1;

// Helper function to check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Register
router.post("/register", async (req, res) => {
  console.log("Registration request received:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    let user;

    if (isMongoConnected()) {
      user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ email, password: hashedPassword });
      await user.save();
    } else {
      // Fallback to in-memory storage
      user = inMemoryUsers.find(u => u.email === email);
      if (user) return res.status(400).json({ msg: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = {
        _id: userIdCounter++,
        email,
        password: hashedPassword,
        date: new Date()
      };
      inMemoryUsers.push(user);
    }

    const token = jwt.sign({ id: user._id }, "secretkey");
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: "Invalid data provided" });
    }
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    let user;

    if (isMongoConnected()) {
      user = await User.findOne({ email });
    } else {
      // Fallback to in-memory storage
      user = inMemoryUsers.find(u => u.email === email);
    }

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secretkey");
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;