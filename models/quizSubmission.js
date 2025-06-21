const mongoose = require('mongoose');

// Embedded question schema
const questionSchema = new mongoose.Schema({
  questionText: { 
    type: String,
    required: true
},

options: {
    type: [String],
    required: true,
    validate: [arr => arr.length >= 2, 'At least 2 options are required']
},

  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 1 }
}, { _id: false });

// Embedded quiz schema
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

// Main Course schema
const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  description: { type: String },
  quizzes: [quizSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
