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
router.delete("/:id", deletarSala);  // Excluir sala por ID

export default router;
