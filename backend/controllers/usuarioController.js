import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

export const criarUsuario = async (req, res) => {
  try {
    console.log("📦 Recebido do app:", req.body);
    const { nome, email, senha } = req.body;

    // Verifica se já existe o e-mail
    const existente = await Usuario.findOne({ email });
    if (existente) return res.status(400).json({ message: "E-mail já cadastrado!" });

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
    });
    

    res.status(201).json({ message: "Usuário cadastrado com sucesso!", usuario: novoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-senha"); // não retorna senhas
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar usuários", error: error.message });
  }
};
