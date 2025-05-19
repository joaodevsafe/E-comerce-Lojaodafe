
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lojaodafe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'Connected to MySQL database' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'Database connection failed', error: error.message });
  }
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cart API
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.user_id, c.product_id, c.quantity, c.size, c.color,
       p.name, p.price, p.image_url
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart', async (req, res) => {
  const { user_id, product_id, quantity, size, color } = req.body;
  
  try {
    // Check if the item already exists in cart
    const [existingItems] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ? AND color = ?', 
      [user_id, product_id, size, color]
    );
    
    if (existingItems.length > 0) {
      // Update quantity if item exists
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existingItems[0].id]
      );
      res.json({ success: true, message: 'Cart updated', id: existingItems[0].id });
    } else {
      // Insert new item
      const [result] = await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity, size, color) VALUES (?, ?, ?, ?, ?)',
        [user_id, product_id, quantity, size, color]
      );
      res.json({ success: true, message: 'Added to cart', id: result.insertId });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/cart/:id', async (req, res) => {
  const { quantity } = req.body;
  
  try {
    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.id]);
    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Orders API
app.post('/api/orders', async (req, res) => {
  const { user_id, items, shipping_address, payment_method, total } = req.body;
  
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, shipping_address, payment_method, total, status) VALUES (?, ?, ?, ?, ?)',
        [user_id, JSON.stringify(shipping_address), payment_method, total, 'pending']
      );
      
      const orderId = orderResult.insertId;
      
      // Add order items
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price, size, color) VALUES (?, ?, ?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price, item.size, item.color]
        );
      }
      
      // Clear cart
      await connection.query('DELETE FROM cart_items WHERE user_id = ?', [user_id]);
      
      await connection.commit();
      res.json({ success: true, order_id: orderId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
