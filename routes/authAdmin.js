const express = require('express');
const router = express.Router();
const authController = require('../controller/adminController');
const quizSubmissionController = require('../controller/quizSubmissionController');
const { validateQuizUpload } = require('../middlewares/validateQuiz');
const { authenticateAdmin } = require('../middlewares/authMiddleware')
const handleValidation = require('../middlewares/handleValidation');

/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Login user or admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: test
 *               password:
 *                 type: string
 *                 example: test
 *     responses:
 *       200:
 *         description: Successful login returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v1/admin/:
 *   post:
 *     summary: Upload a new course
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The course code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quiztitle
 *               - questions
 *             properties:
 *               quiztitle:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               totalPoints:
 *                 type: integer
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionText
 *                     - options
 *                     - correctAnswer
 *                   properties:
 *                     questionText:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctAnswer:
 *                       type: string
 *     responses:
 *       201:
 *         description: Quiz uploaded successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateAdmin, quizSubmissionController.createCourse)


/**
 * @swagger
 * /api/v1/admin/{courseCode}/upload:
 *   post:
 *     summary: Upload a new quiz to a course
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The course code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quiztitle
 *               - questions
 *             properties:
 *               quiztitle:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               totalPoints:
 *                 type: integer
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionText
 *                     - options
 *                     - correctAnswer
 *                   properties:
 *                     questionText:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctAnswer:
 *                       type: string
 *     responses:
 *       201:
 *         description: Quiz uploaded successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/:courseCode/upload',
  authenticateAdmin,
  validateQuizUpload,
  handleValidation,
  quizSubmissionController.uploadQuiz
);


/**
 * @swagger
 * /api/v1/admin/{courseCode}/{quizId}/reveal:
 *   patch:
 *     summary: Reveal quiz answers (admin only)
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
 *         description: Answers revealed
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:courseCode/:quizId/reveal',
  authenticateAdmin,
  quizSubmissionController.revealQuizAnswers
);


module.exports = router;