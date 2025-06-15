const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task API',
      version: '1.0.0',
      description: 'Task Base API for Webdeves Students.',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Change to your deployed Render base URL when live
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
      },
    },
  },
  apis: ['./routes/*.js'], // Swagger will scan these files for JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
