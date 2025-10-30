// controllers/salaController.js
import Sala from "../models/Sala.js";

/**
 * 🔹 Lista todas as salas
 */
export const listarSalas = async (req, res) => {
  try {
    const salas = await Sala.find();
    res.json(salas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao listar salas", error: error.message });
  }
};

/**
 * 🔹 Cria uma nova sala
 */
export const criarSala = async (req, res) => {
  try {
    console.log("📦 Sala recebida:", req.body);
    const { nome } = req.body;

    if (!nome)
      return res.status(400).json({ message: "O nome da sala é obrigatório!" });

    const existente = await Sala.findOne({ nome });
    if (existente)
      return res.status(400).json({ message: "Esta sala já está cadastrada!" });

    const novaSala = await Sala.create({ nome });
    res
      .status(201)
      .json({ message: "Sala cadastrada com sucesso!", sala: novaSala });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao criar sala", error: error.message });
  }
};

/**
 * 🔹 Exclui sala pelo ID (usado no Configurações)
 */
export const deletarSala = async (req, res) => {
  try {
    const { id } = req.params;
    const removida = await Sala.findByIdAndDelete(id);
    if (!removida)
      return res.status(404).json({ message: "Sala não encontrada." });
    res.json({ message: "Sala excluída com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao excluir sala", error: error.message });
  }
};
