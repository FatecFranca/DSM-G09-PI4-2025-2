import SensorData from "../models/SensorData.js";
import Alerta from "../models/Alerta.js";

export const registrarSom = async (req, res) => {
  try {
    const { sala, nivelRuido, sensorId } = req.body;

    const status =
      nivelRuido < 55 ? "baixo" :
      nivelRuido < 60 ? "moderado" : "alto";

    const novoRegistro = await SensorData.create({
      sala,
      db: nivelRuido,
      sensorId,
      status
    });

    // Se o status for 'alert' ou 'high', crie um Alerta
    if (status === "alert" || status === "high") {
      
      await Alerta.create({
        sala,
        db: nivelRuido,
        status, // Salva "alert" ou "high"
      });
    }
    res.status(201).json({ message: "Dados registrados", data: novoRegistro });
  } catch (error) {
    console.error("ERRO AO REGISTRAR SOM:", error.message); 
    res.status(500).json({ error: error.message });
  }
};
