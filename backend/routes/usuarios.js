import express from "express";
import { criarUsuario, listarUsuarios } from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", criarUsuario);   // cadastrar usuário
router.get("/", listarUsuarios);  // listar todos os usuários

export default router;
