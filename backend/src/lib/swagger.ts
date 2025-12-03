import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "URL Shortener API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
};

export const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
