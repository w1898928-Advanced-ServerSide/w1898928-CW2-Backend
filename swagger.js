const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js'];

const config = {
  info: {
    title: 'Blog API Documentation',
    description: 'API for managing blog posts, users, and reactions',
  },
  host: 'localhost:4000',
    schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, config).then(() => {
  console.log('Swagger documentation generated successfully.');
});