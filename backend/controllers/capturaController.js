import client from "../mqtt/client.js"; // 1. Importe o client MQTT aqui

let capturaAtiva = false;
let salaSelecionada = null;
let ultimoNivel = 0;

// Atualiza o nível vindo do MQTT
export const atualizarNivel = (db, sala) => {
  ultimoNivel = db;
  salaSelecionada = sala;
};

// Selecionar sala antes de iniciar captura
export const selecionarSala = (req, res) => {
  const { sala } = req.body;

  if (!sala) {
    return res.status(400).json({ erro: "Sala não enviada" });
  }

  client.publish("ouviot/captura/sala", sala); // 2. Mova a lógica MQTT para cá
  salaSelecionada = sala;
  return res.json({ ok: true, sala: salaSelecionada });
};


// Iniciar captura
export const iniciarCaptura = (req, res) => {
  client.publish("ouviot/captura/comando", "start"); // 2. Mova a lógica MQTT para cá
  capturaAtiva = true;
  return res.json({ ok: true, mensagem: "Captura iniciada" });
};

// Parar captura
export const pararCaptura = (req, res) => {
  client.publish("ouviot/captura/comando", "stop"); // 2. Mova a lógica MQTT para cá
  capturaAtiva = false;
  ultimoNivel = 0;
  salaSelecionada = null;
  return res.json({ ok: true, mensagem: "Captura encerrada" });
};

// Status geral da captura → usado pelo FRONT (Live.jsx)
export const statusCaptura = (req, res) => {
  return res.json({
    ativa: capturaAtiva,
    turma: salaSelecionada,
    nivel: ultimoNivel,
  });
};
