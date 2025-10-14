import React from "react";

export default function Sobre() {
  return (
    <section className="container-max py-16 space-y-16">
      {/* INTRODUÇÃO */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-4xl font-extrabold text-[color:var(--text)]">
            <span className="gradient-text">Introdução</span>
          </h2>
          <p className="leading-relaxed text-lg opacity-90">
            O <strong>ambiente escolar</strong> é naturalmente um espaço de
            interação, mas quando os <strong>níveis de ruído</strong> ultrapassam
            limites aceitáveis, podem comprometer a{" "}
            <strong>aprendizagem</strong>, a{" "}
            <strong>concentração</strong> e a{" "}
            <strong>saúde mental</strong> de professores e alunos. Esse problema
            é recorrente em diferentes níveis de ensino e afeta, em especial,
            docentes sujeitos à <em>fadiga vocal</em> e alunos{" "}
            <strong>neurodivergentes</strong>, mais sensíveis ao som.
          </p>
          <p className="leading-relaxed text-lg opacity-90">
            Atualmente, o monitoramento do barulho em sala é feito de maneira
            <strong> subjetiva</strong>, dependendo da percepção de cada
            professor. Nesse contexto, a <strong>tecnologia</strong> surge como
            aliada, oferecendo dados objetivos e propondo uma{" "}
            <strong>solução lúdica e participativa</strong> para envolver os
            alunos no controle do ruído.
          </p>
        </div>
        <div className="md:w-1/2">
          <div className="card-ouviot text-center p-6">
            <p className="text-lg italic text-[color:var(--text)]">
              “Mais do que medir o som, queremos <strong>ouvir o ambiente</strong>
              e melhorar a convivência em sala.”
            </p>
          </div>
        </div>
      </div>

      {/* PROBLEMA */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10">
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-[color:var(--text)]">
            O impacto do <span className="text-[#FF595E]">excesso de ruído</span>
          </h2>
          <p className="leading-relaxed text-lg opacity-90">
            O ruído excessivo em sala de aula gera{" "}
            <strong>desconforto</strong>, <strong>estresse</strong> e{" "}
            <strong>queda de desempenho</strong>. Professores relatam{" "}
            <em>fadiga mental</em>, dificuldades na disciplina e até{" "}
            <strong>problemas de saúde</strong> ligados ao barulho constante.
          </p>
          <p className="leading-relaxed text-lg opacity-90">
            Para os estudantes, o som elevado compromete a{" "}
            <strong>atenção</strong> e a <strong>aprendizagem</strong>. Em
            crianças e alunos neurodivergentes, o impacto é ainda mais intenso,
            causando irritabilidade e isolamento. É urgente uma{" "}
            <strong>solução tecnológica</strong> que permita medir, visualizar e
            agir sobre os níveis de ruído.
          </p>
        </div>
        <div className="md:w-1/2">
          <div className="card-ouviot bg-[#FFF6D6]/70 p-6 text-center">
            <p className="font-medium text-[color:var(--text)]">
              <strong>Mais silêncio</strong> não é ausência de som — é{" "}
              <em>presença de foco, respeito e bem-estar</em>.
            </p>
          </div>
        </div>
      </div>

      {/* OBJETIVOS */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-[color:var(--text)]">
            🎯 <span className="text-[#6A4C93]">Objetivo Geral</span>
          </h2>
          <p className="leading-relaxed text-lg opacity-90">
            Desenvolver um <strong>sistema IoT</strong> para monitorar e analisar
            os níveis de ruído em salas de aula, promovendo{" "}
            <strong>saúde mental</strong>, <strong>disciplina</strong> e{" "}
            <strong>engajamento pedagógico</strong>.
          </p>
          <h3 className="text-2xl font-semibold mt-6 text-[color:var(--text)]">
            Objetivos Específicos
          </h3>
          <ul className="list-disc ml-6 space-y-2 text-lg opacity-90">
            <li>Medir continuamente os níveis de ruído com ESP32 e sensor de som.</li>
            <li>Fornecer feedback visual imediato via LEDs coloridos.</li>
            <li>Armazenar dados no backend e exibir em dashboard web.</li>
            <li>Gerar gráficos e estatísticas para acompanhamento.</li>
            <li>Aplicar <strong>métodos estatísticos</strong> na análise dos dados.</li>
            <li>Explorar a <strong>dosimetria sonora</strong> (exposição acumulada).</li>
            <li>Tornar o monitoramento <strong>lúdico e educativo</strong>.</li>
          </ul>
        </div>
        <div className="md:w-1/2">
          <div className="card-ouviot p-6 bg-[#E7F9DF]/70">
            <h4 className="text-xl font-semibold text-[#6A4C93] mb-2">Relevância</h4>
            <p className="text-lg opacity-90">
              O OuvIoT alia <strong>tecnologia</strong> e{" "}
              <strong>educação</strong> para transformar o cotidiano escolar em
              um espaço de <em>escuta consciente</em> e <em>aprendizagem saudável</em>.
            </p>
          </div>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10">
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-[color:var(--text)]">
            📈 Resultados Esperados
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-lg opacity-90">
            <li>Redução dos níveis de ruído pela conscientização dos alunos.</li>
            <li>Histórico de dados para apoio pedagógico e coordenação.</li>
            <li>Ferramenta educativa baseada em <strong>estatísticas sonoras</strong>.</li>
            <li>Maior <strong>engajamento</strong> dos alunos em autorregulação.</li>
            <li>Potencial de expansão para <em>outros ambientes coletivos</em>.</li>
          </ul>
        </div>
        <div className="md:w-1/2">
          <div className="card-ouviot bg-[#EAF6FF]/80 p-6">
            <p className="text-lg italic text-[color:var(--text)]">
              “Cada dado coletado é um passo rumo a salas mais equilibradas e acolhedoras.”
            </p>
          </div>
        </div>
      </div>

      {/* CONCLUSÃO */}
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold gradient-text">Conclusão</h2>
        <p className="max-w-4xl mx-auto text-lg opacity-90 leading-relaxed">
          O sensor de ruído inteligente para salas de aula une{" "}
          <strong>tecnologia, saúde e educação</strong> em uma solução inovadora.  
          Mais do que medir sons, o OuvIoT propõe transformar dados em{" "}
          <strong>ferramentas pedagógicas</strong> de conscientização e engajamento.
        </p>
        <p className="max-w-3xl mx-auto text-lg opacity-90">
          Assim, o projeto contribui para a{" "}
          <strong>melhoria do ambiente escolar</strong>, fortalece o{" "}
          <strong>bem-estar mental</strong> e demonstra a aplicabilidade prática
          da <em>Internet das Coisas</em> e da <em>análise estatística</em> em
          contextos sociais reais.
        </p>
      </div>
    </section>
  );
}
