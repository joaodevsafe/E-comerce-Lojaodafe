
const express = require('express');
const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Public
 */
router.post('/', async (req, res) => {
  const { user_id, items, shipping_address, payment_method, total, subtotal, shipping } = req.body;
  
  try {
    const connection = await req.app.locals.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create order with payment status
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, shipping_address, payment_method, total, subtotal, shipping, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, JSON.stringify(shipping_address), payment_method, total, subtotal, shipping, 'pending', 'awaiting_payment']
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

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    // Get order details
    const [orderRows] = await req.app.locals.pool.query(
      `SELECT * FROM orders WHERE id = ?`,
      [req.params.id]
    );
    
    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderRows[0];
    
    // Get order items with product details
    const [itemRows] = await req.app.locals.pool.query(
      `SELECT oi.*, p.name 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    
    // Parse shipping address from JSON string
    order.shipping_address = JSON.parse(order.shipping_address);
    
    // Add items to order
    order.items = itemRows;
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /api/orders/:id/payment
 * @desc    Update payment status
 * @access  Public
 */
router.put('/:id/payment', async (req, res) => {
  const { payment_status } = req.body;
  
  try {
    await req.app.locals.pool.query(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [payment_status, req.params.id]
    );
    res.json({ success: true, message: 'Payment status updated' });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
