import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import sensorRoutes from "./routes/sensores.js";
import salaRoutes from "./routes/salas.js";
import alertaRoutes from "./routes/alertas.js";
import usuarioRoutes from "./routes/usuarios.js";
import authRoutes from "./routes/auth.js";
import capturaRoutes from "./routes/captura.js";
import mqtt from "mqtt";

import "./mqtt/client.js";


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
app.use("/api/captura", capturaRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando em ${PORT}`);
});

// Conecta no broker MQTT da VM
const mqttClient = mqtt.connect("mqtt://20.80.105.137", {
  port: 1883,
});

// Quando conectar:
mqttClient.on("connect", () => {
  console.log("Conectado ao broker MQTT!");

  // Assinar o tópico onde o ESP publica
  mqttClient.subscribe("ouviot/captura/dados", (err) => {
    if (!err) console.log("Assinado: ouviot/captura/dados");
  });
});

// Quando chegar mensagem do ESP
mqttClient.on("message", async (topic, message) => {
  if (topic === "ouviot/captura/dados") {
    try {
      const dados = JSON.parse(message.toString());
      console.log("Dados recebidos:", dados);

      //aqui entra o MONGO ↓↓↓

      await Captura.create({
        sala: dados.sala,
        db: dados.db,
        status: dados.status,
        criadoEm: new Date(),
      });

      console.log("Salvo no MongoDB!");

    } catch (err) {
      console.error("ERRO ao salvar MQTT no Mongo:", err);
    }
  }
});

