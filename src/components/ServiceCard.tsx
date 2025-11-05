import React from "react";
import MathRenderer from "./MathRenderer";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

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

interface Service {
  name: string;
  arrivalQueue: string;
  serviceQueue: string;
  metrics: QueueMetrics;
}

interface ChartDataPoint {
  time: number;
  arrivals: number;
  departures: number;
}

interface ServiceCardProps {
  service: Service;
  index: number;
  deleteService: (index: number) => void;
  exportServiceToPDF: (service: Service) => void;
  getCumulativeData: (service: Service) => ChartDataPoint[];
}

export function ServiceCard({
  service,
  index,
  deleteService,
  exportServiceToPDF,
  getCumulativeData,
}: ServiceCardProps) {
  return (
    <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
        {service.name}
      </h3>
      <p className="text-[var(--text-secondary)] mb-2">
        Fila de Chegada: {service.arrivalQueue}
      </p>
      <p className="text-[var(--text-secondary)] mb-4">
        Fila de Atendimento: {service.serviceQueue}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-[var(--text-secondary)]">
          <span className="font-semibold">λ:</span>{" "}
          {isFinite(service.metrics.lambda)
            ? service.metrics.lambda.toFixed(4)
            : "N/A"}{" "}
          chegadas/s
        </div>
        <div className="text-[var(--text-secondary)]">
          <span className="font-semibold">μ:</span>{" "}
          {isFinite(service.metrics.mu) ? service.metrics.mu.toFixed(4) : "N/A"}{" "}
          atendimentos/s
        </div>
        <div className="text-[var(--text-secondary)]">
          <span className="font-semibold">ρ:</span>{" "}
          {isFinite(service.metrics.rho)
            ? service.metrics.rho.toFixed(4)
            : "N/A"}
        </div>
        <div className="text-[var(--text-secondary)]">
          <span className="font-semibold">L:</span>{" "}
          {isFinite(service.metrics.L) ? service.metrics.L.toFixed(4) : "N/A"}
        </div>
        <div className="text-[var(--text-secondary)]">
          <span className="font-semibold">Lq:</span>{" "}
          {isFinite(service.metrics.Lq) ? service.metrics.Lq.toFixed(4) : "N/A"}
        </div>
        <div className="text-[var(--text-secondary)]">
          <span className="font-semibold">W:</span>{" "}
          {isFinite(service.metrics.W) ? service.metrics.W.toFixed(4) : "N/A"} s
        </div>
        <div className="text-[var(--text-secondary)]">
          <span className="font-semibold">Wq:</span>{" "}
          {isFinite(service.metrics.Wq) ? service.metrics.Wq.toFixed(4) : "N/A"}{" "}
          s
        </div>
        <div className="text-[var(--text-secondary)]">
          <span className="font-semibold">P0:</span>{" "}
          {service.metrics.P[0] !== null && isFinite(service.metrics.P[0])
            ? service.metrics.P[0].toFixed(4)
            : "N/A"}
        </div>
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Probabilidades P(n):
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {service.metrics.P.map((p, n) => (
            <div key={n}>
              P({n}): {p !== null && isFinite(p) ? p.toFixed(4) : "N/A"}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Gráfico de Probabilidades P(n)
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={service.metrics.P.map((p, n) => ({
              n,
              p: p !== null ? p : 0,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="n" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="p" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Gráfico Cumulativo
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart width={800} height={300} data={getCumulativeData(service)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="arrivals"
              stroke="#8884d8"
              name="Chegadas Cumulativas"
            />
            <Line
              type="monotone"
              dataKey="departures"
              stroke="#82ca9d"
              name="Saídas Cumulativas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => deleteService(index)}
          className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Excluir Serviço
        </button>
        <button
          onClick={() => exportServiceToPDF(service)}
          className="px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Exportar para PDF
        </button>
      </div>
    </div>
  );
}
