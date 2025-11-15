import express from "express";
import client from "../mqtt/client.js"; // importa o MQTT client

const router = express.Router();

// Iniciar captura
router.post("/iniciar", (req, res) => {
  client.publish("ouviot/captura/comando", "start");
  res.json({ ok: true, msg: "Captura iniciada!" });
});

// Parar captura
router.post("/parar", (req, res) => {
  client.publish("ouviot/captura/comando", "stop");
  res.json({ ok: true, msg: "Captura parada!" });
});

// Selecionar sala
router.post("/selecionar-sala", (req, res) => {
  const { sala } = req.body;

  if (!sala) {
    return res.status(400).json({ error: "Sala obrigatória" });
  }

  client.publish("ouviot/captura/sala", sala);

  res.json({ ok: true, msg: `Sala ${sala} definida!` });
});

export default router;
