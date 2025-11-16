import Alerta from "../models/Alerta.js";

//  Listar TODOS os alertas (já existe)
export const listarAlertas = async (req, res) => {
  try {
    const alertas = await Alerta.find().sort({ criadoEm: -1 }).limit(50);
    res.json(alertas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar alertas", error: error.message });
  }
};

// Listar alertas de uma sala específica (NOVA ROTA)
export const listarAlertasPorSala = async (req, res) => {
  try {
    const nomeSala = req.params.sala;

    const alertas = await Alerta.find({ sala: nomeSala })
                                .sort({ criadoEm: -1 });

    res.json(alertas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar alertas por sala", error: error.message });
  }
};
