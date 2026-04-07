const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(401).json({ msg: "No token" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};