
const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/cart/:userId
 * @desc    Get cart items for a user
 * @access  Public
 */
router.get('/:userId', async (req, res) => {
  try {
    const [rows] = await req.app.locals.pool.query(
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

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Public
 */
router.post('/', async (req, res) => {
  const { user_id, product_id, quantity, size, color } = req.body;
  
  try {
    // Check if the item already exists in cart
    const [existingItems] = await req.app.locals.pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ? AND color = ?', 
      [user_id, product_id, size, color]
    );
    
    if (existingItems.length > 0) {
      // Update quantity if item exists
      await req.app.locals.pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existingItems[0].id]
      );
      res.json({ success: true, message: 'Cart updated', id: existingItems[0].id });
    } else {
      // Insert new item
      const [result] = await req.app.locals.pool.query(
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

/**
 * @route   PUT /api/cart/:id
 * @desc    Update cart item
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  const { quantity } = req.body;
  
  try {
    await req.app.locals.pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.id]);
    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   DELETE /api/cart/:id
 * @desc    Remove item from cart
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    await req.app.locals.pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
