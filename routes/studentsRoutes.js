// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentContoller');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Apply auth middleware to routes that need it
router.post('/', authMiddleware, studentController.createStudent);
router.get('/', authMiddleware, studentController.getAllStudents);

module.exports = router;
