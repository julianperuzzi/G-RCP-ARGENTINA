const express = require('express');
const router = express.Router();
const pool = require('../config'); // Ajusta la importación si es necesario

// Obtener compras por ID de usuario
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM purchases WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).send('Error fetching purchases');
  }
});

// Agregar una nueva compra
router.post('/', async (req, res) => {
  const { user_id, course_id, certified } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO purchases (user_id, course_id, certified) VALUES (?, ?, ?)',
      [user_id, course_id, certified]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Error adding purchase:', err);
    res.status(500).send('Error adding purchase');
  }
});

module.exports = router;
