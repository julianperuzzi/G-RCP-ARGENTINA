const express = require('express');
const router = express.Router();

// Controladores para compras
// Estos son solo ejemplos; tendrás que reemplazarlos con la lógica real
router.get('/', (req, res) => {
  res.send('List of purchases');
});

router.post('/', (req, res) => {
  res.send('Create a new purchase');
});

module.exports = router;
