import mongoose from "mongoose";
 
const SalaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
});

export default mongoose.model("Sala", SalaSchema);

