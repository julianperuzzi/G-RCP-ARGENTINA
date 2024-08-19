const express = require('express');
const app = express();
const connection = require('./config/db');

app.get('/test-db', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).send('Error connecting to the database');
    }
    res.send(`Database connection successful. The solution is: ${results[0].solution}`);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
