const express = require('express');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const quizController = require('../controller/quizController');
const router = express.Router();


// Admin upload quiz to a course
router.post('/course/:courseCode/quizzes',
    authenticateAdmin,
    quizController.uploadQuiz
);


// Anyone can get all quizzes for a course
router.get('/course/:courseCode/quizzes',
    quizController.getCourseQuizzes
);

// Admin endpoint to reveal quiz answers
router.put('/course/:courseCode/quizzes/:quizId/reveal',
    authenticateAdmin,
    quizController.revealQuizAnswers
);

// Student submit a quiz
router.post('/course/:courseCode/quizzes/:quizId/submit',
    authenticateUser, // Assuming you have a middleware to authenticate users
    quizController.submitQuiz
);

module.exports = router;