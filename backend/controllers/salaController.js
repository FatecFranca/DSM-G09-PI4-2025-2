import Sala from "../models/Sala.js";

export const listarSalas = async (req, res) => {
  const salas = await Sala.find();
  res.json(salas);
};

export const criarSala = async (req, res) => {
  const sala = await Sala.create(req.body);
  res.status(201).json(sala);
};
