const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB, initDB, pool } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const seedProducts = require("./seedProducts");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/seed", async (_, res) => {
  for (const product of seedProducts) {
    const existingProduct = await pool.query("SELECT id FROM products WHERE title = $1", [product.title]);
    if (!existingProduct.rows.length) {
      await pool.query(
        `INSERT INTO products (title, description, category, price, image, rating, stock)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          product.title,
          product.description,
          product.category,
          product.price,
          product.image,
          product.rating,
          product.stock,
        ]
      );
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@shop.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [adminEmail]);
  if (!existing.rows.length) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4)",
      ["Admin", adminEmail, hash, true]
    );
  }
  res.json({ message: "Seeded products by category and admin user" });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await initDB();
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
};

start();
