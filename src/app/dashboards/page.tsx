"use client";

import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface QueueRecord {
  queue: string;
  timestamp: string;
  totalTime: number;
  element: number;
  arriving: string;
  exiting: string;
}

function calculateMetrics(data: QueueRecord[]) {
  const queues = data.reduce((acc, r) => {
    if (!acc[r.queue]) acc[r.queue] = [];
    acc[r.queue].push(r);
    return acc;
  }, {} as Record<string, QueueRecord[]>);

  return Object.entries(queues).map(([queue, records]) => {
    const totalTimes = records.map((r) => r.totalTime / 1000); // convert to seconds
    const W = totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length;
    const Ts = 5; // simulated service time
    const Wq = Math.max(0, W - Ts); // ensure non-negative
    const arrivals = records
      .map((r) => new Date(r.arriving).getTime())
      .sort((a, b) => a - b);
    const interArrivals = arrivals.slice(1).map((t, i) => t - arrivals[i]);
    const avgInterArrival =
      interArrivals.length > 0
        ? interArrivals.reduce((a, b) => a + b, 0) / interArrivals.length / 1000
        : 10; // default
    const λ = 1 / avgInterArrival;
    const μ = 1 / Ts;
    const ρ = λ / μ;
    return { queue, W, Wq, Ts, λ, ρ, records };
  });
}

export default function Dashboards() {
  const [data, setData] = useState<QueueRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = localStorage.getItem("queueing-data");
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    };
    fetchData();
  }, []);

  const metrics = calculateMetrics(data);

  // Sort data by arriving time
  const sortedData = [...data].sort(
    (a, b) => new Date(a.arriving).getTime() - new Date(b.arriving).getTime()
  );

  // Cumulative data
  const cumData = sortedData.map((r, i) => {
    const time = new Date(r.arriving).toLocaleTimeString();
    const cumArriving = i + 1;
    const cumExiting = sortedData
      .slice(0, i + 1)
      .filter(
        (s) => new Date(s.exiting).getTime() <= new Date(r.arriving).getTime()
      ).length;
    return { time, cumArriving, cumExiting };
  });

  if (metrics.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600 mb-8 text-center animate-fade-in">
            Painéis
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 animate-slide-in-left">
            Nenhum dado disponível para os painéis.
          </p>
        </div>
      </div>
    );
  }

  const worstQueue = metrics.reduce((a, b) => (a.Wq > b.Wq ? a : b));

  // Data for bar chart: comparison of Wq and Ts
  const barData = metrics.map((m) => ({
    queue: m.queue,
    Wq: m.Wq,
    Ts: m.Ts,
  }));

  // Data for histogram: Wq distribution for worst queue
  const wqValues = worstQueue.records.map((r) => {
    const totalTime = r.totalTime / 1000;
    return Math.max(0, totalTime - worstQueue.Ts);
  });
  const bins = [0, 2, 4, 6, 8, 10];
  const histData = bins.map((bin, i) => {
    const nextBin = bins[i + 1] || Infinity;
    const count = wqValues.filter((v) => v >= bin && v < nextBin).length;
    return { bin: `${bin}-${nextBin === Infinity ? "+" : nextBin}s`, count };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600 mb-8 text-center animate-fade-in">
          Painéis de Desempenho
        </h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {metrics.map((m) => (
            <div
              key={m.queue}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {m.queue}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <InlineMath math="W" />: {m.W.toFixed(2)}s
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <InlineMath math="W_q" />: {m.Wq.toFixed(2)}s
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <InlineMath math="T_s" />: {m.Ts.toFixed(2)}s
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <InlineMath math="\\lambda" />: {m.λ.toFixed(2)} chegadas/s
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <InlineMath math="\\rho" />: {(m.ρ * 100).toFixed(2)}%
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-accent mb-4 text-center">
              Comparação de Desempenho: <InlineMath math="W_q" /> e{" "}
              <InlineMath math="T_s" />
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="queue" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Wq" fill="#8884d8" name="Wq (s)" />
                <Bar dataKey="Ts" fill="#82ca9d" name="Ts (s)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-accent mb-4 text-center">
              Distribuição da Espera: <InlineMath math="W_q" /> para{" "}
              {worstQueue.queue}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={histData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bin" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ffc658" name="Contagem" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-accent mb-4 text-center">
              Taxa de Chegada por Fila (<InlineMath math="\\lambda" />)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.map((m) => ({ queue: m.queue, λ: m.λ }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="queue" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="λ" fill="#ff7300" name="λ (chegadas/s)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time-based Chart */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-accent mb-4 text-center">
            Chegadas e Saídas Cumulativas ao Longo do Tempo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cumArriving"
                stroke="#8884d8"
                name="Chegadas Cumulativas"
              />
              <Line
                type="monotone"
                dataKey="cumExiting"
                stroke="#82ca9d"
                name="Saídas Cumulativas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
