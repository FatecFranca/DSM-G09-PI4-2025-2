import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: [true, "O nome é obrigatório"] 
  },
  email: { 
    type: String, 
    required: [true, "O e-mail é obrigatório"], 
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: { 
    type: String, 
    required: [true, "A senha é obrigatória"] 
  }, 
  criadoEm: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("Usuario", UsuarioSchema);
