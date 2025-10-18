import SensorData from "../models/SensorData.js";
import Alerta from "../models/Alerta.js";

export const registrarSom = async (req, res) => {
  try {
    const { sala, nivelRuido, sensorId } = req.body;

    const status =
      nivelRuido < 50 ? "baixo" :
      nivelRuido < 70 ? "moderado" : "alto";

    const novoRegistro = await SensorData.create({
      sala,
      nivelRuido,
      sensorId,
      status
    });

    if (nivelRuido >= 70) {
      await Alerta.create({ sala, nivelRuido });
    }

    res.status(201).json({ message: "Dados registrados", data: novoRegistro });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
