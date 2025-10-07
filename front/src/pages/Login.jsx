import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (user && pass) {
      localStorage.setItem("ouviot_user", JSON.stringify({ user }));
      navigate(from, { replace: true });
    } else {
      alert("Preencha usuário e senha.");
    }
    setLoading(false);
  };

  return (
    <section className="container-max py-16 flex justify-center">
      <form onSubmit={handleLogin} className="card w-full max-w-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <p className="text-center opacity-80 mt-1">
          Acesse o painel OuvIoT e acompanhe os sons da sua escola em tempo real.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm opacity-80">Usuário</label>
            <input
              className="mt-1 w-full rounded-xl bg-[color:var(--bg)] border border-black/10 px-4 py-2"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="ex: professora.ana"
            />
          </div>
          <div>
            <label className="text-sm opacity-80">Senha</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl bg-[color:var(--bg)] border border-black/10 px-4 py-2"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </div>
      </form>
    </section>
  );
}
