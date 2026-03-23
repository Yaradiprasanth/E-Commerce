const express = require("express");
const { pool } = require("../config/db");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.post("/products", async (req, res) => {
  const { title, description, category, price, image, rating = 4.2, stock = 10 } = req.body;
  const created = await pool.query(
    `INSERT INTO products (title, description, category, price, image, rating, stock)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, title, description, category, price, image, rating, stock`,
    [title, description, category, price, image, rating, stock]
  );
  const product = created.rows[0];
  res.status(201).json({ ...product, _id: String(product.id), price: Number(product.price), rating: Number(product.rating) });
});

router.put("/products/:id", async (req, res) => {
  const { title, description, category, price, image, rating, stock } = req.body;
  const updated = await pool.query(
    `UPDATE products
     SET title = $1, description = $2, category = $3, price = $4, image = $5, rating = $6, stock = $7
     WHERE id = $8
     RETURNING id, title, description, category, price, image, rating, stock`,
    [title, description, category, price, image, rating, stock, Number(req.params.id)]
  );
  const product = updated.rows[0];
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ ...product, _id: String(product.id), price: Number(product.price), rating: Number(product.rating) });
});

router.delete("/products/:id", async (req, res) => {
  const deleted = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [Number(req.params.id)]);
  if (!deleted.rows.length) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

module.exports = router;
