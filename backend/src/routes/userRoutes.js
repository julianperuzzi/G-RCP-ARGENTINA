const express = require('express');
const router = express.Router();
const pool = require('../config'); // Asegúrate de que pool esté correctamente importado y configurado
const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Ruta para obtener el perfil (requiere autenticación)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id; // Obtener el userId del query params o del token
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ruta para actualizar el perfil (requiere autenticación)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, location, age, dni } = req.body; // Obtener los datos del cuerpo de la solicitud
    const userId = req.user.id; // Obtener el userId del token
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const result = await pool.query(
      'UPDATE users SET name = ?, phone = ?, location = ?, age = ?, dni = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, phone, location, age, dni, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
