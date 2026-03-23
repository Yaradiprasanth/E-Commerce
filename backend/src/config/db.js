const { Pool } = require("pg");

const normalizedConnectionString = (process.env.DATABASE_URL || "").replace(
  "channel_binding=require",
  "channel_binding=prefer"
);

const pool = new Pool({
  connectionString: normalizedConnectionString,
  ssl: { rejectUnauthorized: false },
  enableChannelBinding: false,
});

const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("PostgreSQL connection failed.");
    console.error("Message:", error?.message || "No message provided");
    if (error?.code) console.error("Code:", error.code);
    if (error?.detail) console.error("Detail:", error.detail);
    if (error?.cause?.message) console.error("Cause:", error.cause.message);
    process.exit(1);
  }
};

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      image TEXT NOT NULL,
      rating NUMERIC(2,1) DEFAULT 4.2,
      stock INTEGER DEFAULT 10,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1,
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      total_amount NUMERIC(10,2) NOT NULL,
      status TEXT DEFAULT 'pending',
      shipping_address TEXT NOT NULL,
      payment_method TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      quantity INTEGER NOT NULL,
      image TEXT NOT NULL
    );
  `);

  // For existing databases, ensure new column exists.
  await pool.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_method TEXT
  `);
};

module.exports = { pool, connectDB, initDB };
