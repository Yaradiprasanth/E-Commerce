const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      "SELECT id, name, email, is_admin FROM users WHERE id = $1",
      [decoded.id]
    );
    req.user = result.rows[0]
      ? {
          id: result.rows[0].id,
          name: result.rows[0].name,
          email: result.rows[0].email,
          isAdmin: result.rows[0].is_admin,
        }
      : null;
    if (!req.user) {
      return res.status(401).json({ message: "Invalid token user" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { protect, adminOnly };
