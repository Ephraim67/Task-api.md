const Course = require('../models/quizSubmission');
const Student = require('../models/students');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

exports.createCourse = async (req, res) => {
  try {
    const { courseName, description } = req.body;

    if (!courseName) {
      return res.status(400).json({ message: "Course name is required" });
    }


    const codePrefix = courseName.trim().substring(0, 3).toUpperCase();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const courseCode = `${codePrefix}${randomDigits}`;

    
    const existing = await Course.findOne({ courseCode });
    if (existing) {
      return res.status(409).json({ message: "Course code already exists. Try again." });
    }

    
    const course = new Course({
      courseCode, 
      courseName,
      description
    });

    await course.save();

    res.status(201).json({ message: "Course created successfully", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.uploadQuiz = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Questions must be an array." });
    }

    // Minimal manual check (optional)
    const isValidQuestion = (q) => q.question && q.answer;
    if (!questions.every(isValidQuestion)) {
      return res.status(400).json({ error: "Each question must have 'question' and 'answer'." });
    }

    // Proceed with saving (no schema validation)
    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode },
      { $push: { quizzes: { id: nanoid(), questions } } },
      { new: true, upsert: true, validateBeforeSave: false } // Skip validation
    );

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};


exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password'); 
    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getCourses = async (req, res) => {
    console.log('✅ GET /api/v1/students/course-catalogue called');
    try {
        const courses = await Course.find();
        res.json({ courses });
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseName, description } = req.body;

        const course = await Course.findByIdAndUpdate(
            id,

            { courseName, description },

            { new: true }
        );

        if (!course) return res.status(404).json({ message: 'Course not found'});

        res.json({ message: 'Course updated successfully', course })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message})
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);

        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.getCourseQuizzes = async (req, res) => {
    try {
        const { courseCode } = req.params;
        const course = await Course.findOne({ courseCode });
        if (!course) return res.status(404).json({ message: 'Course not found.' });

        res.status(200).json({ quizzes: course.quizzes });
    } catch (error) {
        console.error('Error retrieving quizzes:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const { courseCode, quizId } = req.params;
        const { studentId, answers } = req.body;

        if (!studentId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Student ID and answers are required.' });
        }

        const [course, student] = await Promise.all([
            Course.findOne({ courseCode }),
            Student.findById(studentId)
        ]);

        if (!course) return res.status(404).json({ message: 'Course not found.' });
        if (!student) return res.status(404).json({ message: 'Student not found.' });

        const quiz = course.quizzes.find(q => q.id === quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

        // Initialize quizSubmissions if not present
        if (!student.quizSubmissions) {
            student.quizSubmissions = {};
        }

        if (student.quizSubmissions[quizId]) {
            return res.status(400).json({ message: 'Quiz already submitted.' });
        }

        const score = calculateScore(answers, quiz.questions);

        student.quizSubmissions[quizId] = {
            answers,
            submittedAt: new Date(),
            graded: true,
            score,
            correctAnswers: quiz.questions.map(q => q.correctAnswer)
        };

        await student.save();

        res.status(200).json({
            message: 'Quiz submitted successfully.',
            quizId,
            studentId,
            score,
            totalPoints: quiz.totalPoints || quiz.questions.length
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: 'Failed to submit quiz', error: error.message });
    }
};

exports.revealQuizAnswers = async (req, res) => {
    try {
        const { courseCode, quizId } = req.params;
        const course = await Course.findOne({ courseCode });
        if (!course) return res.status(404).json({ message: 'Course not found.' });

        const quiz = course.quizzes.find(q => q.id === quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

        quiz.revealedAnswers = true;
        await course.save();

        res.status(200).json({ message: 'Quiz answers revealed.', quizId });
    } catch (error) {
        console.error('Error revealing quiz answers:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};


exports.getQuizResults = async (req, res) => {
    try {
        const { courseCode, quizId, studentId } = req.params;

        const [course, student] = await Promise.all([
            Course.findOne({ courseCode }),
            Student.findById(studentId)
        ]);

        if (!course) return res.status(404).json({ message: 'Course not found.' });
        if (!student) return res.status(404).json({ message: 'Student not found.' });

        const quiz = course.quizzes.find(q => q.id === quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

        const submission = student.quizSubmissions?.[quizId];
        if (!submission) return res.status(404).json({ message: 'Quiz not submitted yet.' });

        const response = {
            quizTitle: quiz.quiztitle,
            yourAnswers: submission.answers,
            score: submission.score,
            totalPoints: quiz.totalPoints,
            submittedAt: submission.submittedAt,
            graded: true,
        };

        if (quiz.revealedAnswers || req.user?.role === 'admin') {
            response.correctAnswers = quiz.questions.map(q => q.correctAnswer);
        }

        res.status(200).json({ response });

    } catch (error) {
        console.error('Error retrieving quiz results:', error);
        res.status(500).json({ message: 'Failed to retrieve quiz results', error: error.message });
    }
};


function calculateScore(answers, questions) {
    return answers.reduce((score, answer, index) => {
        const q = questions[index];
        return score + (answer === q.correctAnswer ? (q.points || 1) : 0);
    }, 0);
}


