const express = require('express');
const router = express.Router();
const pool = require('./database'); // Asegúrate de que pool esté correctamente importado y configurado

// Ruta para obtener el perfil (sin autenticación)
router.get('/profile', async (req, res) => {
  try {
    const userId = req.query.userId; // Obtener el userId del query params
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]); // Ajusta el campo de ID según tu esquema
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
router.put('/profile', async (req, res) => {
  try {
    const { userId, name, phone, location, age, dni } = req.body; // Obtener el userId del cuerpo de la solicitud
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const result = await pool.query(
      'UPDATE users SET name = ?, phone = ?, location = ?, age = ?, dni = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, phone, location, age, dni, userId] // Ajusta el campo de ID según tu esquema
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
