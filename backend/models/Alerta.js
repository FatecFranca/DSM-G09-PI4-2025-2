import mongoose from "mongoose";

const AlertaSchema = new mongoose.Schema({
  sala: { type: String, required: true },
  db: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["alert", "high"], 
    required: true 
  },
  criadoEm: { type: Date, default: Date.now }
});

export default mongoose.model("Alerta", AlertaSchema);
