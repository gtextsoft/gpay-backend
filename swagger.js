import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "GVestCapital API",
    version: "1.0.0",
    description: "API documentation for GVestCapital",
  },
  servers: [
    {
      url: "https://gvestcapital-api.onrender.com",
      description: "Live server",
    },
    {
      url: "http://localhost:4000",
      description: "Local development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/userRoutes.js"], // Adjust path for live and local environments
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
