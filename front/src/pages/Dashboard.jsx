import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Loader animado e temático
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-64 opacity-70">
      <div className="w-14 h-14 border-4 border-[#6A4C93] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-[#6A4C93] font-medium">Carregando dados...</p>
    </div>
  );
}

export default function Dashboard() {
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState("");
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  //  Buscar todas as salas
  useEffect(() => {
    const buscarSalas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/salas");
        const data = await response.json();
        setSalas(data);
      } catch (err) {
        console.error("Erro ao buscar salas:", err);
      }
    };
    buscarSalas();
  }, []);

  //  Buscar dados de uma sala
  const handleSelecionarSala = async (idSala) => {
    setSalaSelecionada(idSala);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/salas/${idSala}`);
      const data = await response.json();
      setDados(data.sensores || []); // caso não existam sensores, fica array vazio
    } catch (err) {
      console.error("Erro ao buscar dados da sala:", err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#8AC926", "#FFCA3A", "#FF595E"];

  //  Calcula os valores resumidos (ou mostra "--" se não houver dados)
  const resumo = {
    media: dados.length ? Math.round(dados.reduce((acc, d) => acc + d.ruido, 0) / dados.length) : "--",
    pico: dados.length ? Math.max(...dados.map((d) => d.ruido)) : "--",
    tempoCritico: dados.length ? Math.round((dados.filter((d) => d.ruido > 75).length / dados.length) * 100) : "--",
    silencio: dados.length ? Math.round((dados.filter((d) => d.ruido < 55).length / dados.length) * 100) : "--",
    dosimetria: dados.length ? Math.round(dados.reduce((acc, d) => acc + d.ruido, 0) / 100) : "--",
  };

  const faixa = [
    { name: "Silencioso", value: dados.filter((d) => d.ruido < 55).length },
    { name: "Moderado", value: dados.filter((d) => d.ruido >= 55 && d.ruido <= 75).length },
    { name: "Crítico", value: dados.filter((d) => d.ruido > 75).length },
  ];

  //  Caso nenhuma sala ainda tenha sido selecionada
  if (!salaSelecionada) {
    return (
      <section className="container-max py-20 text-center space-y-6">
        <h2 className="text-3xl font-bold gradient-text">Painel Sonoro</h2>
        <p className="text-lg text-[color:var(--text)] opacity-80">
          Selecione uma sala para visualizar os dados sonoros.
        </p>

        {/* Dropdown de seleção */}
        <select
          className="mt-6 bg-white/60 border border-black/10 rounded-xl px-6 py-3 text-lg font-medium shadow-sm hover:shadow-md transition-all"
          onChange={(e) => handleSelecionarSala(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Escolher sala...
          </option>
          {salas.map((sala) => (
            <option key={sala._id} value={sala._id}>
              {sala.nome}
            </option>
          ))}
        </select>
      </section>
    );
  }

  //  Exibe o carregamento
  if (loading) {
    return (
      <section className="container-max py-10">
        <h2 className="text-3xl font-bold gradient-text mb-6">Painel Sonoro</h2>
        <Loader />
      </section>
    );
  }

  // Exibe o dashboard — mesmo sem dados
  return (
    <section className="container-max py-10 space-y-10">
      {/* Cabeçalho + seletor */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold gradient-text">
          Painel Sonoro — {salas.find((s) => s._id === salaSelecionada)?.nome}
        </h2>

        <select
          className="bg-white/70 border border-black/10 rounded-xl px-5 py-2 font-medium shadow-sm hover:shadow-md transition-all"
          value={salaSelecionada}
          onChange={(e) => handleSelecionarSala(e.target.value)}
        >
          {salas.map((sala) => (
            <option key={sala._id} value={sala._id}>
              {sala.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="card text-center p-5 bg-[#E7F9DF]/80">
          <p className="text-sm opacity-70">Nível Médio</p>
          <h3 className="text-3xl font-bold text-[#8AC926]">{resumo.media} dB</h3>
        </div>

        <div className="card text-center p-5 bg-[#FFF6D6]/80">
          <p className="text-sm opacity-70">Pico Máximo</p>
          <h3 className="text-3xl font-bold text-[#FFCA3A]">{resumo.pico} dB</h3>
        </div>

        <div className="card text-center p-5 bg-[#FFE9E9]/80">
          <p className="text-sm opacity-70">Tempo Crítico</p>
          <h3 className="text-3xl font-bold text-[#FF595E]">
            {resumo.tempoCritico}%
          </h3>
        </div>

        <div className="card text-center p-5 bg-[#EAF6FF]/80">
          <p className="text-sm opacity-70">Índice de Silêncio</p>
          <h3 className="text-3xl font-bold text-[#1982C4]">{resumo.silencio}%</h3>
        </div>

        <div className="card text-center p-5 bg-[#F3E8FF]/80">
          <p className="text-sm opacity-70">Dosimetria Sonora</p>
          <h3 className="text-3xl font-bold text-[#6A4C93]">
            {resumo.dosimetria}%
          </h3>
        </div>
      </div>

      {/* Gráfico de linha */}
      <div className="card p-6 bg-white/70">
        <h3 className="text-xl font-semibold mb-4">
          📈 Variação Sonora — {salas.find((s) => s._id === salaSelecionada)?.nome}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dados.length ? dados : [{ hora: "", ruido: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis domain={[50, 90]} />
            <Tooltip />
            <Line type="monotone" dataKey="ruido" stroke="#6A4C93" strokeWidth={3} dot={!dados.length} />
          </LineChart>
        </ResponsiveContainer>
        {!dados.length && (
          <p className="text-center text-sm text-gray-500 mt-2 italic">
            Nenhum dado encontrado para esta sala.
          </p>
        )}
      </div>

      {/* Gráfico de pizza */}
      <div className="card p-6 bg-white/70 flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4">🎯 Distribuição de Níveis Sonoros</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dados.length ? faixa : [{ name: "Sem dados", value: 1 }]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {(dados.length ? faixa : [{ name: "Sem dados", value: 1 }]).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
