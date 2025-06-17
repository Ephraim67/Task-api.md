const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    id: String,
    quiztitle: String,
    questions: Array,
    dueDate: Date,
    totalPoints: Number,
    revealedAnswers: { type: Boolean, default: false }
}, { _id: false });

const courseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    quizzes: [quizSchema],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);
