// testConnection.js
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection(process.env.MYSQL_URL);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    console.log(`Database connection successful. The solution is: ${results[0].solution}`);
  });
});
