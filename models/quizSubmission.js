const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => nanoid(10)
  },
  question: { 
    type: String, 
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  optionA: { 
    type: String, 
    required: true,
    maxlength: 500 
  },
  optionB: { 
    type: String, 
    required: true,
    maxlength: 500 
  },
  optionC: { 
    type: String, 
    required: true,
    maxlength: 500 
  },
  optionD: { 
    type: String, 
    required: true,
    maxlength: 500 
  },
  answer: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D'],
    uppercase: true,
    trim: true
  },
  courseCategory: { 
    type: String, 
    required: true,
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], // example
    uppercase: true
  }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => nanoid(10) 
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0 && v.length <= 50,
      message: 'Quiz must have between 1 and 50 questions'
    }
  },
  revealedAnswers: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  courseCode: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 20
  },
  courseName: { 
    type: String, 
    required: true,
    maxlength: 100 
  },
  description: { 
    type: String,
    maxlength: 2000 
  },
  quizzes: [quizSchema]
}, {
  timestamps: true
});


courseSchema.index({ courseCode: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);