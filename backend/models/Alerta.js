import mongoose from "mongoose";

const AlertaSchema = new mongoose.Schema({
  sala: { type: String, required: true },
  nivelRuido: { type: Number, required: true },
  horario: { type: Date, default: Date.now },
  mensagem: { type: String, default: "Nível de ruído acima do limite!" }
});

export default mongoose.model("Alerta", AlertaSchema);
