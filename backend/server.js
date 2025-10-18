import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import sensorRoutes from "./routes/sensores.js";
import salaRoutes from "./routes/salas.js";
import alertaRoutes from "./routes/alertas.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/sensores", sensorRoutes);
app.use("/api/salas", salaRoutes);
app.use("/api/alertas", alertaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
