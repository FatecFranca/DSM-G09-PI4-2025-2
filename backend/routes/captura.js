import express from "express";
import client from "../mqtt/client.js";
import {
  iniciarCaptura,
  pararCaptura,
  selecionarSala,
  statusCaptura,
} from "../controllers/capturaController.js";

const router = express.Router();

router.post("/selecionar-sala", selecionarSala);
router.post("/iniciar", iniciarCaptura);       
router.post("/parar", pararCaptura);           
router.get("/status", statusCaptura);           

export default router;
