import React from "react";
import MathRenderer from "./MathRenderer";

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

interface MetricsResultsProps {
  results: QueueMetrics | null;
  newServiceName: string;
  setNewServiceName: (value: string) => void;
  createService: () => void;
}

export function MetricsResults({
  results,
  newServiceName,
  setNewServiceName,
  createService,
}: MetricsResultsProps) {
  if (!results) return null;

  return (
    <div className="mt-6 p-4 bg-[var(--element-bg)] border border-[var(--element-border)] rounded-xl">
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
        Resultados Calculados
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <MathRenderer math="\lambda" />:{" "}
          {isFinite(results.lambda) ? results.lambda.toFixed(4) : "N/A"}{" "}
          chegadas/s
        </div>
        <div>
          <MathRenderer math="\mu" />:{" "}
          {isFinite(results.mu) ? results.mu.toFixed(4) : "N/A"} atendimentos/s
        </div>
        <div>
          <MathRenderer math="\rho" />:{" "}
          {isFinite(results.rho) ? results.rho.toFixed(4) : "N/A"}
        </div>
        <div>L: {isFinite(results.L) ? results.L.toFixed(4) : "N/A"}</div>
        <div>
          <MathRenderer math="L_q" />:{" "}
          {isFinite(results.Lq) ? results.Lq.toFixed(4) : "N/A"}
        </div>
        <div>W: {isFinite(results.W) ? results.W.toFixed(4) : "N/A"} s</div>
        <div>
          <MathRenderer math="W_q" />:{" "}
          {isFinite(results.Wq) ? results.Wq.toFixed(4) : "N/A"} s
        </div>
        <div>
          P0:{" "}
          {results.P[0] !== null && isFinite(results.P[0])
            ? results.P[0].toFixed(4)
            : "N/A"}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Probabilidades P(n):
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {results.P.map((p, n) => (
            <div key={n}>
              P({n}): {p !== null && isFinite(p) ? p.toFixed(4) : "N/A"}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
          placeholder="Nome do serviço"
          className="flex-1 px-4 py-2 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
        />
        <button
          onClick={createService}
          className="px-6 py-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white rounded-xl font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Salvar Serviço
        </button>
      </div>
    </div>
  );
}
