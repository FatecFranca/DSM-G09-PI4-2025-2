// routes/salas.js
import express from "express";
import {
  listarSalas,
  criarSala,
  deletarSala,
} from "../controllers/salaController.js";

const router = express.Router();

/**
 * @openapi
 * /salas:
 *   get:
 *     summary: Lista todas as salas
 *     tags:
 *       - Salas
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", listarSalas);        // Listar salas 

/**
 * @openapi
 * /salas:
 *   post:
 *     summary: Cria uma nova sala
 *     tags:
 *       - Salas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 */

router.post("/", criarSala);         // Criar sala


/**
 * @openapi
 * /salas/{nome}:
 *   delete:
 *     summary: Remove uma sala pelo nome
 *     tags:
 *       - Salas
 *     parameters:
 *       - name: nome
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Sala removida
 */
router.delete("/:nome", deletarSala);  // Excluir sala por nome

export default router;
