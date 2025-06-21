const mongoose = require('mongoose');
// const { options } = require('../routes/authstudentsRoutes');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: {
        type: [String],
        required: true,
        validate: [arr => arr.length >= 2, 'At least 2 options are required']
    },

    correctAnswer: { type: String, required: true },
    points: { type: Number, default: 1 }
}, { _id: false });



const quizSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => Date.now().toString()
  },
  quiztitle: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
  dueDate: { type: Date },
  totalPoints: { type: Number },
  revealedAnswers: { type: Boolean, default: false }
}, { _id: false });


const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  quizzes: [quizSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
