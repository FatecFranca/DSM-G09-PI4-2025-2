import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://20.80.105.137:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("ouviot_user", JSON.stringify(data.user));
        navigate(from, { replace: true });
      } else {
        alert(data.error || "Erro ao fazer login.");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
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
            <label className="text-sm opacity-80">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl bg-[color:var(--bg)] border border-black/10 px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: prof.ana@gmail.com"
            />
          </div>
          <div>
            <label className="text-sm opacity-80">Senha</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl bg-[color:var(--bg)] border border-black/10 px-4 py-2"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
            />
          </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-lg font-semibold rounded-2xl shadow-md transition-all duration-200 transform
                ${
                  loading
                    ? "bg-[#6A4C93]/60 cursor-not-allowed"
                    : "bg-[#6A4C93] hover:bg-[#8B5CF6] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-white"
                }`}
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>

        </div>
      </form>
    </section>
  );
}
