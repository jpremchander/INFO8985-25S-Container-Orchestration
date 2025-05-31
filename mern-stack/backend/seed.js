// backend/seed.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql-db',
  user: process.env.DB_USER || 'mernuser',
  password: process.env.DB_PASSWORD || 'mernpassword',
  database: process.env.DB_NAME || 'mernappdb',
});

const seedData = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255)
    );
  `;

  const insertDataQuery = `
    INSERT INTO users (name, email)
    SELECT * FROM (SELECT 'John Doe', 'john@example.com') AS tmp
    WHERE NOT EXISTS (
      SELECT email FROM users WHERE email = 'john@example.com'
    ) LIMIT 1;
  `;

  connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL for seeding.');

    connection.query(createTableQuery, err => {
      if (err) throw err;
      connection.query(insertDataQuery, err => {
        if (err) throw err;
        console.log('Seed data inserted!');
        connection.end();
      });
    });
  });
};

seedData();
