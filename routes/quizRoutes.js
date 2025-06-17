const express = require('express');
const { authenticateAdmin, authenticateUser } = require('../middlewares/authMiddleware');
const quizController = require('../controller/quizController');
const router = express.Router();



/**
 * @swagger
 * /course/{courseCode}/quizzes:
 *   post:
 *     summary: Admin uploads a new quiz to a course
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Code of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quiztitle:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *               dueDate:
 *                 type: string
 *                 format: date
 *               totalPoints:
 *                 type: number
 *     responses:
 *       201:
 *         description: Quiz uploaded successfully
 */
router.post('/course/:courseCode/quizzes',
    authenticateAdmin,
    quizController.uploadQuiz
);

/**
 * @swagger
 * /course/{courseCode}/quizzes:
 *   get:
 *     summary: Get all quizzes for a specific course
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Code of the course
 *     responses:
 *       200:
 *         description: List of quizzes
 */
router.get('/course/:courseCode/quizzes',
    quizController.getCourseQuizzes
);

/**
 * @swagger
 * /course/{courseCode}/quizzes/{quizId}/reveal:
 *   put:
 *     summary: Admin reveals quiz answers
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz answers revealed
 */
router.put('/course/:courseCode/quizzes/:quizId/reveal',
    authenticateAdmin,
    quizController.revealQuizAnswers
);

/**
 * @swagger
 * /course/{courseCode}/quizzes/{quizId}/submit:
 *   post:
 *     summary: Student submits a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 */

// Add this right before line 138
console.log('🔍 Checking handlers for submit route:');
console.log('authenticateUser:', typeof authenticateUser, authenticateUser);
console.log('quizController.submitQuiz:', typeof quizController.submitQuiz, quizController.submitQuiz);

router.post('/course/:courseCode/quizzes/:quizId/submit',
    authenticateUser,
    quizController.submitQuiz
);

// router.post('/course/:courseCode/quizzes/:quizId/submit',
//     authenticateUser,
//     quizController.submitQuiz
// );

module.exports = router;
