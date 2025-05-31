const mysql = require('mysql2/promise');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const ConnectDB = async () => {
  let pool;

  for (let i = 0; i < 10; i++) {  // Try max 10 times
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST || "mysql-db",
        user: process.env.DB_USER || "mernuser",
        password: process.env.DB_PASSWORD || "mernpassword",
        database: process.env.DB_DATABASE || "mernappdb",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      
      // Test connection
      await pool.query('SELECT 1');
      
      console.log('Connected to MySQL!');
      break;  // Success, exit loop

    } catch (err) {
      console.log(`MySQL connection failed, retrying in 3 seconds... (${i + 1}/10)`);
      await wait(3000);
    }
  }

  if (!pool) {
    throw new Error('Unable to connect to MySQL after multiple retries');
  }

  // Create table if not exists
  await pool.query(
    `CREATE TABLE IF NOT EXISTS \`${process.env.DB_TABLENAME}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  );

  console.log(`Table '${process.env.DB_TABLENAME}' is ready.`);
  return pool;
};

module.exports = ConnectDB;
