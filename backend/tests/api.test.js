
const request = require('supertest');
const { app } = require('../server');
const { 
  generateTestUserId, 
  createTestShippingAddress,
  closeServer
} = require('./helpers');
const { setupTestDatabase } = require('./setup');

// Set a longer timeout for database setup
jest.setTimeout(30000);

let testUserId;
let testProductId;

// Setup test environment before running tests
beforeAll(async () => {
  await setupTestDatabase();
  testUserId = generateTestUserId();
});

// Close server after all tests
afterAll(async () => {
  await closeServer();
});

describe('API Health Check', () => {
  test('GET /api/health should return 200 and connected status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toContain('Connected to MySQL database');
  });
});

describe('Products API', () => {
  test('GET /api/products should return a list of products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Save a product ID for later tests
    if (response.body.length > 0) {
      testProductId = response.body[0].id;
    }
  });
  
  test('GET /api/products/:id should return a single product', async () => {
    if (!testProductId) {
      // If no products were returned in the previous test, skip this test
      console.log('Skipping product detail test - no products found');
      return;
    }
    
    const response = await request(app).get(`/api/products/${testProductId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testProductId);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('price');
  });
  
  test('GET /api/products/:id with invalid ID should return 404', async () => {
    const response = await request(app).get('/api/products/999999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Product not found');
  });
});

describe('Cart API', () => {
  test('GET /api/cart/:userId should return an empty cart initially', async () => {
    const response = await request(app).get(`/api/cart/${testUserId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
  
  test('POST /api/cart should add an item to the cart', async () => {
    if (!testProductId) {
      console.log('Skipping cart add test - no products found');
      return;
    }
    
    const response = await request(app)
      .post('/api/cart')
      .send({
        user_id: testUserId,
        product_id: testProductId,
        quantity: 2,
        size: 'L',
        color: 'Black'
      });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Added to cart');
    expect(response.body).toHaveProperty('id');
    
    // Store the cart item ID for the update and delete tests
    testCartItemId = response.body.id;
  });
  
  test('GET /api/cart/:userId should return items after adding', async () => {
    const response = await request(app).get(`/api/cart/${testUserId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('user_id', testUserId);
      expect(response.body[0]).toHaveProperty('product_id');
      expect(response.body[0]).toHaveProperty('quantity');
    }
  });
  
  test('PUT /api/cart/:id should update item quantity', async () => {
    if (!testCartItemId) {
      console.log('Skipping cart update test - no cart items added');
      return;
    }
    
    const response = await request(app)
      .put(`/api/cart/${testCartItemId}`)
      .send({
        quantity: 3
      });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Cart updated');
  });
  
  test('DELETE /api/cart/:id should remove an item from the cart', async () => {
    if (!testCartItemId) {
      console.log('Skipping cart delete test - no cart items added');
      return;
    }
    
    const response = await request(app).delete(`/api/cart/${testCartItemId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Item removed from cart');
  });
});

describe('Orders API', () => {
  let testOrderId;
  
  test('POST /api/orders should create a new order', async () => {
    if (!testProductId) {
      console.log('Skipping order creation test - no products found');
      return;
    }
    
    // First add an item to the cart
    await request(app)
      .post('/api/cart')
      .send({
        user_id: testUserId,
        product_id: testProductId,
        quantity: 1,
        size: 'M',
        color: 'Blue'
      });
      
    // Get cart items for order creation
    const cartResponse = await request(app).get(`/api/cart/${testUserId}`);
    const cartItems = cartResponse.body;
    
    // Create the order
    const response = await request(app)
      .post('/api/orders')
      .send({
        user_id: testUserId,
        items: cartItems,
        shipping_address: createTestShippingAddress(),
        payment_method: 'credit_card',
        total: 149.90,
        subtotal: 129.90,
        shipping: 20.00
      });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('order_id');
    testOrderId = response.body.order_id;
  });
  
  test('GET /api/orders/:id should retrieve an order', async () => {
    if (!testOrderId) {
      console.log('Skipping order retrieval test - no order created');
      return;
    }
    
    const response = await request(app).get(`/api/orders/${testOrderId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testOrderId);
    expect(response.body).toHaveProperty('user_id', testUserId);
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body).toHaveProperty('shipping_address');
    expect(response.body).toHaveProperty('payment_method');
    expect(response.body).toHaveProperty('status');
  });
  
  test('PUT /api/orders/:id/payment should update payment status', async () => {
    if (!testOrderId) {
      console.log('Skipping payment status update test - no order created');
      return;
    }
    
    const response = await request(app)
      .put(`/api/orders/${testOrderId}/payment`)
      .send({
        payment_status: 'paid'
      });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Payment status updated');
  });
});

describe('Schema update API', () => {
  test('GET /api/update-schema should return success message', async () => {
    const response = await request(app).get('/api/update-schema');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    // The message could vary based on whether columns need to be added
    expect(response.body).toHaveProperty('message');
  });
});
