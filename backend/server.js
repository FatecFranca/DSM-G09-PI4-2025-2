// mqtt/client.js
import mqtt from "mqtt";
import SensorData from "../models/SensorData.js";
import Alerta from "../models/Alerta.js";

const MQTT_URL = "mqtt://20.80.105.137:1883";
const client = mqtt.connect(MQTT_URL);

client.on("connect", () => {
  console.log("📡 MQTT conectado!");

  client.subscribe("ouviot/captura/dados");
  client.subscribe("ouviot/captura/comando");
  client.subscribe("ouviot/captura/sala");
});

// Recebendo mensagens do ESP32
client.on("message", async (topic, message) => {
  const payload = message.toString();
  console.log(`📩 MQTT ${topic}: ${payload}`);

  if (topic === "ouviot/captura/dados") {
    try {
      const dados = JSON.parse(payload);

      // 1️⃣ Salva leitura geral
      await SensorData.create({
        sala: dados.sala,
        db: dados.db,
        status: dados.status,
        criadoEm: new Date(),
      });

      // 2️⃣ Salva alerta separado (se necessário)
      if (dados.status === "alert" || dados.status === "high") {
        await Alerta.create({
          sala: dados.sala,
          db: dados.db,
          status: dados.status,
          criadoEm: new Date(),
        });
      }

      console.log("💾 Dados salvos no MongoDB!");

    } catch (error) {
      console.error("❌ Erro ao processar MQTT:", error);
    }
  }
});

export default client;
