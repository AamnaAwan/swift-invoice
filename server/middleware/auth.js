const { admin } = require("../firebaseAdmin");

module.exports = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(401).json({ msg: "No token" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded.uid;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};