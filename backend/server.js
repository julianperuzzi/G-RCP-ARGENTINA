const express = require('express');
const mysql = require('mysql2');
const { auth } = require('express-openid-connect');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configuración de Express OpenID Connect
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

app.use(auth(authConfig));

// Middleware para procesar JSON
app.use(express.json());

// Importar y usar las rutas
const userRoutes = require('./src/routes/userRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');
const cors = require('cors');
app.use(cors());
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/purchases', purchaseRoutes);

// Endpoint de prueba de conexión
app.get('/backend/test-db', (req, res) => {
  pool.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).send('Error connecting to the database');
    }
    res.send(`Database connection successful. The solution is: ${results[0].solution}`);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
