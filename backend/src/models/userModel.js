// src/models/userModel.js
const db = require('../config');

const getAllUsers = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

const createUser = async (user) => {
  const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [user.name, user.email, user.password]);
  return result.insertId;
};

const updateUser = async (id, user) => {
  await db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [user.name, user.email, user.password, id]);
};

const deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
