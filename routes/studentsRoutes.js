// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// if (!studentController.createStudent) {
//   console.warn('❗ createStudent handler is missing from studentController');
// }

console.log('studentController.createStudent:', studentController.createStudent);
console.log('authMiddleware:', authenticateUser);


/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */

router.post('/', authenticateUser, studentController.createStudent);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', authenticateUser, studentController.getAllStudents);

module.exports = router;
