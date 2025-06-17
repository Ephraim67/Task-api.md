const Student = require('../models/students');
const User = require('../models/user');

// Create a student profile linked to a logged-in user
exports.createStudent = async (req, res) => {
    try {
        console.log('req.body:', req.body);
        console.log('req.user:', req.user);

        const { name, email, phoneNumber, gender, course } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        // Check if the user exists in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if a student with the email already exists
        const existing = await Student.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Student with this email already exists' });
        }

        // Create the student
        const student = await Student.create({
            name,
            email,
            phoneNumber,
            gender,
            course,
            user: userId
        });

        res.status(201).json({
            message: 'Student created successfully',
            student
        });

    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all student records with linked user info
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate('user', 'username role') // Adjust this if 'username' or 'role' do not exist in your User schema
            .lean(); // Optional: converts mongoose documents to plain JS objects

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
