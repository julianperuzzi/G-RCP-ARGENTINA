const db = require('../config/db');

const Course = {
  create: (data, callback) => {
    const query = 'INSERT INTO courses (name, duration, price) VALUES (?, ?, ?)';
    db.query(query, [data.name, data.duration, data.price], callback);
  },
  findAll: (callback) => {
    const query = 'SELECT * FROM courses';
    db.query(query, callback);
  },
  findById: (id, callback) => {
    const query = 'SELECT * FROM courses WHERE id = ?';
    db.query(query, [id], callback);
  },
  // Agrega más métodos según lo necesites
};

module.exports = Course;
