const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Student = require('../models/students')

exports.authMiddleware = async (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token - user not found.'
            });
        }

        req.user = user; // ✅ req.user is now set

        next();
    } catch (error) {
        console.error('Authentication error:', error);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};