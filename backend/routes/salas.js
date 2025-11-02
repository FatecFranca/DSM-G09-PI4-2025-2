// routes/salas.js
import express from "express";
import {
  listarSalas,
  criarSala,
  deletarSala,
} from "../controllers/salaController.js";

const router = express.Router();

router.get("/", listarSalas);        // Listar salas
router.post("/", criarSala);         // Criar sala
router.delete("/:nome", deletarSala);  // Excluir sala por nome

export default router;
