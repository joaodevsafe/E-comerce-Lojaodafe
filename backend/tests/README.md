
# API Testing Suite

This directory contains tests for the e-commerce API endpoints.

## Setup

1. Make sure you have the required dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a test database:
   - The test suite will automatically create and populate a test database based on the `.env.test` configuration
   - Make sure you have MySQL running and accessible with the credentials in `.env.test`

## Running Tests

Run all tests:
```bash
npm test
```

Run tests with watch mode (for development):
```bash
npm run test:watch
```

Generate test coverage report:
```bash
npm run test:coverage
```

## Test Structure

- `api.test.js`: Main test file containing all API endpoint tests
- `setup.js`: Contains logic to set up the test database
- `helpers.js`: Utility functions for testing
- `test-setup.sql`: SQL script to create database schema for testing

## Endpoints Tested

- Health Check: `GET /api/health`
- Products API:
  - List products: `GET /api/products`
  - Get product: `GET /api/products/:id`
- Cart API:
  - List cart items: `GET /api/cart/:userId`
  - Add to cart: `POST /api/cart`
  - Update cart item: `PUT /api/cart/:id`
  - Remove from cart: `DELETE /api/cart/:id`
- Orders API:
  - Create order: `POST /api/orders`
  - Get order: `GET /api/orders/:id`
  - Update payment status: `PUT /api/orders/:id/payment`
- Schema Updates: `GET /api/update-schema`
