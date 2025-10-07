import { useEffect, useMemo, useRef, useState } from "react";

export default function Dashboard() {
  const [active, setActive] = useState(true);
  const [level, setLevel] = useState(65);
  const barRefs = useRef([]);
  const bars = useMemo(() => Array.from({ length: 24 }), []);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      const newLevel = Math.max(30, Math.min(95, Math.round(level + (Math.random() * 10 - 5))));
      setLevel(newLevel);
      barRefs.current.forEach((el) => {
        if (!el) return;
        const h = Math.max(10, Math.round(Math.random() * 120));
        el.style.height = h + "px";
        el.style.background = ["#8AC926", "#FFCA3A", "#FF595E", "#1982C4"][Math.floor(Math.random() * 4)];
      });
    }, 250);
    return () => clearInterval(t);
  }, [active, level]);

  return (
    <section className="container-max py-12 grid lg:grid-cols-[260px_1fr] gap-8">
      <aside className="card p-5 h-max">
        <h3 className="font-semibold">Navegação</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li><button className="btn-ghost w-full justify-start">Histórico</button></li>
          <li><button className="btn-ghost w-full justify-start">Resultados</button></li>
          <li><button className="btn-ghost w-full justify-start">Configurações</button></li>
        </ul>
      </aside>

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-3">
            <span className="badge">Nível atual: <b>{level} dB</b></span>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
              Sala ativa
            </label>
          </div>
        </div>

        {active && (
          <div className="card p-6">
            <h3 className="font-semibold">Ambiente (tempo real)</h3>
            <div className="mt-3 bars">
              {bars.map((_, i) => (
                <div key={i} ref={(el) => (barRefs.current[i] = el)} className="bar" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
