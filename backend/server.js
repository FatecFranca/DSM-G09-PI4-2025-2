import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import sensorRoutes from "./routes/sensores.js";
import salaRoutes from "./routes/salas.js";
import alertaRoutes from "./routes/alertas.js";
import usuarioRoutes from "./routes/usuarios.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/sensores", sensorRoutes);
app.use("/api/salas", salaRoutes);
app.use("/api/alertas", alertaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
});

