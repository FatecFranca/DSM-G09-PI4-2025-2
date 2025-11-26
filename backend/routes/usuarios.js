// routes/usuarios.js
import express from "express";
import {
  criarUsuario,
  listarUsuarios,
  deletarUsuarioPorEmail,
} from "../controllers/usuarioController.js";

const router = express.Router();

/**
 * @openapi
 * *   post:
 *     summary: Cria novo usuário
 *     tags:
 *       - Usuários
 */
router.post("/", criarUsuario);       // Cadastrar usuário 

/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
 *       - Usuários
 */
router.get("/", listarUsuarios);      // Listar usuários

/**
 * @openapi

 * /usuarios/{email}:
 *   delete:
 *     summary: Exclui usuário pelo e-mail
 *     tags:
 *       - Usuários
 */
router.delete("/:email", deletarUsuarioPorEmail); // Excluir usuário por e-mail

export default router;
