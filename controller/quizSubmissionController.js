const { Course, Student } = require('../models');

exports.submitQuiz = async (req, res) => {
    try {
        const { courseCode, quizId } = req.params;
        const { studentId, answers } = req.body;

        // Validate input
        if (!studentId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Student ID and answers are required.' });
        }

        // Find course and student
        const [course, Student] = await Promise.all([
            Course.findOne({ where: { courseCode } }),
            Student.findOne({ where: { id: studentId } })
        ]);

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        if (!Student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Find the quiz within the course
        const quiz = course.quizes.find(q => q.id === quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }

        // Check if the quiz is already submitted by the student
        if (student.quizSubmissions[quizId]) {
            return res.status(400).json({ message: 'Quiz already submitted' });
        }


        // Calcalate the score based on answers
        const score = calcalateScore(answers, quiz.questions);

        // Store the submission wihtout grading them yet
        student.quizSubmissions = {
            ...student.quizSubmissions,
            [quizId]: {
                answers,
                submittedAt: new Date(),
                graded: true, // Mark as graded
                score, // Store the score
                correctAnswers: quiz.questions.map(q => q.correctAnswer) // Store correct answers
            }
        };

        await student.save();

        // Return result immediately
        res.status(200).json({
            message: 'Quiz submitted successfully.',
            success: true,
            quizId,
            studentId,
            score,
            totalPoints: quiz.totalPoints || quiz.questions.length,
            // correctAnswers: quiz.questions.map(q => q.correctAnswer)
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: 'Failed to submit quiz', success: false, error: error.message });
    }
}


exports.getQuizResults = async (req, res) => {
    try {
        const { courseCode, quizId, studentId } = req.params;

        const [ course, student ] = await Promise.all([
            Course.findOne({ where: { courseCode } }),
            Student.findOne({ where: { id: studentId } })
        ]);

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        const quiz = course.quizzes.find(q => q.id === quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }

        const submission = student.quizSubmissions[quizId];
        if (!submission) {
            return res.status(404).json({ message: 'Quiz not submitted yet' });
        }

        // Always return the submission with the score and correct answers
        const response = {
            quizTitle: quiz.quiztitle,
            yourAnswers: submission.answers,
            score: submission.score,
            totalPoints: quiz.totalPoints,
            submittedAt: submission.submittedAt,
            graded: true, // Always return graded as true
        };

        // Only show correct answeres if the quiz is set to reveal answers if admin set it
        if (quiz.revealAnswers || req.user.role === 'admin') {
            response.correctAnswers = quiz.questions.map(q => q.correctAnswer);
        }

        res.status(200).json({response});
    } catch (error) {
        console.error('Error retrieving quiz results:', error);
        res.status(500).json({ message: 'Failed to retrieve quiz results', success: false, error: error.message });
    }
};

function calcalateScore(answers, questions) {
    return answers.reduce((score, answer, index) => {
        return score + (answer === questions[index].correctAnswer ? questions[index].points : 0);
    }, 0);
}