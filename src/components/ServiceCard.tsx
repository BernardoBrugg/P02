import React from "react";
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
import { Service } from "../lib/types";

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
  const histogramData = React.useMemo(() => {
    if (!service.serviceTimes || service.serviceTimes.length === 0) return [];
    const bins = 10;
    const min = Math.min(...service.serviceTimes);
    const max = Math.max(...service.serviceTimes);
    const binSize = (max - min) / bins;
    const data = [];
    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binSize;
      const binEnd = min + (i + 1) * binSize;
      const count = service.serviceTimes.filter(
        (t) => t >= binStart && t < binEnd
      ).length;
      data.push({ bin: `${binStart.toFixed(2)}-${binEnd.toFixed(2)}`, count });
    }
    return data;
  }, [service.serviceTimes]);

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
          {service.metrics.P?.[0] !== null && isFinite(service.metrics.P?.[0])
            ? service.metrics.P[0].toFixed(4)
            : "N/A"}
        </div>
        <div className="text-[var(--text-secondary)]">
          <span className="font-semibold">Tempo Ocioso Médio:</span>{" "}
          {isFinite(service.metrics.idleTime)
            ? service.metrics.idleTime.toFixed(4)
            : "N/A"}{" "}
          s
        </div>
        <div className="text-[var(--text-secondary)]">
          <span className="font-semibold">Proporção Ociosa:</span>{" "}
          {isFinite(service.metrics.idleProportion)
            ? service.metrics.idleProportion.toFixed(4)
            : "N/A"}
        </div>
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Probabilidades P(n):
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {service.metrics.P?.map((p, n) => (
            <div key={n}>
              P({n}): {p !== null && isFinite(p) ? p.toFixed(4) : "N/A"}
            </div>
          )) || <div>No P data available</div>}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Gráfico de Probabilidades P(n)
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={
              service.metrics.P?.map((p, n) => ({
                n,
                p: p !== null ? p : 0,
              })) || []
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="n" />
            <YAxis
              label={{
                value: "Probabilidade",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Bar dataKey="p" fill="var(--chart-1)" />
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
            <XAxis
              dataKey="time"
              label={{ value: "Tempo (s)", position: "insideBottom" }}
            />
            <YAxis
              label={{
                value: "Número de Clientes",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="arrivals"
              stroke="var(--chart-1)"
              name="Chegadas Cumulativas"
            />
            <Line
              type="monotone"
              dataKey="departures"
              stroke="var(--chart-2)"
              name="Saídas Cumulativas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Histograma de Tempos de Serviço
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="bin"
              label={{
                value: "Tempo de Serviço (s)",
                position: "insideBottom",
              }}
            />
            <YAxis
              label={{
                value: "Frequência",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="var(--chart-3)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Comparação de Tempos Médios
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              {
                name: "Tempo Médio de Serviço",
                value: service.metrics.avgServiceTime,
              },
              { name: "Tempo Médio de Espera", value: service.metrics.Wq },
              { name: "Tempo Médio Ocioso", value: service.metrics.idleTime },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{ value: "Tempo (s)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Bar dataKey="value" fill="var(--chart-4)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Gráfico de Linhas: Tempos por Tempo
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={
              service.serviceTimes?.map((s, i) => ({
                time:
                  service.timestamps && service.timestamps[i]
                    ? (service.timestamps[i] - service.timestamps[0]) / 1000
                    : i + 1,
                serviceTime: s,
                waitTime: service.metrics.waitingTimes?.[i] ?? 0,
                idleTime: service.metrics.idleTimes?.[i] ?? 0,
              })) || []
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{ value: "Tempo (s)", position: "insideBottom" }}
            />
            <YAxis
              label={{ value: "Tempo (s)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="serviceTime"
              stroke="var(--chart-1)"
              name="Tempo de Serviço"
            />
            <Line
              type="monotone"
              dataKey="waitTime"
              stroke="var(--chart-2)"
              name="Tempo de Espera"
            />
            <Line
              type="monotone"
              dataKey="idleTime"
              stroke="var(--chart-3)"
              name="Tempo Ocioso"
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
