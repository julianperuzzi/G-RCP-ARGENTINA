// server.js
const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

// Crear la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const connection = mysql.createPool(process.env.MYSQL_URL);

// Conectar a la base de datos
connection.getConnection((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Middleware para procesar JSON
app.use(express.json());

// Importar y usar las rutas
const courseRoutes = require('./src/routes/courseRoutes');
const userRoutes = require('./src/routes/userRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');

app.use('/courses', courseRoutes);
app.use('/users', userRoutes);
app.use('/purchases', purchaseRoutes);

// Endpoint de prueba de conexión
app.get('/test-db', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).send('Error connecting to the database');
    }
    res.send(`Database connection successful. The solution is: ${results[0].solution}`);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
