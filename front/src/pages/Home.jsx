import { Link } from "react-router-dom";
import React, { useEffect } from "react";

export default function Home() {
  useEffect(() => {
  const interval = setInterval(() => {
    document.querySelectorAll(".bar").forEach((el) => {
      const newHeight = Math.max(12, Math.round(Math.random() * 150));
      el.style.height = `${newHeight}px`;
    });
  },500);

  return () => clearInterval(interval);
}, []);

  return (
    <section className="container-max py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="badge text-sm font-semibold text-[#8AC926]">Projeto Educacional</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight">
            OuvIoT: <span className="gradient-text">Monitoramento inteligente</span> de ruído em salas de aula.
          </h2>
          <p className="mt-4 opacity-90 text-lg">
            Monitore o som em tempo real e explore dashboards que transformam dados em insights que apoiam gestores e educadores na tomada de decisões para aprimorar o ambiente escolar.
          </p>


        </div>

        <div className="card p-6 md:p-8">
              <div className="h-48 rounded-xl bg-white/40 flex items-end p-3 gap-1">
                {Array.from({ length: 40 }).map((_, i) => {
                  const h = Math.max(12, Math.round(Math.random() * 150));

                  let color = "#8AC926"; // verde (baixo)
                  if (h > 100) color = "#FF595E"; // vermelho (alto)
                  else if (h > 60) color = "#FFCA3A"; // amarelo (médio)

                  return (
                    <div
                      key={i}
                      style={{
                        height: h,
                        backgroundColor: color,
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.3s ease, background-color 0.3s ease",
                      }}
                      className="bar w-2 rounded-t"
                    ></div>
                  );
                })}

              </div>
                      <p className="mt-3 text-sm opacity-70">* Visualização ilustrativa</p>
                    </div>
            </div>

      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {[
          [<Link to="/sobre" className="btn-ghost">Por que importa?</Link>, "Melhora foco, reduz estresse e organiza rotinas."],
          [<Link to="/dashboard" className="btn-green">Relatórios</Link>, "Compare turmas e períodos e identifique padrões de ruído."],
          ["Gamificação(somente App Mobile)", "Mais silêncio, mais pontos: engaje a turma de forma positiva!"],
        ].map(([t, d], i) => (
          <div key={i} className="card p-6">
            <h3 className="font-semibold text-lg">{t}</h3>
            <p className="opacity-80 mt-2">{d}</p>
          </div>
        ))}
      </div>
    </section>
  
  );
  
}
