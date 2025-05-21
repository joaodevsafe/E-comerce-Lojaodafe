
const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/update-schema
 * @desc    Update database schema
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const connection = await req.app.locals.pool.getConnection();
    try {
      // Check if columns exist
      const [paymentStatusColumns] = await connection.query('SHOW COLUMNS FROM orders LIKE "payment_status"');
      const [paymentIntentColumns] = await connection.query('SHOW COLUMNS FROM orders LIKE "payment_intent_id"');
      
      let updatedSchema = false;
      
      if (paymentStatusColumns.length === 0) {
        // Add payment_status and payment_proof_url columns if they don't exist
        await connection.query(`
          ALTER TABLE orders 
          ADD COLUMN payment_status VARCHAR(30) NOT NULL DEFAULT 'awaiting_payment' AFTER status,
          ADD COLUMN payment_proof_url VARCHAR(255) NULL AFTER payment_status
        `);
        updatedSchema = true;
      }
      
      if (paymentIntentColumns.length === 0) {
        // Add payment_intent_id column if it doesn't exist
        await connection.query(`
          ALTER TABLE orders 
          ADD COLUMN payment_intent_id VARCHAR(255) NULL AFTER payment_proof_url
        `);
        updatedSchema = true;
      }
      
      if (updatedSchema) {
        res.json({ success: true, message: 'Schema updated with payment fields' });
      } else {
        res.json({ success: true, message: 'Schema already up to date' });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating schema:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
