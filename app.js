require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const User = require('./models/admin');
const authstudentsRoutes = require('./routes/authstudentsRoutes');
const quizRoutes = require('./routes/quizRoutes'); 

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const cors = require('cors');



const authAdmin = require('./routes/authAdmin');


const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.use(cors({
  origin: "*", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

console.log('MONGO_URI in main app:', process.env.MONGO_URI ? 'EXISTS' : 'UNDEFINED');


connectDB();


app.use(express.json());


app.use('/api/v1/admin/', authAdmin);


app.use('/api/v1/students', authstudentsRoutes);


app.use('/api/v1/quizroute', quizRoutes);


app.get('/', (req, res) => {
    res.send('API is running.....')
})


async function defaultUser() {
    try {
        const defaultUsername = 'admin';
        const defaultPassword = 'admin123';

        const existingUser = await User.findOne({ username: defaultUsername });

        if (!existingUser) {
            

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


mongoose.connection.once('open', async () => {
    console.log('MongoDB connected');
    await defaultUser();
});



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