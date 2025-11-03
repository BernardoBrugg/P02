"use client";

import MathRenderer from "../../components/MathRenderer";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--element-bg)] to-[var(--bg-gradient-end)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] mb-8 text-center animate-slide-in-left">
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
          <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-4 rounded-xl">
            <p className="text-[var(--text-secondary)] italic">
              &quot;Resolução de problemas reais envolvendo situações de tomada
              de decisão, através de modelos matemáticos habitualmente
              processados computacionalmente. Aplica conceitos e métodos de
              outras disciplinas científicas na concepção, no planejamento ou na
              operação de sistemas para atingir seus objetivos. Procura, assim,
              introduzir elementos de objetividade e racionalidade nos processos
              de tomada de decisão, sem descuidar dos elementos subjetivos e de
              enquadramento organizacional que caracterizam os problemas.&quot;
            </p>
            <p className="text-[var(--text-secondary)] mt-2 text-sm">
              — Associação Brasileira de Engenharia de Produção (ABEPRO, 2025)
            </p>
          </div>
          <p className="text-[var(--text-primary)] mt-4">
            Diante deste contexto, a Teoria das Filas surge como uma aplicação
            essencial e técnica chave dentro da PO, usada para modelar, analisar
            e otimizar o comportamento de sistemas complexos onde eventos
            ocorrem em pontos específicos no tempo.
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
            no contexto deste estudo, vias de trânsito de veículos, as filas são
            analisadas para prever tempos de espera, utilização de recursos e
            capacidade de atendimento.
          </p>
          <p className="text-[var(--text-primary)] leading-relaxed">
            &quot;A determinação dos parâmetros de operação do sistema seguiu a
            teoria registrada nas notas de aula da disciplina Probabilidade e
            Modelos Estocásticos, do segundo semestre letivo de 2025. Como ponto
            de partida, após a medição dos parâmetros λ (tempo de chegada) e μ
            (tempo de atendimento), foram definidos os estados da fila, de P0 a
            P10, que são indicadores da probabilidade de ter (ou não) clientes
            no sistema. Uma vez conhecido P0, as probabilidades Pn, de existirem
            &apos;N&apos; clientes simultâneos, são calculadas em sequência de maneira
            recursiva. Uma vez conhecidas as probabilidades de estado, os demais
            parâmetros de desempenho do sistema são calculados utilizando as
            equações teóricas pertinentes.&quot;
          </p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Funcionalidades Principais do Aplicativo
          </h2>
          <ul className="list-disc list-inside text-[var(--text-primary)] space-y-2">
            <li>
              <strong>Cronômetros</strong>: Adicione filas e meça tempos de
              chegada e saída de clientes em tempo real.
            </li>
            <li>
              <strong>Dados</strong>: Visualize, importe e exporte dados
              coletados para análise externa.
            </li>
            <li>
              <strong>Painéis</strong>: Calcule e explore métricas de desempenho
              com gráficos interativos.
            </li>
            <li>
              <strong>Simulações</strong>: Carregue estudos de caso
              pré-definidos para comparar cenários diferentes.
            </li>
          </ul>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Conceitos Fundamentais da Teoria das Filas
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
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
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Processos Estocásticos
              </h3>
              <p className="text-[var(--text-secondary)]">
                A Teoria das Filas lida com incertezas, modelando chegadas e
                serviços como processos aleatórios. O modelo M/M/1 assume:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1 ml-4">
                <li>
                  Chegadas seguem um Processo de Poisson (exponencialmente
                  distribuído).
                </li>
                <li>Tempos de serviço são exponencialmente distribuídos.</li>
                <li>Um único servidor.</li>
                <li>Capacidade infinita da fila.</li>
              </ul>
            </div>
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
                Após medir λ e μ, definem-se os estados P0 a P10. P0 é a
                probabilidade do sistema vazio, e Pn é calculada recursivamente.
              </p>
              <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-4 rounded-xl">
                <p className="text-[var(--text-primary)]">
                  <strong>P0:</strong> <MathRenderer math="P_0 = 1 - \rho" />
                </p>
                <p className="text-[var(--text-primary)]">
                  <strong>Pn:</strong> <MathRenderer math="P_n = P_0 \rho^n" />
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Número Médio de Clientes no Sistema (L)
              </h3>
              <p className="text-[var(--text-secondary)] mb-2">
                Soma ponderada do número de clientes em cada estado.
              </p>
              <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-4 rounded-xl">
                <p className="text-[var(--text-primary)]">
                  <MathRenderer math="L = \sum_{n=0}^{\infty} n \cdot P_n" />
                </p>
                <p className="text-[var(--text-secondary)]">
                  Para M/M/1: <MathRenderer math="L = \frac{\rho}{1 - \rho}" />
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Número Médio de Clientes na Fila (Lq)
              </h3>
              <p className="text-[var(--text-secondary)] mb-2">
                Somatório do produto do número de clientes em espera pela
                probabilidade de cada estado.
              </p>
              <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-4 rounded-xl">
                <p className="text-[var(--text-primary)]">
                  <MathRenderer math="L_q = \sum_{n=1}^{\infty} (n-1) \cdot P_n" />
                </p>
                <p className="text-[var(--text-secondary)]">
                  Para M/M/1:{" "}
                  <MathRenderer math="L_q = \frac{\rho^2}{1 - \rho}" />
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Tempo Médio no Sistema (W)
              </h3>
              <p className="text-[var(--text-secondary)] mb-2">
                Razão entre L e λ.
              </p>
              <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-4 rounded-xl">
                <p className="text-[var(--text-primary)]">
                  <MathRenderer math="W = \frac{L}{\lambda}" />
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Tempo Médio na Fila (Wq)
              </h3>
              <p className="text-[var(--text-secondary)] mb-2">
                Razão entre Lq e λ.
              </p>
              <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-4 rounded-xl">
                <p className="text-[var(--text-primary)]">
                  <MathRenderer math="W_q = \frac{L_q}{\lambda}" />
                </p>
              </div>
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
                Barras representando a distribuição de estados. Ajuda a entender
                a probabilidade de diferentes níveis de ocupação, crucial para
                dimensionar recursos.
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
  );
}
