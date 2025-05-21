
const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Test database connection
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const connection = await req.app.locals.pool.getConnection();
    connection.release();
    res.json({ status: 'Connected to MySQL database' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'Database connection failed', error: error.message });
  }
});

module.exports = router;
