const { body } = require('express-validator');

exports.validateQuizUpload = [
    body('quiztitle').notEmpty().withMessage('Quiz title is required.'),

    body('questions').isArray({ min: 1}).withMessage('Questions must be a non-empty array'),

    body('questions.*.questionText').notEmpty().withMessage('Eac question must have text.'),

    body('questions.*.options').isArray().withMessage('Each question must have at least 2 options'),

    body('questions.*.correctAnswer').notEmpty().withMessage('Each question must have a correct answer'),

    body('dueDate').optional().isISO8601().toDate().withMessage('Due date must be a valid ISO date'),

    body('totalPoints').optional().isInt({ min: 1}).withMessage('Total points must be a positive integer'),
];