const express = require('express');
const router = express.Router();

// Controladores para usuarios
// Estos son solo ejemplos; tendrás que reemplazarlos con la lógica real
router.get('/', (req, res) => {
  res.send('List of users');
});

router.post('/', (req, res) => {
  res.send('Create a new user');
});

module.exports = router;
