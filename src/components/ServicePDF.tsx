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

interface ServicePDFProps {
  service: Service;
  getCumulativeData: (service: Service) => ChartDataPoint[];
  isExport?: boolean;
}

export function ServicePDF({
  service,
  getCumulativeData,
  isExport = false,
}: ServicePDFProps) {
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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        {service.name}
      </h1>
      <p>
        <strong>Fila de Chegada:</strong> {service.arrivalQueue}
      </p>
      <p>
        <strong>Fila de Atendimento:</strong> {service.serviceQueue}
      </p>

      <h2>Métricas Principais</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <tbody>
          <tr>
            <td>
              <strong>λ (taxa de chegada):</strong>{" "}
              {isFinite(service.metrics.lambda)
                ? service.metrics.lambda.toFixed(4)
                : "N/A"}{" "}
              chegadas/s
            </td>
            <td>
              <strong>μ (taxa de serviço):</strong>{" "}
              {isFinite(service.metrics.mu)
                ? service.metrics.mu.toFixed(4)
                : "N/A"}{" "}
              atendimentos/s
            </td>
            <td>
              <strong>ρ (utilização):</strong>{" "}
              {isFinite(service.metrics.rho)
                ? service.metrics.rho.toFixed(4)
                : "N/A"}
            </td>
          </tr>
          <tr>
            <td>
              <strong>L (clientes no sistema):</strong>{" "}
              {isFinite(service.metrics.L)
                ? service.metrics.L.toFixed(4)
                : "N/A"}
            </td>
            <td>
              <strong>Lq (clientes na fila):</strong>{" "}
              {isFinite(service.metrics.Lq)
                ? service.metrics.Lq.toFixed(4)
                : "N/A"}
            </td>
            <td>
              <strong>W (tempo no sistema):</strong>{" "}
              {isFinite(service.metrics.W)
                ? service.metrics.W.toFixed(4)
                : "N/A"}{" "}
              s
            </td>
          </tr>
          <tr>
            <td>
              <strong>Wq (tempo na fila):</strong>{" "}
              {isFinite(service.metrics.Wq)
                ? service.metrics.Wq.toFixed(4)
                : "N/A"}{" "}
              s
            </td>
            <td>
              <strong>P0 (probabilidade de vazio):</strong>{" "}
              {service.metrics.P?.[0] !== null &&
              isFinite(service.metrics.P?.[0])
                ? service.metrics.P[0].toFixed(4)
                : "N/A"}
            </td>
            <td>
              <strong>Tempo Ocioso Médio:</strong>{" "}
              {isFinite(service.metrics.idleTime)
                ? service.metrics.idleTime.toFixed(4)
                : "N/A"}{" "}
              s
            </td>
          </tr>
          <tr>
            <td>
              <strong>Proporção Ociosa:</strong>{" "}
              {isFinite(service.metrics.idleProportion)
                ? service.metrics.idleProportion.toFixed(4)
                : "N/A"}
            </td>
            <td>
              <strong>Tempo Médio de Serviço:</strong>{" "}
              {isFinite(service.metrics.avgServiceTime)
                ? service.metrics.avgServiceTime.toFixed(4)
                : "N/A"}{" "}
              s
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <h2>Probabilidades P(n)</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {service.metrics.P?.map((p, n) => (
          <div key={n}>
            P({n}): {p !== null && isFinite(p) ? p.toFixed(4) : "N/A"}
          </div>
        )) || <div>No P data available</div>}
      </div>

      <h2>Gráfico de Probabilidades P(n)</h2>
      <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
        <ResponsiveContainer
          width={isExport ? 600 : "100%"}
          height={isExport ? 400 : 300}
        >
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
            <YAxis />
            <Tooltip />
            <Bar dataKey="p" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Gráfico Cumulativo</h2>
      <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
        <ResponsiveContainer
          width={isExport ? 600 : "100%"}
          height={isExport ? 400 : 300}
        >
          <LineChart data={getCumulativeData(service)}>
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

      <h2>Histograma de Tempos de Serviço</h2>
      <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
        <ResponsiveContainer>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bin" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Comparação de Tempos Médios</h2>
      <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
        <ResponsiveContainer>
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
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Gráfico de Linhas: Tempos por Tempo</h2>
      <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
        <ResponsiveContainer>
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
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="serviceTime"
              stroke="#8884d8"
              name="Tempo de Serviço"
            />
            <Line
              type="monotone"
              dataKey="waitTime"
              stroke="#82ca9d"
              name="Tempo de Espera"
            />
            <Line
              type="monotone"
              dataKey="idleTime"
              stroke="#ffc658"
              name="Tempo Ocioso"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2>Dados Detalhados</h2>
      <h3>Tempos de Serviço</h3>
      <p>{service.serviceTimes?.join(", ") || "N/A"}</p>
      <h3>Tempos de Interchegada</h3>
      <p>{service.interArrivals?.join(", ") || "N/A"}</p>
      <h3>Tempos de Espera</h3>
      <p>{service.metrics.waitingTimes?.join(", ") || "N/A"}</p>
      <h3>Tempos Ociosos</h3>
      <p>{service.metrics.idleTimes?.join(", ") || "N/A"}</p>
      <h3>Timestamps</h3>
      <p>
        {service.timestamps
          ?.map((t) => new Date(t).toLocaleString())
          .join(", ") || "N/A"}
      </p>
    </div>
  );
}
