import { Link, NavLink, useNavigate } from "react-router-dom";
import logoT from "../assets/logoT.png";

export default function Navbar() {
  const navigate = useNavigate();
  const isLogged = !!localStorage.getItem("ouviot_user");

  const logout = () => {
    localStorage.removeItem("ouviot_user");
    navigate("/");
  };

  const nav = "font-medium hover:text-[#8AC926] transition";
  const active = "font-semibold text-[#8AC926]";

  return (
    <header className="sticky top-0 z-40 bg-[color:var(--bg)]/80 backdrop-blur border-b border-black/10">
      <div className="container-max py-3 flex items-center justify-between">
        {/* Logo e nome */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoT} alt="Logo OuvIoT" className="w-9 h-9 drop-shadow-md hover:scale-105 transition-transform" />
          <span className="text-2xl font-bold gradient-text">OuvIoT</span>
        </Link>

        {/* Links principais */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={({ isActive }) => (isActive ? active : nav)}>
            Home
          </NavLink>
          <NavLink to="/sobre" className={({ isActive }) => (isActive ? active : nav)}>
            Sobre
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? active : nav)}>
            Dashboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {isLogged ? (
            <button onClick={logout} className="btn-ghost">Sair</button>
          ) : (
            <Link to="/login" className="btn-primary">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
