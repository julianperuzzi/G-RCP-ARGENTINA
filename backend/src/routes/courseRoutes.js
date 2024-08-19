// src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config');

// Obtener todos los cursos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM courses');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).send('Error fetching courses');
  }
});

// Obtener un curso por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Course not found');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).send('Error fetching course');
  }
});

module.exports = router;
