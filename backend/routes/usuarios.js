// routes/usuarios.js
import express from "express";
import {
  criarUsuario,
  listarUsuarios,
  deletarUsuarioPorEmail,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", criarUsuario);       // Cadastrar usuário
router.get("/", listarUsuarios);      // Listar usuários
router.delete("/:email", deletarUsuarioPorEmail); // Excluir usuário por e-mail

export default router;
