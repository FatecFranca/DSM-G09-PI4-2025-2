import express from "express";
import { listarAlertas } from "../controllers/alertaController.js";

const router = express.Router();
router.get("/", listarAlertas);

export default router;
