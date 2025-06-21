const jwt = require('jsonwebtoken');
// const User = require('../models/user');
const Student = require('../models/students');

const authenticateUser = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findById(decoded.id).select('-password');

        if (!student) {
            return res.status(401).json({ success: false, message: 'Invalid token - student not found.' });
        }

        req.user = student;
        req.user.role = 'student';
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

const authenticateAdmin = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await User.findById(decoded.id).select('-password');

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
        }

        req.user = admin;
        req.user.role = 'admin';
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

module.exports = { authenticateUser, authenticateAdmin };
