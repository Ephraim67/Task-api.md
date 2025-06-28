const express = require('express');
const router = express.Router();
const authController = require('../controller/adminController');
const quizSubmissionController = require('../controller/quizSubmissionController');
const { validateQuizUpload } = require('../middlewares/validateQuiz');
const { authenticateAdmin } = require('../middlewares/authMiddleware');
const handleValidation = require('../middlewares/handleValidation');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *   - name: Course
 *   - name: Quizzes
 *   - name: Students
 */

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
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: adminpass
 *     responses:
 *       200:
 *         description: Successful login returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v1/admin:
 *   post:
 *     summary: Create a new course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *       409:
 *         description: Course already exists
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateAdmin, quizSubmissionController.createCourse);

/**
 * @swagger
 * /api/v1/admin:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateAdmin, quizSubmissionController.getAllStudents);

/**
 * @swagger
 * /api/v1/admin/course-catalogue:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/course-catalogue', authenticateAdmin, quizSubmissionController.getCourses);

/**
 * @swagger
 * /api/v1/admin/course-catalogue/{courseCode}:
 *   put:
 *     summary: Update a course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseCode
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
 *               courseName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated
 *       404:
 *         description: Course not found
 */
router.put('/course-catalogue/:courseCode', authenticateAdmin, quizSubmissionController.updateCourse);

/**
 * @swagger
 * /api/v1/admin/course-catalogue/{courseCode}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted
 *       404:
 *         description: Course not found
 */
router.delete('/course-catalogue/:courseCode', authenticateAdmin, quizSubmissionController.deleteCourse);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *         description: Quiz answers revealed
 *       404:
 *         description: Quiz or course not found
 */
router.patch(
  '/:courseCode/:quizId/reveal',
  authenticateAdmin,
  quizSubmissionController.revealQuizAnswers
);

module.exports = router;
