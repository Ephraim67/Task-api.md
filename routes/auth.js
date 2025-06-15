const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// User/Admin login
router.post('/login', authController.login);

module.exports = router;