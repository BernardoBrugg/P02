"use client";

import { useState } from "react";
import MathRenderer from "../../components/MathRenderer";
import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

interface QueueMetrics {
  lambda: number;
  mu: number;
  rho: number;
  L: number;
  Lq: number;
  W: number;
  Wq: number;
  P: number[];
}

interface CaseStudy {
  name: string;
  description: string;
  metrics: QueueMetrics;
  chartData: { time: number; arrivals: number; departures: number }[];
}

const caseStudies: CaseStudy[] = [
  {
    name: "Estudo de Caso 1: Sistema M/M/1 Estável",
    description:
      "Um sistema de fila simples com taxa de chegada λ = 0.5 clientes/min e taxa de serviço μ = 1 cliente/min. Sistema estável com ρ = 0.5.",
    metrics: {
      lambda: 0.5,
      mu: 1,
      rho: 0.5,
      L: 1,
      Lq: 0.5,
      W: 2,
      Wq: 1,
      P: [
        0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125, 0.00390625,
        0.001953125, 0.0009765625, 0.00048828125,
      ],
    },
    chartData: [
      { time: 0, arrivals: 0, departures: 0 },
      { time: 1, arrivals: 1, departures: 0 },
      { time: 2, arrivals: 1, departures: 1 },
      { time: 3, arrivals: 2, departures: 1 },
      { time: 4, arrivals: 2, departures: 2 },
      { time: 5, arrivals: 3, departures: 2 },
    ],
  },
  {
    name: "Estudo de Caso 2: Sistema M/M/1 Sobrecarregado",
    description:
      "Sistema com alta utilização ρ = 0.8, λ = 0.8, μ = 1. Mostra o impacto da sobrecarga.",
    metrics: {
      lambda: 0.8,
      mu: 1,
      rho: 0.8,
      L: 4,
      Lq: 3.2,
      W: 5,
      Wq: 4,
      P: [
        0.2, 0.16, 0.128, 0.1024, 0.08192, 0.065536, 0.0524288, 0.04194304,
        0.033554432, 0.0268435456, 0.02147483648,
      ],
    },
    chartData: [
      { time: 0, arrivals: 0, departures: 0 },
      { time: 1, arrivals: 1, departures: 0 },
      { time: 2, arrivals: 2, departures: 0 },
      { time: 3, arrivals: 3, departures: 0 },
      { time: 4, arrivals: 4, departures: 1 },
      { time: 5, arrivals: 5, departures: 1 },
    ],
  },
  {
    name: "Estudo de Caso 3: Sistema Eficiente",
    description:
      "Sistema com baixa espera, λ = 0.2, μ = 2. ρ = 0.1, muito eficiente.",
    metrics: {
      lambda: 0.2,
      mu: 2,
      rho: 0.1,
      L: 0.1111,
      Lq: 0.01111,
      W: 0.5556,
      Wq: 0.0556,
      P: [
        0.9, 0.09, 0.009, 0.0009, 0.00009, 0.000009, 0.0000009, 0.00000009,
        0.000000009, 0.0000000009, 0.00000000009,
      ],
    },
    chartData: [
      { time: 0, arrivals: 0, departures: 0 },
      { time: 1, arrivals: 1, departures: 1 },
      { time: 2, arrivals: 1, departures: 1 },
      { time: 3, arrivals: 2, departures: 2 },
      { time: 4, arrivals: 2, departures: 2 },
      { time: 5, arrivals: 3, departures: 3 },
    ],
  },
];

export default function Simulations() {
  const [services, setServices] = useState<
    {
      name: string;
      arrivalQueue: string;
      serviceQueue: string;
      metrics: QueueMetrics;
    }[]
  >(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("queueing-services");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const saveServices = (newServices: typeof services) => {
    setServices(newServices);
    localStorage.setItem("queueing-services", JSON.stringify(newServices));
  };

  const loadCaseStudy = (study: CaseStudy) => {
    const newService = {
      name: study.name,
      arrivalQueue: "Chegada Exemplo",
      serviceQueue: "Atendimento Exemplo",
      metrics: study.metrics,
    };
    saveServices([...services, newService]);
    alert(`Estudo de caso "${study.name}" carregado com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--element-bg)] to-[var(--bg-gradient-end)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] mb-8 text-center animate-slide-in-left">
          Simulações e Estudos de Caso
        </h1>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Estudos de Caso Pré-definidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  {study.name}
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  {study.description}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <MathRenderer math="\lambda" />: {study.metrics.lambda}
                  </div>
                  <div>
                    <MathRenderer math="\mu" />: {study.metrics.mu}
                  </div>
                  <div>
                    <MathRenderer math="\rho" />: {study.metrics.rho.toFixed(2)}
                  </div>
                  <div>L: {study.metrics.L.toFixed(2)}</div>
                  <div>
                    <MathRenderer math="L_q" />: {study.metrics.Lq.toFixed(2)}
                  </div>
                  <div>W: {study.metrics.W.toFixed(2)} s</div>
                  <div>
                    <MathRenderer math="W_q" />: {study.metrics.Wq.toFixed(2)} s
                  </div>
                </div>
                <button
                  onClick={() => loadCaseStudy(study)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white rounded-xl font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Carregar Estudo
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Serviços Carregados
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                  {service.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <MathRenderer math="\lambda" />:{" "}
                    {service.metrics.lambda.toFixed(4)} chegadas/s
                  </div>
                  <div>
                    <MathRenderer math="\mu" />: {service.metrics.mu.toFixed(4)}{" "}
                    atendimentos/s
                  </div>
                  <div>
                    <MathRenderer math="\rho" />:{" "}
                    {service.metrics.rho.toFixed(4)}
                  </div>
                  <div>L: {service.metrics.L.toFixed(4)}</div>
                  <div>
                    <MathRenderer math="L_q" />: {service.metrics.Lq.toFixed(4)}
                  </div>
                  <div>W: {service.metrics.W.toFixed(4)} s</div>
                  <div>
                    <MathRenderer math="W_q" />: {service.metrics.Wq.toFixed(4)}{" "}
                    s
                  </div>
                  <div>P0: {service.metrics.P[0].toFixed(4)}</div>
                </div>
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    Probabilidades P(n):
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {service.metrics.P.map((p, n) => (
                      <div key={n}>
                        P({n}): {p.toFixed(4)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    Gráfico de Probabilidades P(n)
                  </h4>
                  <BarChart
                    width={800}
                    height={300}
                    data={service.metrics.P.map((p, n) => ({ n, p }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="n" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="p" fill="#8884d8" />
                  </BarChart>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
