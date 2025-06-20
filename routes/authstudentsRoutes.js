const express = require('express');
const router = express.Router();
const authStudentsController = require('../controller/authStudentsController');
const { check } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student authentication routes
 */

/**
 * @swagger
 * /students/signup:
 *   post:
 *     summary: Register a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentSignup'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully.
 *       422:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post(
    '/signup',
    [
        check('fullname').notEmpty().withMessage('Fullname is required'),
        check('email').isEmail().withMessage('Valid email is required'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        check('confirmPassword').notEmpty().withMessage('Please confirm your password'),
        check('phoneNumber').notEmpty().withMessage('Phone number is required'),
        check('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
        check('course').notEmpty().withMessage('Course is required')
    ],
    authStudentsController.studentSignup
);


/**
 * @swagger
 * /students/login:
 *   post:
 *     summary: Login as a student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router.post(
    '/login',
    [
        check('email').isEmail().withMessage('Valid email is required'),
        check('password').notEmpty().withMessage('Password is required')
    ],
    authStudentsController.studentLogin
);

module.exports = router;
