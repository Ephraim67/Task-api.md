const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/admin'); 

exports.login = async (req, res) => {
    console.log('Request body', req.body);

    try {
        const { username, password } = req.body;

        
        const user = await User.findOne({ username }); 
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }

        
        const tokenPayload = {
            id: user._id,
            role: user.role,
            
        };

        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        
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