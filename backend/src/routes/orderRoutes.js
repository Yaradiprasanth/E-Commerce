const express = require("express");
const { pool } = require("../config/db");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const cart = await client.query(
      `SELECT c.quantity, p.id AS product_id, p.title, p.price, p.image
       FROM cart_items c JOIN products p ON p.id = c.product_id
       WHERE c.user_id = $1`,
      [req.user.id]
    );
    if (!cart.rows.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.rows.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method)
       VALUES ($1, $2, 'pending', $3, $4)
       RETURNING id, total_amount, status, shipping_address, payment_method, created_at`,
      [
        req.user.id,
        totalAmount,
        shippingAddress || "Default Shipping Address",
        paymentMethod || null,
      ]
    );
    const order = orderRes.rows[0];

    for (const item of cart.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, title, price, quantity, image)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.product_id, item.title, item.price, item.quantity, item.image]
      );
    }
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);
    await client.query("COMMIT");

    const itemsRes = await pool.query(
      `SELECT title, price, quantity, image FROM order_items WHERE order_id = $1`,
      [order.id]
    );
    const items = itemsRes.rows.map((item) => ({
      title: item.title,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image,
    }));

    res.status(201).json({
      _id: String(order.id),
      totalAmount: Number(order.total_amount),
      status: order.status,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method,
      createdAt: order.created_at,
      items,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Order creation failed" });
  } finally {
    client.release();
  }
});

router.get("/", protect, async (req, res) => {
  const orders = await pool.query(
    `SELECT id, total_amount, status, shipping_address, created_at
     FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [req.user.id]
  );

  const result = [];
  for (const order of orders.rows) {
    const items = await pool.query(
      `SELECT title, price, quantity, image FROM order_items WHERE order_id = $1`,
      [order.id]
    );
    result.push({
      _id: String(order.id),
      totalAmount: Number(order.total_amount),
      status: order.status,
      shippingAddress: order.shipping_address,
      createdAt: order.created_at,
      items: items.rows.map((item) => ({ ...item, price: Number(item.price) })),
    });
  }
  res.json(result);
});

module.exports = router;
