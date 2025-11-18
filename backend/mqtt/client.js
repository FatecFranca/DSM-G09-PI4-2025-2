import mqtt from "mqtt";
import SensorData from "../models/SensorData.js";
import Alerta from "../models/Alerta.js";
import { atualizarNivel } from "../controllers/capturaController.js";

const MQTT_URL = "mqtt://20.80.105.137:1883";
//const MQTT_URL = "mqtt://localhost:1883";
const client = mqtt.connect(MQTT_URL);

// Quando conectar ao broker
client.on("connect", () => {
  console.log("📡 MQTT conectado!");

  client.subscribe("ouviot/captura/dados");
  client.subscribe("ouviot/captura/comando");
  client.subscribe("ouviot/captura/sala");
});

// Quando mensagens chegam do ESP32
client.on("message", async (topic, message) => {
  try {
    const payload = message.toString();
    console.log(`📩 MQTT ${topic}: ${payload}`);

    if (topic === "ouviot/captura/dados") {
      const dados = JSON.parse(payload);
      
      let statusCorrigido = dados.status;
      if (statusCorrigido === "alto") {
        statusCorrigido = "high";
      }
    // 1️ Salvar em SensorData (histórico completo) 
      await SensorData.create({
        sala: dados.sala,
        db: dados.db,
        status: statusCorrigido,
        criadoEm: new Date(),
        
      });
      
    // 🔥 Atualiza nível ao vivo para o front
    atualizarNivel(dados.db, dados.sala);

    // 2️ Se for alerta → salvar também na tabela "alertas"
      if (statusCorrigido === "alert" || statusCorrigido === "high") {
        await Alerta.create({
          sala: dados.sala,
          db: dados.db,
          status: statusCorrigido, // Usa a variável corrigida
        });
      }
    }
  } catch (err) {
    // Agora você verá o erro de validação aqui se ele ainda existir
    console.log("Erro ao processar MQTT:", err.message);
  }
});

export default client;
