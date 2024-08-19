// src/db.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool(process.env.MYSQL_URL);

const getUserProfile = (userId) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE auth0_id = ?', [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

const updateUserProfile = (userId, profileData) => {
  return new Promise((resolve, reject) => {
    pool.query('UPDATE users SET ? WHERE auth0_id = ?', [profileData, userId], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = { getUserProfile, updateUserProfile };
