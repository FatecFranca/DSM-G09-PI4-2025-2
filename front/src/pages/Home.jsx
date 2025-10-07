import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="container-max py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="badge text-sm font-semibold text-[#8AC926]">Projeto Educacional</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight">
            OuvIoT: <span className="gradient-text">Monitoramento inteligente</span> de ruído em salas de aula.
          </h2>
          <p className="mt-4 opacity-90 text-lg">
            Visualize níveis de som em tempo real, receba alertas e acompanhe relatórios para promover ambientes mais silenciosos e saudáveis.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/sobre" className="btn-ghost">Como funciona</Link>
            <Link to="/dashboard" className="btn-green">Ir para o Dashboard</Link>
          </div>
        </div>

        <div className="card p-6 md:p-8">
          <div className="h-48 rounded-xl bg-white/40 flex items-end p-3 gap-1">
            {Array.from({ length: 40 }).map((_, i) => {
              const h = Math.max(12, Math.round(Math.random() * 150));
              return (
                <div
                  key={i}
                  style={{ height: h }}
                  className="w-2 bg-[color:var(--text)]/40 rounded-t"
                ></div>
              );
            })}
          </div>
          <p className="mt-3 text-sm opacity-70">* Visualização ilustrativa</p>
        </div>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {[
          ["Por que importa?", "Melhora foco, reduz estresse e organiza rotinas."],
          ["Relatórios", "Compare turmas e períodos e identifique padrões de ruído."],
          ["Gamificação", "Mais silêncio, mais pontos: engaje a turma de forma positiva!"],
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
