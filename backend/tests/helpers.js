
const request = require('supertest');
const { app, server } = require('../server');

/**
 * Generate a random string for test user IDs
 */
function generateTestUserId() {
  return 'test_user_' + Math.random().toString(36).substring(2, 15);
}

/**
 * Create a test product in the database
 */
async function createTestProduct(name = 'Test Product', price = 99.99) {
  const response = await request(app)
    .post('/api/products')
    .send({
      name,
      description: 'Test product description',
      price,
      category: 'test',
      image_url: '/images/test.jpg'
    });
  
  return response.body;
}

/**
 * Add a test item to the cart
 */
async function addTestItemToCart(userId, productId, quantity = 1, size = 'M', color = 'Blue') {
  const response = await request(app)
    .post('/api/cart')
    .send({
      user_id: userId,
      product_id: productId,
      quantity,
      size,
      color
    });
  
  return response.body;
}

/**
 * Create a test shipping address object
 */
function createTestShippingAddress() {
  return {
    fullName: 'Test User',
    street: 'Test Street',
    number: '123',
    complement: 'Apt 456',
    neighborhood: 'Test Neighborhood',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345-678',
    phone: '(11) 98765-4321'
  };
}

/**
 * Close the server after all tests are done
 */
function closeServer() {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
}

module.exports = {
  generateTestUserId,
  createTestProduct,
  addTestItemToCart,
  createTestShippingAddress,
  closeServer
};
