"use client";

import MathRenderer from "../../components/MathRenderer";
import { Nav } from "../../components/Nav";
import { Card } from "../../components/ui/card";

export default function About() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--element-bg)] to-[var(--bg-gradient-end)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-8 text-center animate-slide-in-left">
            Sobre a Teoria das Filas na Pesquisa Operacional
          </h1>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Pesquisa Operacional
            </h2>
            <p className="text-[var(--text-primary)] text-lg leading-relaxed mb-4">
              A Pesquisa Operacional (PO) é uma área interdisciplinar da
              Engenharia de Produção, focada na aplicação de métodos analíticos
              avançados para auxiliar na tomada de decisões, oferecendo apoio
              matemático na resolução de problemas.
            </p>
            <Card className="p-4">
              <p className="text-[var(--text-secondary)] italic">
                &quot;Resolução de problemas reais envolvendo situações de
                tomada de decisão, através de modelos matemáticos habitualmente
                processados computacionalmente. Aplica conceitos e métodos de
                outras disciplinas científicas na concepção, no planejamento ou
                na operação de sistemas para atingir seus objetivos. Procura,
                assim, introduzir elementos de objetividade e racionalidade nos
                processos de tomada de decisão, sem descuidar dos elementos
                subjetivos e de enquadramento organizacional que caracterizam os
                problemas.&quot;
              </p>
              <p className="text-[var(--text-secondary)] mt-2 text-sm">
                — Associação Brasileira de Engenharia de Produção (ABEPRO, 2025)
              </p>
            </Card>
            <p className="text-[var(--text-primary)] mt-4">
              Diante deste contexto, a Teoria das Filas surge como uma aplicação
              essencial e técnica chave dentro da PO, usada para modelar,
              analisar e otimizar o comportamento de sistemas complexos onde
              eventos ocorrem em pontos específicos no tempo.
            </p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Teoria das Filas
            </h2>
            <p className="text-[var(--text-primary)] leading-relaxed mb-4">
              A simulação de eventos discretos é uma técnica essencial dentro da
              pesquisa operacional, usada para modelar, analisar e otimizar o
              comportamento de sistemas complexos onde eventos ocorrem em pontos
              específicos no tempo. Na Teoria das Filas, que é fundamental para
              entender muitos sistemas de atendimento, como bancos, hospitais e,
              no contexto deste estudo, vias de trânsito de veículos, as filas
              são analisadas para prever tempos de espera, utilização de
              recursos e capacidade de atendimento.
            </p>
            <p className="text-[var(--text-primary)] leading-relaxed">
              &quot;A determinação dos parâmetros de operação do sistema seguiu
              a teoria registrada nas notas de aula da disciplina Probabilidade
              e Modelos Estocásticos, do segundo semestre letivo de 2025. Como
              ponto de partida, após a medição dos parâmetros λ (tempo de
              chegada) e μ (tempo de atendimento), foram definidos os estados da
              fila, de P0 a P10, que são indicadores da probabilidade de ter (ou
              não) clientes no sistema. Uma vez conhecido P0, as probabilidades
              Pn, de existirem &apos;N&apos; clientes simultâneos, são
              calculadas em sequência de maneira recursiva. Uma vez conhecidas
              as probabilidades de estado, os demais parâmetros de desempenho do
              sistema são calculados utilizando as equações teóricas
              pertinentes.&quot;
            </p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Funcionalidades Principais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-[var(--element-bg)] p-8 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300 group">
                <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
                  Cronômetros
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Adicione filas e meça tempos de chegada e saída de clientes em
                  tempo real.
                </p>
              </Card>
              <Card className="bg-[var(--element-bg)] p-8 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300 group">
                <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
                  Dados
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Visualize, importe e exporte dados coletados para análise
                  externa.
                </p>
              </Card>
              <Card className="bg-[var(--element-bg)] p-8 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300 group">
                <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
                  Painéis
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Calcule e explore métricas de desempenho com gráficos
                  interativos.
                </p>
              </Card>
              <Card className="bg-[var(--element-bg)] p-8 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300 group">
                <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
                  Simulações
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Carregue estudos de caso pré-definidos para comparar cenários
                  diferentes.
                </p>
              </Card>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Conceitos Fundamentais da Teoria das Filas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-[var(--element-bg)] p-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  Elementos de um Sistema de Filas
                </h3>
                <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1">
                  <li>
                    <strong>Clientes</strong>: Entidades que chegam ao sistema
                    para receber serviço (pessoas, veículos, pacotes de dados,
                    etc.).
                  </li>
                  <li>
                    <strong>Fila</strong>: Local de espera onde os clientes
                    aguardam se o servidor estiver ocupado.
                  </li>
                  <li>
                    <strong>Servidor</strong>: Recurso que atende os clientes
                    (caixa de banco, médico, processador, etc.).
                  </li>
                  <li>
                    <strong>Disciplina de Fila</strong>: Regra para ordenar os
                    clientes na fila (ex.: FIFO - Primeiro a Chegar, Primeiro a
                    Ser Atendido).
                  </li>
                </ul>
              </Card>
              <Card className="bg-[var(--element-bg)] p-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  Processos Estocásticos
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  A Teoria das Filas lida com incertezas, modelando chegadas e
                  serviços como processos aleatórios. O modelo M/M/1 assume:
                </p>
                <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1">
                  <li>
                    Chegadas seguem um Processo de Poisson (exponencialmente
                    distribuído).
                  </li>
                  <li>Tempos de serviço são exponencialmente distribuídos.</li>
                  <li>Um único servidor.</li>
                  <li>Capacidade infinita da fila.</li>
                </ul>
              </Card>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Parâmetros e Fórmulas Calculadas
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Probabilidades de Estado
                </h3>
                <p className="text-[var(--text-secondary)] mb-2">
                  As probabilidades de equilíbrio são calculadas usando
                  coeficientes C_n e a probabilidade P_0.
                </p>
                <Card className="bg-[var(--element-bg)] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                  <p className="text-[var(--text-primary)]">
                    <strong>Coeficiente :</strong>{" "}
                    <MathRenderer math="C_n = \prod_{k=1}^{n} \frac{\mu_k}{\lambda_k}" />
                  </p>
                  <p className="text-[var(--text-primary)]">
                    <strong>Probabilidade :</strong>{" "}
                    <MathRenderer math="P_n = C_n \cdot P_0" />
                  </p>
                  <p className="text-[var(--text-primary)]">
                    <strong>Probabilidade  (normalização):</strong>{" "}
                    <MathRenderer math="P_0 = \frac{1}{1 + \sum_{n=1}^{\infty} C_n}" />
                  </p>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Número Esperado de Clientes no Sistema (L)
                </h3>
                <p className="text-[var(--text-secondary)] mb-2">
                  Soma ponderada do número de clientes em cada estado.
                </p>
                <Card className="bg-[var(--element-bg)] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                  <p className="text-[var(--text-primary)]">
                    <MathRenderer math="L = \sum_{n=0}^{\infty} n \cdot P_n" />
                  </p>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Número Esperado de Clientes na Fila (Lq)
                </h3>
                <p className="text-[var(--text-secondary)] mb-2">
                  Somatório do produto do número de clientes em espera pela
                  probabilidade de cada estado, onde s é o número de servidores.
                </p>
                <Card className="bg-[var(--element-bg)] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                  <p className="text-[var(--text-primary)]">
                    <MathRenderer math="L_q = \sum_{n=s}^{\infty} (n - s) \cdot P_n" />
                  </p>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Taxa Média de Clientes Entrando no Sistema (λ)
                </h3>
                <p className="text-[var(--text-secondary)] mb-2">
                  Usada quando as taxas de chegada λ_n não são iguais.
                </p>
                <Card className="bg-[var(--element-bg)] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                  <p className="text-[var(--text-primary)]">
                    <MathRenderer math="\lambda = \sum_{n=0}^{\infty} \lambda_n \cdot P_n" />
                  </p>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Tempo Esperado no Sistema (W)
                </h3>
                <p className="text-[var(--text-secondary)] mb-2">
                  Razão entre L e λ.
                </p>
                <Card className="bg-[var(--element-bg)] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                  <p className="text-[var(--text-primary)]">
                    <MathRenderer math="W = \frac{L}{\lambda}" />
                  </p>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Tempo Esperado na Fila (Wq)
                </h3>
                <p className="text-[var(--text-secondary)] mb-2">
                  Razão entre Lq e λ.
                </p>
                <Card className="bg-[var(--element-bg)] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                  <p className="text-[var(--text-primary)]">
                    <MathRenderer math="W_q = \frac{L_q}{\lambda}" />
                  </p>
                </Card>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Interpretação dos Gráficos
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Gráfico Cumulativo
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Mostra a evolução temporal das chegadas e saídas acumuladas.
                  Permite visualizar o fluxo de clientes ao longo do tempo,
                  identificando períodos de pico ou equilíbrio.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Gráfico de Probabilidades P(n)
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Barras representando a distribuição de estados. Ajuda a
                  entender a probabilidade de diferentes níveis de ocupação,
                  crucial para dimensionar recursos.
                </p>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Aplicações Práticas
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              A Teoria das Filas é aplicada em diversos campos para otimizar
              sistemas de espera, incluindo atendimento ao cliente, tráfego e
              transporte, sistemas computacionais e saúde. O aplicativo permite
              coletar dados reais e aplicar essas fórmulas para tomar decisões
              informadas.
            </p>
          </div>
          <div className="text-center">
            <p className="text-[var(--text-secondary)]">
              Explore o aplicativo para aplicar esses conceitos na prática e
              melhorar o desempenho de sistemas reais.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
