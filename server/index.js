const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/invoice-saas")
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
  console.log("Falling back to in-memory storage");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/invoices", require("./routes/invoice"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(5000, () => console.log("Server running on port 5000"));