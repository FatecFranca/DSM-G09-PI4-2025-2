import mongoose from "mongoose";

const SensorDataSchema = new mongoose.Schema({
  sala: { type: String, required: true },
  nivelRuido: { type: Number, required: true },
  horario: { type: Date, default: Date.now },
  sensorId: { type: String },
  status: { type: String, enum: ["baixo", "moderado", "alto"], default: "baixo" }
});

export default mongoose.model("SensorData", SensorDataSchema);
