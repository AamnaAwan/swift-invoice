require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { admin, db } = require("./firebaseAdmin");

const app = express();
app.set("trust proxy", 1);

const normalizeOrigin = (origin) => origin?.replace(/\/+$|\s+/g, "") || "";
const allowedOrigins = [
  normalizeOrigin(process.env.CLIENT_URL || "http://localhost:5173"),
  normalizeOrigin("https://swift-invoiice.netlify.app")
];

const corsOptions = {
  origin(origin, callback) {
    const normalizedOrigin = normalizeOrigin(origin);
    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler(req, res) {
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later."
    });
  }
});

const clientBuildPath = path.join(__dirname, "..", "client", "dist");

app.use(helmet());
app.use(apiLimiter);
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQ", req.method, req.path, req.originalUrl, req.baseUrl);
  next();
});

app.use("/api", (req, res, next) => {
  console.log("API request:", req.method, req.originalUrl);
  next();
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/invoices", require("./routes/invoice"));

app.get("/hello", (req, res) => {
  res.json({ success: true, message: "Hello route works" });
});

app.get("/api/test-firebase", async (req, res) => {
  console.log("Reached direct /api/test-firebase route");
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

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get(/.*/, (req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ success: false, message: "API route not found" });
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ success: true, message: "API is running" });
  });
}

app.use((req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" && statusCode === 500
        ? "Internal Server Error"
        : err.message || "Something went wrong",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (db) {
    try {
      await db.collection("health").doc("init").get();
      console.log("Firebase initialized successfully");
    } catch (err) {
      console.warn("Firebase initialization health check failed:", err.message);
    }
  } else {
    console.warn("Firebase backend is not configured. Server is starting in read-only/standalone mode.");
  }

  console.log("Registered routes:", app._router?.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path)
  );

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch(err => {
  console.error("Firebase initialization error:", err.message);
  console.error("Unable to start server without Firebase. Exiting.");
  process.exit(1);
});