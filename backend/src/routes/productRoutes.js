const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  const { q = "", category = "", minPrice = 0, maxPrice = Number.MAX_SAFE_INTEGER } = req.query;
  const values = [`%${q}%`, Number(minPrice), Number(maxPrice)];
  let sql = `
    SELECT id, title, description, category, price, image, rating, stock
    FROM products
    WHERE title ILIKE $1 AND price >= $2 AND price <= $3
  `;
  if (category) {
    values.push(category);
    sql += ` AND category = $4`;
  }
  sql += " ORDER BY created_at DESC";

  const result = await pool.query(sql, values);
  res.json(result.rows.map((p) => ({ ...p, _id: String(p.id), price: Number(p.price), rating: Number(p.rating) })));
});

router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT id, title, description, category, price, image, rating, stock FROM products WHERE id = $1",
    [Number(req.params.id)]
  );
  const product = result.rows[0];
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ ...product, _id: String(product.id), price: Number(product.price), rating: Number(product.rating) });
});

module.exports = router;
