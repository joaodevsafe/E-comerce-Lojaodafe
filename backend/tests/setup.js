
const { spawn } = require('child_process');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.test' });

async function setupTestDatabase() {
  // Create a connection to MySQL without specifying a database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  // Drop and recreate the test database
  await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}_test`);
  await connection.query(`CREATE DATABASE ${process.env.DB_NAME}_test`);
  
  console.log(`Test database ${process.env.DB_NAME}_test created`);
  
  // Close the connection
  await connection.end();
  
  // Run the setup SQL script to create tables in the test database
  console.log('Setting up test database schema...');
  return new Promise((resolve, reject) => {
    const mysql = spawn('mysql', [
      `-h${process.env.DB_HOST || 'localhost'}`,
      `-u${process.env.DB_USER || 'root'}`,
      process.env.DB_PASSWORD ? `-p${process.env.DB_PASSWORD}` : '',
      `${process.env.DB_NAME}_test`,
      '<', 
      './tests/test-setup.sql'
    ], { shell: true });
    
    mysql.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    mysql.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    mysql.on('close', (code) => {
      if (code === 0) {
        console.log('Test database setup completed successfully');
        resolve();
      } else {
        console.error(`Test database setup failed with code ${code}`);
        reject(new Error(`Database setup failed with code ${code}`));
      }
    });
  });
}

module.exports = { setupTestDatabase };
