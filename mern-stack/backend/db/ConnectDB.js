const mysql = require("mysql2/promise");

const ConnectDB = async () => {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || "mysql-db",
    user: process.env.DB_USER || "mernuser",
    password: process.env.DB_PASSWORD || "mernpassword",
    database: process.env.DB_DATABASE || "mernappdb",
    waitForConnections: process.env.DB_WAITFORCONNECTIONS === "true",
    connectionLimit: parseInt(process.env.DB_CONNECTIONLIMIT) || 10,
    queueLimit: parseInt(process.env.DB_QUEUELIMIT) || 0,
  });

  // Create table if it doesn't exist
  await pool.query(
    `CREATE TABLE IF NOT EXISTS \`${process.env.DB_TABLENAME}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  );

  console.log(`${process.env.DB_TABLENAME} table created or already exists.`);

  return pool;
};

module.exports = ConnectDB;
