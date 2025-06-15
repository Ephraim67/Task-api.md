const Student = require('../models/students');
const User  = require('../models/user');

exports.createStudent = async (req, res) => {
    try {
        console.log('req.body:', req.body);
        console.log('req.user:', req.user);


        const { name, email, phoneNumber, gender, course } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(400).json({ message: 'user not authenticated'});
        }

        const students = await Student.create({
            name,
            email,
            phoneNumber,
            gender,
            course,
            user: userId
        });

        res.status(201).json({
            message: 'Student created successfully',
            student: students
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('user', 'username role'); // Populate user details
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};