const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const created = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, is_admin",
      [name, email, hashed]
    );
    const user = created.rows[0];
    res
      .status(201)
      .json({ token: signToken(user.id), user: { id: user.id, name: user.name, email: user.email, isAdmin: user.is_admin } });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const found = await pool.query("SELECT id, name, email, password, is_admin FROM users WHERE email = $1", [email]);
    const user = found.rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      token: signToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.is_admin },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json({ _id: req.user.id, name: req.user.name, email: req.user.email, isAdmin: req.user.isAdmin });
});

module.exports = router;
