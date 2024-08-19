// src/controllers/userController.js
const userModel = require('../models/userModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
};

const createUser = async (req, res) => {
  try {
    const userId = await userModel.createUser(req.body);
    res.status(201).json({ id: userId });
  } catch (error) {
    res.status(500).send('Error creating user');
  }
};

const updateUser = async (req, res) => {
  try {
    await userModel.updateUser(req.params.id, req.body);
    res.send('User updated successfully');
  } catch (error) {
    res.status(500).send('Error updating user');
  }
};

const deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser(req.params.id);
    res.send('User deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
