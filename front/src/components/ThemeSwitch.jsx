import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "blue");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <select
      className="bg-[color:var(--card)] border border-black/10 rounded-xl px-2 py-1 text-sm"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="green">Verde</option>
      <option value="yellow">Amarelo</option>
      <option value="red">Vermelho</option>
      <option value="blue">Azul</option>
    </select>
  );
}
