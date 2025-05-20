
# LOJÃO DA FÉ - E-commerce Project

## Overview

This is a complete e-commerce application with product catalog, shopping cart, checkout flow, and order management capabilities. The project consists of a React frontend and a Node.js backend with MySQL database.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, TanStack Query, Shadcn/UI
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: Local + Google OAuth

## Project Setup Guide

### 1. Set Up Database

1. Install MySQL if not already installed
2. Create a database and import the schema:
   ```bash
   mysql -u root -p < backend/setup.sql
   ```
   (or use MySQL Workbench to import the SQL file)

### 2. Configure Backend Environment

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env` file:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=lojaodafe
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The API should be running on http://localhost:5000

### 3. Configure Frontend

1. From the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application should be running on http://localhost:5173

## Features to Complete

### Critical Path Features

- [ ] Add real product images to replace placeholders
- [ ] Implement authentication system fully
- [ ] Complete checkout flow with payment integration
- [ ] Add admin panel for order management

### Nice-to-Have Features

- [ ] Implement coupon/discount system
- [ ] Add user reviews and ratings
- [ ] Create wishlist functionality
- [ ] Implement product search with filters

## Deployment Guide

### Building for Production

1. Build the frontend:
   ```bash
   npm run build
   ```
   This will create a `dist` directory with optimized production files

2. Deploy the backend to your hosting provider (Heroku, DigitalOcean, AWS, etc.)

3. Set up a production MySQL database

4. Configure environment variables on your hosting platform

## Support

For any questions or issues, please contact the project maintainer.
