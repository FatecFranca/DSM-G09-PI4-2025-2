import express from "express";
import client from "../mqtt/client.js";
import {
  iniciarCaptura,
  pararCaptura,
  selecionarSala,
  statusCaptura,
} from "../controllers/capturaController.js";

const router = express.Router();

/**
 * @openapi
 * /captura/selecionar-sala:
 *   post:
 *     summary: Seleciona sala para captura
 *     tags:
 *       - Captura
 *     requestBody:
 *       required: true
 */
router.post("/selecionar-sala", selecionarSala);

/**
 * @openapi* /captura/iniciar:
 *   post:
 *     summary: Inicia captura (envia comando via MQTT)
 *     tags:
 *       - Captura
 */
router.post("/iniciar", iniciarCaptura); 

/**
 * @openapi
* /captura/parar:
 *   post:
 *     summary: Para captura (MQTT)
 *     tags:
 *       - Captura
 */
router.post("/parar", pararCaptura);  

/**
 * @openapi * /captura/status:
 *   get:
 *     summary: Retorna status da captura
 *     tags:
 *       - Captura
 */
router.get("/status", statusCaptura);           

export default router;
