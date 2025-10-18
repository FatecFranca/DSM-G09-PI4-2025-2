import express from "express";
import { listarSalas, criarSala } from "../controllers/salaController.js";

const router = express.Router();
router.get("/", listarSalas);
router.post("/", criarSala);

export default router;
