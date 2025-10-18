import Alerta from "../models/Alerta.js";

export const listarAlertas = async (req, res) => {
  const alertas = await Alerta.find().sort({ horario: -1 }).limit(20);
  res.json(alertas);
};
