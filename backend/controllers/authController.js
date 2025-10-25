import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o e-mail existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Compara a senha digitada com a senha criptografada
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // Login bem-sucedido
    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
        id: usuario._id
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login", error: error.message });
  }
};
