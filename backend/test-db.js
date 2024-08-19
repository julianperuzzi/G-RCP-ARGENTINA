const mysql = require('mysql2');
require('dotenv').config();

// Configura la conexión a la base de datos
const connection = mysql.createConnection(process.env.MYSQL_URL);

// Conecta a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');

  // Realiza una consulta de prueba
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    console.log(`The solution is: ${results[0].solution}`);
    connection.end(); // Cierra la conexión
  });
});
