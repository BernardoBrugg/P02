"use client";

import { useState, useEffect } from "react";
import MathRenderer from "../../components/MathRenderer";
import { Nav } from "../../components/Nav";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { toast } from 'react-toastify';

interface QueueMetrics {
  lambda: number;
  mu: number;
  rho: number;
  L: number;
  Lq: number;
  W: number;
  Wq: number;
  P: number[];
  numServers: number;
}

interface CaseStudy {
  name: string;
  description: string;
  metrics: QueueMetrics;
  chartData: { time: number; arrivals: number; departures: number }[];
}

interface StoredService {
  id: string;
  name: string;
  arrivalQueue: string;
  serviceQueue: string;
  metrics: {
    lambda: number;
    mu: number;
    rho: number;
    L: number;
    Lq: number;
    W: number;
    Wq: number;
    P: number[];
    numServers: number;
  };
  serviceTimes: number[];
  waitingTimes: number[];
  idleTimes: number[];
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
      numServers: 1,
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
      numServers: 1,
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
      numServers: 1,
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
  {
    name: "Estudo de Caso 4: Sistema M/M/2 Estável",
    description:
      "Sistema com dois servidores, λ = 0.8 clientes/min, μ = 0.5 clientes/min por servidor. ρ = 0.8, sistema estável com múltiplos servidores.",
    metrics: {
      lambda: 0.8,
      mu: 0.5,
      rho: 0.8,
      L: 4.4444,
      Lq: 2.8444,
      W: 5.5555,
      Wq: 3.5555,
      P: [
        0.1111, 0.1778, 0.1422, 0.1138, 0.091, 0.0727, 0.0582, 0.0466, 0.0373,
        0.0298, 0.0239,
      ],
      numServers: 2,
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
    name: "Estudo de Caso 5: Sistema M/M/3 Eficiente",
    description:
      "Sistema com três servidores, λ = 1.2 clientes/min, μ = 0.5 clientes/min por servidor. ρ = 0.8, demonstra eficiência com mais servidores.",
    metrics: {
      lambda: 1.2,
      mu: 0.5,
      rho: 0.8,
      L: 4.9875,
      Lq: 2.5875,
      W: 4.156,
      Wq: 2.156,
      P: [
        0.0562, 0.1348, 0.3234, 0.1294, 0.1066, 0.0852, 0.0681, 0.0545, 0.0436,
        0.0349, 0.0279,
      ],
      numServers: 3,
    },
    chartData: [
      { time: 0, arrivals: 0, departures: 0 },
      { time: 1, arrivals: 1, departures: 0 },
      { time: 2, arrivals: 2, departures: 1 },
      { time: 3, arrivals: 3, departures: 2 },
      { time: 4, arrivals: 3, departures: 3 },
      { time: 5, arrivals: 4, departures: 3 },
    ],
  },
];

export default function Simulations() {
  // Clean up localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("queueing-services");
      if (stored) {
        try {
          const services = JSON.parse(stored) as StoredService[];
          const cleaned = services.map((service) => ({
            ...service,
            metrics: {
              ...service.metrics,
              numServers: service.metrics.numServers || 1,
              P: service.metrics.P.map((p) =>
                typeof p === "number" && isFinite(p) ? p : 0
              ),
            },
          }));
          localStorage.setItem("queueing-services", JSON.stringify(cleaned));
        } catch (e) {
          console.error("Error cleaning localStorage:", e);
        }
      }
    }
  }, []);

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
      return stored
        ? (JSON.parse(stored) as StoredService[]).map((service) => ({
            ...service,
            metrics: {
              ...service.metrics,
              P: service.metrics.P.map((p) =>
                typeof p === "number" && isFinite(p) ? p : 0
              ),
            },
          }))
        : [];
    }
    return [];
  });

  const saveServices = (newServices: typeof services) => {
    setServices(newServices);
    localStorage.setItem("queueing-services", JSON.stringify(newServices));
  };

  const loadCaseStudy = (study: CaseStudy) => {
    const newService: StoredService = {
      id: crypto.randomUUID(),
      name: study.name,
      arrivalQueue: "Chegada Exemplo",
      serviceQueue: "Atendimento Exemplo",
      metrics: study.metrics,
      serviceTimes: [],
      waitingTimes: [],
      idleTimes: [],
    };
    saveServices([...services, newService]);
    toast.success(`Estudo de caso "${study.name}" carregado com sucesso!`);
  };

  const [customLambda, setCustomLambda] = useState(0.5);
  const [customMu, setCustomMu] = useState(1);
  const [customNumServers, setCustomNumServers] = useState(1);
  const [customMetrics, setCustomMetrics] = useState<QueueMetrics | null>(null);

  const [simLambda, setSimLambda] = useState(0.5);
  const [simMu, setSimMu] = useState(1);
  const [simNumServers, setSimNumServers] = useState(1);
  const [simTime, setSimTime] = useState(100);
  const [simResults, setSimResults] = useState<
    { time: number; queueLength: number }[] | null
  >(null);

  const calculateCustomMetrics = () => {
    const lambda = customLambda;
    const mu = customMu;
    const numServers = customNumServers;
    const rho = lambda / (numServers * mu);
    if (rho >= 1) {
      toast.error("Sistema instável (ρ >= 1).");
      return;
    }
    const N = 1000; // Large number for summation approximation
    const C = new Array(N + 1).fill(0);
    C[0] = 1;
    for (let n = 1; n <= N; n++) {
      if (n < numServers) {
        C[n] = C[n - 1] * (lambda / (n * mu));
      } else {
        C[n] = C[n - 1] * (lambda / (numServers * mu));
      }
    }
    let sumC = 0;
    for (let n = 0; n <= N; n++) {
      sumC += C[n];
    }
    const P0 = 1 / sumC;
    const P = C.map((c) => c * P0);
    let L = 0;
    for (let n = 0; n <= N; n++) {
      L += n * P[n];
    }
    let Lq = 0;
    for (let n = numServers; n <= N; n++) {
      Lq += (n - numServers) * P[n];
    }
    const W = L / lambda;
    const Wq = Lq / lambda;
    setCustomMetrics({ lambda, mu, rho, L, Lq, W, Wq, P, numServers });
  };

  const runSimulation = () => {
    const lambda = simLambda;
    const mu = simMu;
    const c = simNumServers;
    const rho = lambda / (c * mu);
    if (rho >= 1) {
      alert("Sistema instável (ρ >= 1). A simulação não pode ser executada.");
      return;
    }
    const totalTime = simTime;
    let currentTime = 0;
    let nextArrival = -Math.log(Math.random()) / lambda;
    const departures: number[] = new Array(c).fill(Infinity);
    const queue: number[] = []; // arrival times in queue
    let inService = 0;
    const data: { time: number; queueLength: number }[] = [];
    while (currentTime < totalTime) {
      // find next event
      const nextEventTime = Math.min(nextArrival, ...departures);
      if (nextEventTime > totalTime) break;
      // advance time
      currentTime = nextEventTime;
      // record queue length
      data.push({ time: currentTime, queueLength: queue.length + inService });
      if (nextEventTime === nextArrival) {
        // arrival
        queue.push(currentTime);
        nextArrival = currentTime + -Math.log(Math.random()) / lambda;
        // assign to server if available
        for (let i = 0; i < c; i++) {
          if (departures[i] === Infinity) {
            departures[i] = currentTime + -Math.log(Math.random()) / mu;
            inService++;
            queue.shift();
            break;
          }
        }
      } else {
        // departure
        for (let i = 0; i < c; i++) {
          if (departures[i] === nextEventTime) {
            departures[i] = Infinity;
            inService--;
            if (queue.length > 0) {
              departures[i] = currentTime + -Math.log(Math.random()) / mu;
              inService++;
              queue.shift();
            }
            break;
          }
        }
      }
    }
    setSimResults(data);
  };

  return (
    <>
      <Nav />
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
                      <MathRenderer math="\rho" />:{" "}
                      {study.metrics.rho.toFixed(2)}
                    </div>
                    <div>Servidores: {study.metrics.numServers}</div>
                    <div>L: {study.metrics.L.toFixed(2)}</div>
                    <div>
                      <MathRenderer math="L_q" />: {study.metrics.Lq.toFixed(2)}
                    </div>
                    <div>W: {study.metrics.W.toFixed(2)} s</div>
                    <div>
                      <MathRenderer math="W_q" />: {study.metrics.Wq.toFixed(2)}{" "}
                      s
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
                      <MathRenderer math="\mu" />:{" "}
                      {service.metrics.mu.toFixed(4)} atendimentos/s
                    </div>
                    <div>
                      <MathRenderer math="\rho" />:{" "}
                      {service.metrics.rho.toFixed(4)}
                    </div>
                    <div>L: {service.metrics.L.toFixed(4)}</div>
                    <div>
                      <MathRenderer math="L_q" />:{" "}
                      {service.metrics.Lq.toFixed(4)}
                    </div>
                    <div>W: {service.metrics.W.toFixed(4)} s</div>
                    <div>
                      <MathRenderer math="W_q" />:{" "}
                      {service.metrics.Wq.toFixed(4)} s
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
                      <Bar dataKey="p" fill="var(--chart-1)" />
                    </BarChart>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Simulação Personalizada
            </h2>
            <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[var(--text-primary)] mb-2">
                    <MathRenderer math="\lambda" /> (taxa de chegada)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customLambda}
                    onChange={(e) =>
                      setCustomLambda(parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--element-border)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-primary)] mb-2">
                    <MathRenderer math="\mu" /> (taxa de serviço por servidor)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customMu}
                    onChange={(e) => setCustomMu(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--element-border)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-primary)] mb-2">
                    Número de Servidores (c)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={customNumServers}
                    onChange={(e) =>
                      setCustomNumServers(parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--element-border)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
              </div>
              <button
                onClick={calculateCustomMetrics}
                className="px-6 py-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white rounded-xl font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Calcular Métricas
              </button>
            </div>
            {customMetrics && (
              <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                  Resultados da Simulação Personalizada
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <MathRenderer math="\lambda" />:{" "}
                    {customMetrics.lambda.toFixed(4)}
                  </div>
                  <div>
                    <MathRenderer math="\mu" />: {customMetrics.mu.toFixed(4)}
                  </div>
                  <div>
                    <MathRenderer math="\rho" />: {customMetrics.rho.toFixed(4)}
                  </div>
                  <div>Servidores: {customMetrics.numServers}</div>
                  <div>L: {customMetrics.L.toFixed(4)}</div>
                  <div>
                    <MathRenderer math="L_q" />: {customMetrics.Lq.toFixed(4)}
                  </div>
                  <div>W: {customMetrics.W.toFixed(4)} s</div>
                  <div>
                    <MathRenderer math="W_q" />: {customMetrics.Wq.toFixed(4)} s
                  </div>
                  <div>P0: {customMetrics.P[0].toFixed(4)}</div>
                </div>
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    Probabilidades P(n):
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {customMetrics.P.map((p, n) => (
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
                    data={customMetrics.P.map((p, n) => ({ n, p }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="n" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="p" fill="var(--chart-1)" />
                  </BarChart>
                </div>
                <button
                  onClick={() => {
                    const newService = {
                      name: `Simulação Personalizada M/M/${customNumServers}`,
                      arrivalQueue: "Chegada Personalizada",
                      serviceQueue: "Atendimento Personalizado",
                      metrics: customMetrics,
                    };
                    saveServices([...services, newService]);
                    alert("Simulação adicionada aos Serviços!");
                  }}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white rounded-xl font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Adicionar aos Serviços
                </button>
              </div>
            )}
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Simulação de Eventos Discretos
            </h2>
            <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-[var(--text-primary)] mb-2">
                    <MathRenderer math="\lambda" /> (taxa de chegada)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={simLambda}
                    onChange={(e) => setSimLambda(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--element-border)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-primary)] mb-2">
                    <MathRenderer math="\mu" /> (taxa de serviço por servidor)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={simMu}
                    onChange={(e) => setSimMu(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--element-border)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-primary)] mb-2">
                    Número de Servidores (c)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={simNumServers}
                    onChange={(e) => setSimNumServers(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--element-border)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-primary)] mb-2">
                    Tempo Total de Simulação
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={simTime}
                    onChange={(e) => setSimTime(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--element-border)] rounded-lg text-[var(--text-primary)]"
                  />
                </div>
              </div>
              <button
                onClick={runSimulation}
                className="px-6 py-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white rounded-xl font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Executar Simulação
              </button>
            </div>
            {simResults && (
              <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                  Resultados da Simulação
                </h3>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    Evolução do Comprimento da Fila ao Longo do Tempo
                  </h4>
                  <LineChart width={800} height={400} data={simResults}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="queueLength"
                      stroke="var(--chart-1)"
                    />
                  </LineChart>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
