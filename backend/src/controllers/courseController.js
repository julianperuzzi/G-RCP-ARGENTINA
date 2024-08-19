// src/controllers/courseController.js
const courseModel = require('../models/courseModel');

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseModel.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).send('Error fetching courses');
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseModel.getCourseById(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).send('Course not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching course');
  }
};

const createCourse = async (req, res) => {
  try {
    const courseId = await courseModel.createCourse(req.body);
    res.status(201).json({ id: courseId });
  } catch (error) {
    res.status(500).send('Error creating course');
  }
};

const updateCourse = async (req, res) => {
  try {
    await courseModel.updateCourse(req.params.id, req.body);
    res.send('Course updated successfully');
  } catch (error) {
    res.status(500).send('Error updating course');
  }
};

const deleteCourse = async (req, res) => {
  try {
    await courseModel.deleteCourse(req.params.id);
    res.send('Course deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting course');
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
