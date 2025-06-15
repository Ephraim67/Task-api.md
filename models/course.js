const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        // allowNull: false
        autoIncrement: true
    },
    courseCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quizzes: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'courses'
});

// Define associations if needed
Course.belongsToMany(require('./Student'), { through: 'CourseStudents', foreignKey: 'courseId' });

module.exports = Course;