const express = require('express');
const router = express.Router();
const quizSubmissionController = require('../controller/quizSubmissionController');

const { authenticateUser } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management for students and admins
 */


/**
 * @swagger
 * /api/v1/quizroute/course-catalogue:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/course-catalogue', (req, res, next) => {
  console.log('✅ GET /api/v1/students/course-catalogue called');
  next();
}, quizSubmissionController.getCourses);



/**
 * @swagger
 * /api/v1/quiz/{courseCode}/quizzes:
 *   get:
 *     summary: Get all quizzes for a course
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The course code
 *     responses:
 *       200:
 *         description: List of quizzes
 *       404:
 *         description: Course not found
 */

router.get('/:courseCode/quizzes', quizSubmissionController.getCourseQuizzes);

/**
 * @swagger
 * /api/v1/quiz/{courseCode}/{quizId}/submit:
 *   post:
 *     summary: Submit a quiz as a student
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
 *             required:
 *               - studentId
 *               - answers
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
 *       400:
 *         description: Invalid input or already submitted
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/:courseCode/:quizId/submit',
  authenticateUser,
  quizSubmissionController.submitQuiz
);


/**
 * @swagger
 * /api/v1/quiz/{courseCode}/{quizId}/{studentId}/results:
 *   get:
 *     summary: Get quiz result for a student
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
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz result retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.get(
  '/:courseCode/:quizId/:studentId/results',
  authenticateUser,
  quizSubmissionController.getQuizResults
);

module.exports = router;
