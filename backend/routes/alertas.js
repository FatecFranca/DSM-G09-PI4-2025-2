import express from "express";
import { listarAlertas, listarAlertasPorSala } from "../controllers/alertaController.js";

const router = express.Router();


/**
 * @openapi
 * /alertas:
 *   get:
 *     summary: Lista os últimos alertas
 *     tags:
 *       - Alertas
 */ 
router.get("/", listarAlertas);

/**
 * @openapi 
 * /alertas/sala/{sala}:
 *   get:
 *     summary: Lista alertas filtrados por sala
 *     tags:
 *       - Alertas
 */
// Lista alertas de uma sala específica
router.get("/sala/:sala", listarAlertasPorSala);

export default router;
