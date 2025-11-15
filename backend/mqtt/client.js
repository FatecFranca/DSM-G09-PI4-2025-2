import mqtt from "mqtt";
import Sensor from "../models/Sensor.js";
import Alerta from "../models/Alerta.js";

const MQTT_URL = "mqtt://SEU_BROKER_AQUI:1883";

const client = mqtt.connect(MQTT_URL);

// Quando conectar
client.on("connect", () => {
  console.log("MQTT conectado!");

  client.subscribe("ouviot/captura/dados");
  client.subscribe("ouviot/captura/comando");
  client.subscribe("ouviot/captura/sala");
});

// Quando alguma mensagem chega
client.on("message", async (topic, message) => {
  const payload = message.toString();
  console.log(`📩 MQTT ${topic}: ${payload}`);

  // Se for leitura do ESP32
  if (topic === "ouviot/captura/dados") {
    const dados = JSON.parse(payload);

    await Sensor.create({
      sala: dados.sala,
      db: dados.db,
      status: dados.status,
      criadoEm: new Date()
    });

    // Se status for alerta
    if (dados.status !== "ok") {
      await Alerta.create({
        sala: dados.sala,
        db: dados.db,
        status: dados.status,
        criadoEm: new Date()
      });
    }
  }
});

export default client;
