const Course = require('../models/courseModel');

exports.createCourse = (req, res) => {
  const newCourse = {
    name: req.body.name,
    duration: req.body.duration,
    price: req.body.price,
  };

  Course.create(newCourse, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Curso creado con éxito', courseId: result.insertId });
  });
};

exports.getAllCourses = (req, res) => {
  Course.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Agrega más controladores según lo necesites
