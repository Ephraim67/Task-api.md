const { Course } = require('../models/course');

// Upload quiz for a course
exports.uploadQuiz = async (req, res) => {
    try {
        const { courseCode } = req.params;
        const { quiztitle, questions, dueDate, totalPoints } = req.body;

        // Validate input
        if (!quiztitle || !questions || !dueDate || !totalPoints) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Find the course by courseCode
        const course = await Course.findOne({ where: { courseCode } });

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Create the quiz
        const newQuiz = await course.createQuiz({
            id: Date.now().toString(), // Generate a unique ID for the quiz
            quiztitle,
            questions: JSON.stringify(questions), // Store questions as a JSON string
            dueDate: dueDate || null, // Allow dueDate to be optional
            totalPoints: totalPoints || questions.lenght, // Allow totalPoints to be optional
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Add the quiz to the course's quizzes
        course.quizes = [...(course.quizes || []), newQuiz.id];
        await course.save();

        res.status(201).json({
            message: 'Quiz uploaded successfully.',
            quiz: newQuiz,
            success: true,
            courseCode
        });
    } catch (error) {
        console.error('Error uploading quiz:', error);
        res.status(500).json({ message: 'Internal server error.', success: false, error: error.message });
    }
};

// Get all quizzes for a course
exports.getCourseQuizes = async (req, res) => {
    try {
        const { courseCode } = req.params;

        const course = await Course.findOne({ where: { courseCode } });

        if (!course) {
            return res.status(404).json({ message: 'Course not found.', success: false });
        }

        res.status(200).json({
            message: 'Quizzes retrieved successfully.',
            quizzes: course.quizes || [],
            success: true,
            courseCode
        });
    } catch (error) {
        console.error('Error retrieving quizzes:', error);
        res.status(500).json({ message: 'Internal server error.', success: false, error: error.message });
    }
};

// Admin endpoint to reveal quiz answers
exports.revealQuizAnswers = async (req, res) => {
    try {
        const { courseCode, quizId } = req.params;

        const course = await Course.findOne({ where: { courseCode } });

        if (!course) return res.status(404).json({ message: 'Course not found.', success: false });

        const quizIndex = course.quizes.findIndex(q => q.id === quizId);
        if (quizIndex === -1) {
            return res.status(404).json({ message: 'Quiz not found.', success: false });
        }

        // Update the quiz to reveal answers
        course.quizes[quizIndex].revealedAnswers = true; // Assuming you have a field to track this
        await course.save();

        res.status(200).json({
            message: 'Quiz answers revealed successfully.',
            success: true,
            // courseCode,
            quizId
        });
    } catch (error) {
        console.error('Error revealing quiz answers:', error);
        res.status(500).json({ message: 'Internal server error.', success: false, error: error.message });
    }
};
