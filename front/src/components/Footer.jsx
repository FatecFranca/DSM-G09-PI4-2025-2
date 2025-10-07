export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10">
      <div className="container-max py-8 text-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <p>© {new Date().getFullYear()} OuvIoT — Projeto acadêmico</p>
        <div className="flex gap-4 opacity-80">
          <a href="#" className="hover:opacity-100">Termos</a>
          <a href="#" className="hover:opacity-100">Privacidade</a>
        </div>
      </div>
    </footer>
  );
}
