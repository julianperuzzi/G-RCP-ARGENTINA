// src/config.js
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  uri: process.env.MYSQL_URL,
});

module.exports = connection.promise();
