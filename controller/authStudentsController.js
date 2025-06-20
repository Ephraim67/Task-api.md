const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/students');
const { validationResult } = require('express-validator');

exports.studentSignup = async (req, res) => {
    const { fullname, email, password, confirmPassword, phoneNumber, gender, course } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }

    if (password !== confirmPassword) {
        return res.status(422).json({ error: "Passwords do not match." });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            fullname,
            email,
            password: hashedPassword,
            phoneNumber,
            gender,
            course,
            isVerified: false
        });

        await user.save();

        return res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
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

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
