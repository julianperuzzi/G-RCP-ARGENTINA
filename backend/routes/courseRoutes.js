const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/courses', courseController.createCourse);
router.get('/courses', courseController.getAllCourses);
// Agrega más rutas según lo necesites

module.exports = router;
