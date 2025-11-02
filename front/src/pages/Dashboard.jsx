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

export default function Dashboard() {
  // Dados simulados
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const gerarDados = () => {
      const dadosFake = Array.from({ length: 24 }, (_, i) => ({
        hora: `${i}:00`,
        ruido: Math.floor(Math.random() * 40) + 50, // 50–90 dB
      }));
      setDados(dadosFake);
    };
    gerarDados();
  }, []);

  // Cores e faixas
  const COLORS = ["#8AC926", "#FFCA3A", "#FF595E"];

  const resumo = {
    media: 67,
    pico: 88,
    tempoCritico: 18,
    silencio: 42,
    dosimetria: 73,
  };

  const faixa = [
    { name: "Silencioso", value: 42 },
    { name: "Moderado", value: 40 },
    { name: "Crítico", value: 18 },
  ];

  return (
    <section className="container-max py-10 space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-3xl font-bold gradient-text">Painel Sonoro</h2>
        <p className="text-[color:var(--text)] opacity-80">
          Última atualização: {new Date().toLocaleString("pt-BR")}
        </p>
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
        <h3 className="text-xl font-semibold mb-4">📈 Variação Sonora ao Longo do Dia</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis domain={[50, 90]} />
            <Tooltip />
            <Line type="monotone" dataKey="ruido" stroke="#6A4C93" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de barras comparativo */}
      <div className="card p-6 bg-white/70">
        <h3 className="text-xl font-semibold mb-4">🏫 Comparativo de Turmas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { turma: "1A", media: 65 },
              { turma: "1B", media: 72 },
              { turma: "2A", media: 68 },
              { turma: "2B", media: 80 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="turma" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="media" fill="#FFCA3A" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de pizza */}
      <div className="card p-6 bg-white/70 flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4">🎯 Distribuição de Níveis Sonoros</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={faixa}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {faixa.map((entry, index) => (
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
