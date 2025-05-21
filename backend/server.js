
const express = require('express');
require('dotenv').config();
const pool = require('./config/database');

// Import routes
const healthRoutes = require('./routes/health');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const schemaRoutes = require('./routes/schema');

// Import middleware
const setupCors = require('./middleware/cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Add pool to app.locals so it's accessible in route handlers
app.locals.pool = pool;

// Middleware
setupCors(app);
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/update-schema', schemaRoutes);

// Start server
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  server = app.listen(0); // Random port for testing
  console.log('Server started in test mode');
}

module.exports = { app, server, pool };
