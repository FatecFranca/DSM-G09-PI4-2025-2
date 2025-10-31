// controllers/usuarioController.js
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

/**
 *  Cria novo usuário
 */
export const criarUsuario = async (req, res) => {
  try {
    console.log("📦 Recebido do app:", req.body);
    const { nome, email, senha } = req.body;

    const existente = await Usuario.findOne({ email });
    if (existente)
      return res.status(400).json({ message: "E-mail já cadastrado!" });

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
    });

    res
      .status(201)
      .json({ message: "Usuário cadastrado com sucesso!", usuario: novoUsuario });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao criar usuário", error: error.message });
  }
};

/**
 *  Lista todos os usuários (sem senha)
 */
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-senha");
    res.json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao listar usuários", error: error.message });
  }
};

/**
 *  Deleta usuário por e-mail (usado no Configurações)
 */
export const deletarUsuarioPorEmail = async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const removido = await Usuario.findOneAndDelete({ email });
    if (!removido)
      return res.status(404).json({ message: "Usuário não encontrado." });
    res.json({ message: "Usuário excluído com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao excluir usuário", error: error.message });
  }
};
