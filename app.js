// Load environment variables FIRST, before any other imports
require('dotenv').config();

// Now import other modules
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const studentRoutes = require('./routes/studentsRoutes'); 

// login route
const adminRoutes = require('./routes/auth');


const app = express();

// Add debugging to verify the env var is still available here
console.log('MONGO_URI in main app:', process.env.MONGO_URI ? 'EXISTS' : 'UNDEFINED');

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Mount your login route at /api/admin
app.use('/api/admin/', adminRoutes);

// Students adding route
app.use('/api/students', studentRoutes);

// Create default admin user
async function defaultUser() {
    try {
        const defaultUsername = 'admin';
        const defaultPassword = 'admin123';

        const existingUser = await User.findOne({ username: defaultUsername });

        if (!existingUser) {
            // const hashedPassword = await bcrypt.hash(defaultPassword, 10);

            await User.create({
                username: defaultUsername,
                password: defaultPassword,
                role: 'admin'
            });

            console.log(`Default user created: ${defaultUsername}`);
        } else {
            console.log(`Default user already exists: ${defaultUsername}`);
        }
    } catch (error) {
        console.error('Error creating default user:', error);
    }
}

// Wait for mongoose to connect, then create default user
mongoose.connection.once('open', async () => {
    console.log('MongoDB connected');
    await defaultUser();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// // Add these debugging lines
// console.log('=== Environment Debug ===');
// console.log('Current directory:', process.cwd());
// console.log('MONGODB_URI exists:', !!process.env.MONGO_URI);
// console.log('MONGODB_URI value:', process.env.MONGO_URI);
// console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
// console.log('========================');