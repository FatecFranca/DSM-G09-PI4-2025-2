import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OuvIoT API",
      version: "1.0.0",
      description: "Documentação da API do projeto OuvIoT (Sala Ambiente, Relatórios, Captura, MQTT, etc.)",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Servidor Local",
      },
      {
        url: "http://20.80.105.137:5000",
        description: "Servidor Produção (Azure VM)",
      },
    ],
  },

  apis: [
    "./routes/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
