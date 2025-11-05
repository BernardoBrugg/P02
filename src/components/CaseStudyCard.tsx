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
  numServers: number;
}

interface CaseStudy {
  name: string;
  description: React.ReactNode;
  metrics: QueueMetrics;
  chartData: { time: number; arrivals: number; departures: number }[];
}

interface CaseStudyCardProps {
  study: CaseStudy;
  onLoad: (study: CaseStudy) => void;
}

export function CaseStudyCard({ study, onLoad }: CaseStudyCardProps) {
  return (
    <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        {study.name}
      </h3>
      <p className="text-[var(--text-secondary)] mb-4">{study.description}</p>
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
        <div>Servidores: {study.metrics.numServers}</div>
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
        onClick={() => onLoad(study)}
        className="w-full px-4 py-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white rounded-xl font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Carregar Estudo
      </button>
    </div>
  );
}
