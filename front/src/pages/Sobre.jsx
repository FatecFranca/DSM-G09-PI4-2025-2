export default function Sobre() {
  return (
    <section className="container-max py-16 max-w-4xl">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Sobre o Projeto</h2>
      <p className="opacity-90 mb-8">
        O OuvIoT nasceu para apoiar escolas no acompanhamento do ambiente sonoro em sala de aula.
        Com sensores de baixo custo e um painel intuitivo, é possível acompanhar níveis de ruído,
        emitir alertas e gerar relatórios que subsidiam decisões pedagógicas.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {["Coleta em tempo real", "Alertas automáticos", "Relatórios PDF"].map((item, i) => (
          <div key={i} className="card p-6">
            <h3 className="font-semibold">{item}</h3>
            <p className="opacity-80 mt-2">
              Funcionalidade pronta para integração com sensores IoT e banco de dados.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
