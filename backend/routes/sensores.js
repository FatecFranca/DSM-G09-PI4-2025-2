import express from "express";
import SensorData from "../models/SensorData.js";

const router = express.Router();

// Últimos 20 dados da sala 
router.get("/ultimos/:sala", async (req, res) => {
  try {
    const sala = req.params.sala;

    const dados = await SensorData
      .find({ sala })
      .sort({ criadoEm: -1 })
      .limit(20);

    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Histórico completo da sala
router.get("/historico/:sala", async (req, res) => {
  try {
    const sala = req.params.sala;

    const dados = await SensorData
      .find({ sala })
      .sort({ criadoEm: 1 });   // ordem cronológica

    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
