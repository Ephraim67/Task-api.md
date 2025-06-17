const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task API',
      version: '1.0.0',
      description: 'Task-based API for Webdeves Students.',
    },
    servers: [
      {
        url: 'https://webdeves-students-api.onrender.com/api-docs',
      },
    ],
    components: {
      schemas: {
        Student: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '665f3d2f8a3d4f001a2c6c4d',
            },
            name: {
              type: 'string',
              example: 'Ephraim Norbert',
            },
            email: {
              type: 'string',
              example: 'test@webdeves.com',
            },
            phoneNumber: {
              type: 'string',
              example: '08123456789',
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              example: 'female',
            },
            course: {
              type: 'string',
              example: 'Cybersecurity',
            },
            user: {
              type: 'string',
              description: 'MongoDB ObjectId of the associated user',
              example: '665f3d2f8a3d4f001a2c6c4c',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-06-14T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-06-14T12:30:00.000Z',
            },
          },
        },
        Quiz: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'quiz-12345',
            },
            quiztitle: {
              type: 'string',
              example: 'Intro to Cybersecurity',
            },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  questionText: {
                    type: 'string',
                    example: 'What is a firewall?',
                  },
                  options: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['A', 'B', 'C', 'D'],
                  },
                  correctAnswer: {
                    type: 'string',
                    example: 'A',
                  },
                  points: {
                    type: 'integer',
                    example: 5,
                  },
                },
              },
            },
            dueDate: {
              type: 'string',
              format: 'date',
              example: '2025-06-30',
            },
            totalPoints: {
              type: 'integer',
              example: 20,
            },
            revealedAnswers: {
              type: 'boolean',
              example: false,
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Scan all route files for JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
