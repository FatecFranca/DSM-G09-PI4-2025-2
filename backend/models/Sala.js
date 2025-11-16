import mongoose from "mongoose";
 
const SalaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  professor: { type: String },
  limiteRuido: { type: Number, default: 70 }
});

export default mongoose.model("Sala", SalaSchema);

