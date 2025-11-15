import React, { useEffect, useState } from "react";

export default function Live() {
  const [capturaAtiva, setCapturaAtiva] = useState(false);
  const [nivel, setNivel] = useState(0);
  const [turma, setTurma] = useState("");

  // Simulação: checa se há uma captura ativa
  useEffect(() => {
    const verificarCaptura = async () => {
      try {
        const response = await fetch("http://20.80.105.137:5000/api/salas/ativa"); 
        //  endpoint retorna { ativa: true/false, turma: "2A" }
        const data = await response.json();
        setCapturaAtiva(data.ativa);
        setTurma(data.turma || "");
      } catch (err) {
        console.error("Erro ao verificar captura ativa:", err);
      }
    };

    verificarCaptura();
    const intervalo = setInterval(verificarCaptura, 5000); // verifica a cada 5s
    return () => clearInterval(intervalo);
  }, []);

  // Simula variação de som em tempo real
  useEffect(() => {
    if (capturaAtiva) {
      const interval = setInterval(() => {
        setNivel(Math.round(Math.random() * 40) + 50);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [capturaAtiva]);

  return (
    <section className="container-max py-16 text-center">
      <h2 className="text-3xl font-bold gradient-text mb-6">
        Sala Ambiente: Live
      </h2>

      {!capturaAtiva ? (
        <div className="card p-10 bg-white/60 mx-auto max-w-lg">
          <p className="text-lg opacity-80">
            Nenhuma captura ativa no momento.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Assim que uma turma iniciar a medição de ruído, os dados aparecerão
            aqui em tempo real.
          </p>
        </div>
      ) : (
        <div className="card p-8 bg-white/70 mx-auto max-w-3xl">
          <h3 className="text-2xl font-semibold mb-4">
            Turma em captura: <span className="text-[#6A4C93]">{turma}</span>
          </h3>

          <div className="h-48 rounded-xl bg-white/40 flex items-end p-3 gap-1 justify-center">
            {Array.from({ length: 40 }).map((_, i) => {
              const h = Math.max(12, Math.min(150, nivel + (Math.random() * 10 - 5)));
              let color = "#8AC926"; // verde (baixo)
              if (h > 100) color = "#FF595E"; // vermelho (alto)
              else if (h > 70) color = "#FFCA3A"; // amarelo (médio)

              return (
                <div
                  key={i}
                  style={{
                    height: h,
                    backgroundColor: color,
                    borderRadius: "6px 6px 0 0",
                    transition: "height 0.2s ease, background-color 0.3s ease",
                  }}
                  className="bar w-2"
                ></div>
              );
            })}
          </div>

          <p className="mt-4 text-lg font-semibold">
            Nível atual:{" "}
            <span
              className={
                nivel > 100
                  ? "text-[#FF595E]"
                  : nivel > 70
                  ? "text-[#FFCA3A]"
                  : "text-[#8AC926]"
              }
            >
              {nivel} dB
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-1 italic">
            Atualizando em tempo real...
          </p>
        </div>
      )}
    </section>
  );
}
