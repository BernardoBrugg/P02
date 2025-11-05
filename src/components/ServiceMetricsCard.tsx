import React from "react";
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

interface ServiceMetricsCardProps {
  service: {
    name: string;
    arrivalQueue: string;
    serviceQueue: string;
    metrics: QueueMetrics;
  };
}

export function ServiceMetricsCard({ service }: ServiceMetricsCardProps) {
  return (
    <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
        {service.name}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <MathRenderer math="\lambda" />: {service.metrics.lambda.toFixed(4)}{" "}
          chegadas/s
        </div>
        <div>
          <MathRenderer math="\mu" />: {service.metrics.mu.toFixed(4)}{" "}
          atendimentos/s
        </div>
        <div>
          <MathRenderer math="\rho" />: {service.metrics.rho.toFixed(4)}
        </div>
        <div>L: {service.metrics.L.toFixed(4)}</div>
        <div>
          <MathRenderer math="L_q" />: {service.metrics.Lq.toFixed(4)}
        </div>
        <div>W: {service.metrics.W.toFixed(4)} s</div>
        <div>
          <MathRenderer math="W_q" />: {service.metrics.Wq.toFixed(4)} s
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
  );
}
