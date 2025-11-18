import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  LineChart,
  Line,
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
        const response = await fetch("http://localhost:5000/salas");
        const data = await response.json();
        setSalas(data);
      } catch (err) {
        console.error("Erro ao buscar salas:", err);
      }
    };
    buscarSalas();
  }, []);

  //  Buscar dados de uma sala (todo histórico da sala)
  const handleSelecionarSala = async (nomeSala) => {
    setSalaSelecionada(nomeSala);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/sensores/historico/${nomeSala}`)
;
      const data = await response.json();
      // backend devolve array de registros de SensorData
      setDados(data || []);
    } catch (err) {
      console.error("Erro ao buscar dados da sala:", err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#8AC926", "#FFCA3A", "#FF595E"];

  // ====== RESUMO (histórico inteiro da sala) ======
  let resumo = {
    media: "--",
    pico: "--",
    tempoCritico: "--",
    silencio: "--",
    desvioPadrao: "--",
  };

  if (dados.length) {
    const valores = dados.map((d) => d.db);
    const total = valores.reduce((acc, v) => acc + v, 0);
    const mediaNum = total / valores.length;

    const pico = Math.max(...valores);

    const tempoCritico = Math.round(
      (valores.filter((v) => v > 60).length / valores.length) * 100
    );

    const silencio = Math.round(
      (valores.filter((v) => v < 55).length / valores.length) * 100
    );

    const variancia =
      valores.reduce((acc, v) => acc + Math.pow(v - mediaNum, 2), 0) /
      valores.length;
    const dp = Math.sqrt(variancia);
    const desvioPadrao = Math.round((dp / mediaNum) * 100);

    resumo = {
      media: Math.round(mediaNum),
      pico: pico,
      tempoCritico,
      silencio,
      desvioPadrao,
    };
  }

  // ====== Últimas 50 capturas para gráfico de linha (índice) ======
    const ultimos50 = dados
      .slice(-50)
      .map((d, index) => ({ indice: index + 1, ruido: d.db }));


  // ====== Distribuição de níveis (ideal / atenção / crítico) ======
  const distribuicao =
    dados.length > 0
      ? [
          {
            name: "Ideal",
            value: dados.filter((d) => d.db < 55).length,
          },
          {
            name: "Atenção",
            value: dados.filter((d) => d.db >= 55 && d.db <= 60).length,
          },
          {
            name: "Crítico",
            value: dados.filter((d) => d.db > 61).length,
          },
        ]
      : [{ name: "Sem dados", value: 1 }];

  // ====== Variação diária (Seg–Sex) — min, média, max ======
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const agrupado = {};

  dados.forEach((d) => {
    const dia = diasSemana[new Date(d.criadoEm).getDay()];
    if (!agrupado[dia]) agrupado[dia] = [];
    agrupado[dia].push(d.db);
  });

  const diasUteis = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const barrasSemana = diasUteis.map((dia) => {
    const valores = agrupado[dia] || [];
    if (!valores.length) {
      return { dia, min: 0, med: 0, max: 0 };
    }
    const min = Math.round(Math.min(...valores));
    const max = Math.round(Math.max(...valores));
    const med = Math.round(
      valores.reduce((acc, v) => acc + v, 0) / valores.length
    );
    return { dia, min, med, max };
  });

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
            <option key={sala._id} value={sala.nome}>
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
        <h2 className="text-3xl font-bold gradient-text mb-6">
          Painel Sonoro
        </h2>
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
          Painel Sonoro - {salaSelecionada}
        </h2>

        <select
          className="bg-white/70 border border-black/10 rounded-xl px-5 py-2 font-medium shadow-sm hover:shadow-md transition-all"
          value={salaSelecionada}
          onChange={(e) => handleSelecionarSala(e.target.value)}
        >
          {salas.map((sala) => (
            <option key={sala._id} value={sala.nome}>
              {sala.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="card text-center p-5 bg-[#E7F9DF]/80">
          <p className="text-sm opacity-70">Nível Médio</p>
          <h3 className="text-3xl font-bold text-[#8AC926]">
            {resumo.media} dB
          </h3>
        </div>

        <div className="card text-center p-5 bg-[#ffd39ea0]"> 
          <p className="text-sm opacity-70">Pico Máximo</p>
          <h3 className="text-3xl font-bold text-red-600">
            {Math.round(resumo.pico)} dB
          </h3>
        </div>


        <div className="card text-center p-5 bg-[#FFE5E5]/80">
          <p className="text-sm opacity-70">Tempo Crítico (&gt; 60 dB)</p>
          <h3 className="text-3xl font-bold  text-red-600">
            {resumo.tempoCritico}%
          </h3>
        </div>

        <div className="card text-center p-5 bg-[#EAF6FF]/80">
          <p className="text-sm opacity-70">Índice de Silêncio (&lt; 55 dB)</p>
          <h3 className="text-3xl font-bold text-[#1982C4]">
            {resumo.silencio}%
          </h3>
        </div>

        <div className="card text-center p-5 bg-[#F3E8FF]/80">
          <p className="text-sm opacity-70">Desvio Padrão</p>
          <h3 className="text-3xl font-bold text-[#6A4C93]">
            {resumo.desvioPadrao}%
          </h3>
        </div>
      </div>

              {/* 📉 Variação Sonora - Gráfico de Linha (últimas 50 capturas) */}
          <div className="card p-6 bg-white/70 col-span-1">
            <h3 className="text-xl font-semibold mb-4">
              📉 Variação Sonora - Últimas 50 capturas
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={ultimos50}
                margin={{ top: 20, right: 30, bottom: 5, left: 0 }}
              >             
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis
                  dataKey="indice"
                  tick={{ fontSize: 12 }}
                  label={{ value: "Capturas", position: "insideBottomRight", offset: -5 }}
                />
                <YAxis
                  domain={[50, 60]}              //  intervalo mínimo e máximo do eixo Y
                  allowDataOverflow={true}       //  permite mostrar pontos fora do range se precisar
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Ruído (dB)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="ruido"
                  stroke="#6A4C93"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#6A4C93" }}
                  activeDot={{ r: 6 }}
                  label={{
                    formatter: (value) => value.toFixed(1),
                    position: "top",
                    fontSize: 12,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>


      {/* Gráfico de pizza — distribuição dos níveis */}
      <div className="card p-6 bg-white/70 flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4">
          🎯 Distribuição de Níveis Sonoros
        </h3>
       <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={distribuicao}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={110}
      label={({ name, value }) => {
        const total = distribuicao.reduce((acc, d) => acc + d.value, 0);
        const percent = total ? ((value / total) * 100).toFixed(1) : 0;
        return `${name}: ${percent}%`;
      }}
    >
      {distribuicao.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={COLORS[index % COLORS.length]}
        />
      ))}
    </Pie>

    <Tooltip
      formatter={(value) => {
        const total = distribuicao.reduce((acc, d) => acc + d.value, 0);
        const percent = total ? ((value / total) * 100).toFixed(1) : 0;
        return `${percent}%`;
      }}
    />
  </PieChart>
</ResponsiveContainer>

      </div>

      {/* Gráfico de barras — variação diária (Seg–Sex) */}
      <div className="card p-6 bg-white/70">
        <h3 className="text-xl font-semibold mb-4">
          📊 Variação Diária(dB)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barrasSemana}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="min" name="Mínimo" fill="#8AC926" />
            <Bar dataKey="med" name="Médio" fill="#FFCA3A" />
            <Bar dataKey="max" name="Máximo" fill="#FF595E" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
