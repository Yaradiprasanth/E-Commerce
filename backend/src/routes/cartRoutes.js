const express = require("express");
const { pool } = require("../config/db");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const result = await pool.query(
    `SELECT c.quantity,
            p.id, p.title, p.description, p.category, p.price, p.image, p.rating, p.stock
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1`,
    [req.user.id]
  );
  res.json(
    result.rows.map((row) => ({
      quantity: row.quantity,
      product: {
        _id: String(row.id),
        title: row.title,
        description: row.description,
        category: row.category,
        price: Number(row.price),
        image: row.image,
        rating: Number(row.rating),
        stock: row.stock,
      },
    }))
  );
});

router.post("/", protect, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await pool.query("SELECT id FROM products WHERE id = $1", [Number(productId)]);
  if (!product.rows.length) return res.status(404).json({ message: "Product not found" });

  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
    [req.user.id, Number(productId), Number(quantity)]
  );
  const updated = await pool.query(
    `SELECT c.quantity,
            p.id, p.title, p.description, p.category, p.price, p.image, p.rating, p.stock
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1`,
    [req.user.id]
  );
  res.status(201).json(
    updated.rows.map((row) => ({
      quantity: row.quantity,
      product: {
        _id: String(row.id),
        title: row.title,
        description: row.description,
        category: row.category,
        price: Number(row.price),
        image: row.image,
        rating: Number(row.rating),
        stock: row.stock,
      },
    }))
  );
});

router.patch("/:productId", protect, async (req, res) => {
  const quantity = Math.max(1, Number(req.body.quantity || 1));
  const updatedRow = await pool.query(
    "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING id",
    [quantity, req.user.id, Number(req.params.productId)]
  );
  if (!updatedRow.rows.length) return res.status(404).json({ message: "Item not in cart" });
  const updated = await pool.query(
    `SELECT c.quantity,
            p.id, p.title, p.description, p.category, p.price, p.image, p.rating, p.stock
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1`,
    [req.user.id]
  );
  res.json(
    updated.rows.map((row) => ({
      quantity: row.quantity,
      product: {
        _id: String(row.id),
        title: row.title,
        description: row.description,
        category: row.category,
        price: Number(row.price),
        image: row.image,
        rating: Number(row.rating),
        stock: row.stock,
      },
    }))
  );
});

router.delete("/:productId", protect, async (req, res) => {
  await pool.query("DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2", [
    req.user.id,
    Number(req.params.productId),
  ]);
  const updated = await pool.query(
    `SELECT c.quantity,
            p.id, p.title, p.description, p.category, p.price, p.image, p.rating, p.stock
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1`,
    [req.user.id]
  );
  res.json(
    updated.rows.map((row) => ({
      quantity: row.quantity,
      product: {
        _id: String(row.id),
        title: row.title,
        description: row.description,
        category: row.category,
        price: Number(row.price),
        image: row.image,
        rating: Number(row.rating),
        stock: row.stock,
      },
    }))
  );
});

module.exports = router;
