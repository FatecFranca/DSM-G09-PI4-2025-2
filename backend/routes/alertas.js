import express from "express";
import { listarAlertas, listarAlertasPorSala } from "../controllers/alertaController.js";

const router = express.Router();

// Lista todos os alertas
router.get("/", listarAlertas);

// Lista alertas de uma sala específica
router.get("/sala/:sala", listarAlertasPorSala);

export default router;
