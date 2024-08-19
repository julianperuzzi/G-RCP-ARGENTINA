// src/models/courseModel.js
const db = require('../config');

const getAllCourses = async () => {
  const [rows] = await db.query('SELECT * FROM courses');
  return rows;
};

const getCourseById = async (id) => {
  const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
  return rows[0];
};

const createCourse = async (course) => {
  const [result] = await db.query('INSERT INTO courses (title, description, duration, price) VALUES (?, ?, ?, ?)', [course.title, course.description, course.duration, course.price]);
  return result.insertId;
};

const updateCourse = async (id, course) => {
  await db.query('UPDATE courses SET title = ?, description = ?, duration = ?, price = ? WHERE id = ?', [course.title, course.description, course.duration, course.price, id]);
};

const deleteCourse = async (id) => {
  await db.query('DELETE FROM courses WHERE id = ?', [id]);
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
