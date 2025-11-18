import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !senha) {
      return res.status(400).json({ 
        message: "E-mail e senha são obrigatórios" 
      });
    }

    // Verifica se o e-mail existe
    const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
    if (!usuario) {
      return res.status(401).json({ 
        message: "E-mail ou senha incorretos" 
      });
    }

    // Compara a senha digitada com a senha criptografada
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ 
        message: "E-mail ou senha incorretos" 
      });
    }

    // Login bem-sucedido - remove a senha da resposta
    const usuarioResposta = {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      criadoEm: usuario.criadoEm
    };

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: usuarioResposta
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ 
      message: "Erro interno do servidor", 
      error: error.message 
    });
  }
};