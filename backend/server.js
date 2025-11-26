import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import salasRoutes from "./routes/salas.js";
import usuariosRoutes from "./routes/usuarios.js";
import sensoresRoutes from "./routes/sensores.js";
import capturaRoutes from "./routes/captura.js";
import alertasRoutes from "./routes/alertas.js";

import "./mqtt/client.js"; // inicia MQTT automaticamente
import { swaggerUi, swaggerSpec } from "./swagger.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas principais
app.use("/auth", authRoutes);
app.use("/salas", salasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/sensores", sensoresRoutes);
app.use("/captura", capturaRoutes);
app.use("/alertas", alertasRoutes);

//Porta
const PORT = process.env.PORT || 5000;

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🍃 MongoDB conectado!");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => console.log("Erro ao conectar MongoDB:", err));
