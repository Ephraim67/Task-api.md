const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Use the central models import

exports.login = async (req, res) => {
    console.log('Request body', req.body);

    try {
        const { username, password } = req.body;

        // Find user with their student profile if they're a student
        // Mongoose synthax
        const user = await User.findOne({ username }).populate('studentProfile', 'id name email'); // Populate student profile if exists
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }

        // Create token with relevant user data
        const tokenPayload = {
            id: user._id,
            role: user.role,
            // studentId: user.studentProfile?.id || null
        };

        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Prepare response data
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};