const express = require('express');
const router = express.Router();
// Load User model
const User = require('../models/User');
const { forwardAuthenticated, authCheck } = require('../config/auth');
const { register, login, remove, get, update } = require('../controllers/users');

// Register
router.post('/', authCheck, register);

// Login
router.post('/login', login);

// Get user
router.get('/', authCheck, get);

// Edit user
router.put('/:id', authCheck, update);

// Delete
router.delete('/:id', authCheck, remove);

module.exports = router;
