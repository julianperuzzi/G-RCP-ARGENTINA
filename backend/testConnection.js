const connection = require('./config/db');

connection.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) {
    console.error('Error executing query:', err.stack);
    return;
  }
  console.log('The solution is: ', results[0].solution);
  connection.end(); // Cierra la conexión después de la prueba
});
