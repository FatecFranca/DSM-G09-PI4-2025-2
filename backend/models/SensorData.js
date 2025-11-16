import mongoose from "mongoose";

const SensorDataSchema = new mongoose.Schema({
  sala: { type: String, required: true },
  db: { type: Number, required: true },
  status: { type: String, enum: ["ok", "alert", "high"], required: true },
  criadoEm: { type: Date, default: Date.now }
});

export default mongoose.model("SensorData", SensorDataSchema);
