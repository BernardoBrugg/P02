import React, { useState } from "react";
import MathRenderer from "./MathRenderer";
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
  numServers: number;
}

interface CustomSimulationProps {
  onAddService: (service: {
    name: string;
    arrivalQueue: string;
    serviceQueue: string;
    metrics: QueueMetrics;
  }) => void;
}

export function CustomSimulation({ onAddService }: CustomSimulationProps) {
  const [customLambda, setCustomLambda] = useState(0.5);
  const [customMu, setCustomMu] = useState(1);
  const [customNumServers, setCustomNumServers] = useState(1);
  const [customMetrics, setCustomMetrics] = useState<QueueMetrics | null>(null);

  const calculateCustomMetrics = () => {
    const lambda = customLambda;
    const mu = customMu;
    const numServers = customNumServers;
    const rho = lambda / (numServers * mu);
    if (rho >= 1) {
      alert("Sistema instável (ρ >= 1).");
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

  return (
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
              onChange={(e) => setCustomLambda(parseFloat(e.target.value))}
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
              onChange={(e) => setCustomNumServers(parseInt(e.target.value))}
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
              <MathRenderer math="\lambda" />: {customMetrics.lambda.toFixed(4)}
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
              onAddService(newService);
              alert("Simulação adicionada aos Serviços!");
            }}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white rounded-xl font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Adicionar aos Serviços
          </button>
        </div>
      )}
    </div>
  );
}
