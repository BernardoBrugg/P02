"use client";

import { useState, useEffect } from "react";
import { Nav } from "../../components/Nav";
import { QueueSelector } from "../../components/QueueSelector";
import { MetricsResults } from "../../components/MetricsResults";
import { ServiceCard } from "../../components/ServiceCard";

interface Record {
  queue: string;
  type: "arrival" | "service";
  timestamp: string;
  totalTime: number;
  element: number;
  arriving: string;
  exiting: string;
}

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

interface Event {
  time: number;
  type: "arrival" | "departure";
}

interface ChartDataPoint {
  time: number;
  arrivals: number;
  departures: number;
}

interface StoredService {
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
    P: (number | null)[];
  };
}

export default function Dashboards() {
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

  const [queues] = useState<{ name: string; type: "arrival" | "service" }[]>(
    () => {
      if (typeof window !== "undefined") {
        const storedQueues = localStorage.getItem("queueing-queues");
        return storedQueues ? JSON.parse(storedQueues) : [];
      }
      return [];
    }
  );
  const [data] = useState<Record[]>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("queueing-data");
      return storedData ? JSON.parse(storedData) : [];
    }
    return [];
  });
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
  const [newServiceName, setNewServiceName] = useState("");
  const [selectedArrivalQueue, setSelectedArrivalQueue] = useState("");
  const [selectedServiceQueue, setSelectedServiceQueue] = useState("");
  const [results, setResults] = useState<QueueMetrics | null>(null);
  const [numServers, setNumServers] = useState(1);
  const [maxN, setMaxN] = useState(10);

  const saveServices = (newServices: typeof services) => {
    setServices(newServices);
    localStorage.setItem("queueing-services", JSON.stringify(newServices));
  };

  const getCumulativeData = (service: (typeof services)[0]) => {
    const arrivalData = data
      .filter((d) => d.queue === service.arrivalQueue && d.type === "arrival")
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    const serviceData = data
      .filter((d) => d.queue === service.serviceQueue && d.type === "service")
      .sort(
        (a, b) =>
          new Date(a.arriving).getTime() - new Date(b.arriving).getTime()
      );
    const events: Event[] = [];
    arrivalData.forEach((a) =>
      events.push({ time: new Date(a.timestamp).getTime(), type: "arrival" })
    );
    serviceData.forEach((s) =>
      events.push({ time: new Date(s.exiting).getTime(), type: "departure" })
    );
    events.sort((a, b) => a.time - b.time);
    let arrivals = 0;
    let departures = 0;
    const chartData: ChartDataPoint[] = [];
    const startTime = events[0]?.time || 0;
    events.forEach((e) => {
      if (e.type === "arrival") arrivals++;
      else departures++;
      chartData.push({
        time: (e.time - startTime) / 1000,
        arrivals,
        departures,
      });
    });
    return chartData;
  };

  const calculateQueueMetrics = () => {
    if (!selectedArrivalQueue || !selectedServiceQueue) {
      alert("Selecione filas de chegada e atendimento.");
      return;
    }
    const arrivalData = data
      .filter((d) => d.queue === selectedArrivalQueue && d.type === "arrival")
      .sort((a, b) => a.element - b.element);
    const serviceData = data
      .filter((d) => d.queue === selectedServiceQueue && d.type === "service")
      .sort((a, b) => a.element - b.element);

    const arrivalElements = new Set(arrivalData.map((d) => d.element));
    const serviceElements = new Set(serviceData.map((d) => d.element));
    const commonElements = new Set(
      [...arrivalElements].filter((e) => serviceElements.has(e))
    );

    const filteredArrivalData = arrivalData
      .filter((d) => commonElements.has(d.element))
      .sort((a, b) => a.element - b.element);
    const filteredServiceData = serviceData
      .filter((d) => commonElements.has(d.element))
      .sort((a, b) => a.element - b.element);

    if (filteredArrivalData.length === 0) {
      alert(
        "Não há elementos comuns válidos entre as filas de chegada e atendimento."
      );
      return;
    }

    // Compute inter-arrivals for lambda
    const interArrivals = [];
    for (let i = 1; i < filteredArrivalData.length; i++) {
      const diff =
        (new Date(filteredArrivalData[i].timestamp).getTime() -
          new Date(filteredArrivalData[i - 1].timestamp).getTime()) /
        1000;
      // Only include non-zero inter-arrivals
      if (diff > 0) {
        interArrivals.push(diff);
      }
    }

    if (interArrivals.length === 0) {
      alert(
        "Todos os tempos de chegada são idênticos. Por favor, registre chegadas com timestamps diferentes para calcular a taxa de chegada (λ)."
      );
      return;
    }

    const avgInterArrival =
      interArrivals.reduce((a, b) => a + b, 0) / interArrivals.length;
    const lambda = 1 / avgInterArrival;

    // Validate lambda
    if (!isFinite(lambda) || lambda <= 0) {
      alert(
        "Erro ao calcular a taxa de chegada. Verifique os dados de entrada."
      );
      return;
    }

    // Compute service times for mu
    const serviceTimes = filteredServiceData.map((s) => s.totalTime / 1000);

    // Filter out zero or negative service times
    const validServiceTimes = serviceTimes.filter((t) => t > 0);

    if (validServiceTimes.length === 0) {
      alert(
        "Todos os tempos de serviço são zero ou inválidos. Por favor, registre atendimentos com duração adequada."
      );
      return;
    }

    const avgServiceTime =
      validServiceTimes.reduce((a, b) => a + b, 0) / validServiceTimes.length;
    const mu = 1 / avgServiceTime;

    // Validate mu
    if (!isFinite(mu) || mu <= 0) {
      alert(
        "Erro ao calcular a taxa de atendimento. Verifique os dados de entrada."
      );
      return;
    }
    // Compute empirical waiting times
    const waitingTimes = [];
    for (let i = 0; i < filteredArrivalData.length; i++) {
      const arrivalTime = new Date(filteredArrivalData[i].timestamp).getTime();
      const serviceStart = new Date(filteredServiceData[i].arriving).getTime();
      if (serviceStart < arrivalTime) {
        alert(
          `Para o elemento ${filteredArrivalData[i].element}, o tempo de início do atendimento deve ser posterior ao tempo de chegada.`
        );
        return;
      }
      waitingTimes.push((serviceStart - arrivalTime) / 1000);
    }
    const avgWq = waitingTimes.reduce((a, b) => a + b, 0) / waitingTimes.length;
    const rho = lambda / (numServers * mu);
    // Check if rho >= 1, which means the system is unstable
    if (rho >= 1) {
      alert(
        `O sistema está sobrecarregado (ρ = ${rho.toFixed(
          4
        )} ≥ 1). As fórmulas de estado estacionário não se aplicam. A fila cresce indefinidamente.`
      );
      // Continue calculating anyway
    }
    const factorial = (n: number): number =>
      n <= 1 ? 1 : n * factorial(n - 1);
    let Lq: number;
    let Wq: number;
    let L: number;
    let W: number;
    const P: number[] = [];
    if (numServers === 1) {
      // M/M/1
      const P0 = 1 - rho;
      for (let n = 0; n <= maxN; n++) {
        P[n] = P0 * Math.pow(rho, n);
      }
      Lq = lambda * avgWq;
      L = Lq + rho;
      W = avgWq + 1 / mu;
      Wq = avgWq;
    } else {
      // M/M/c
      let sum = 0;
      for (let k = 0; k < numServers; k++) {
        sum += Math.pow(lambda / mu, k) / factorial(k);
      }
      sum +=
        Math.pow(lambda / mu, numServers) / factorial(numServers) / (1 - rho);
      const P0 = 1 / sum;
      Lq =
        (P0 * Math.pow(lambda / mu, numServers) * rho) /
        (factorial(numServers - 1) * Math.pow(1 - rho, 2));
      L = Lq + lambda / mu;
      Wq = Lq / lambda;
      W = Wq + 1 / mu;
      for (let n = 0; n <= maxN; n++) {
        if (n < numServers) {
          P[n] = (Math.pow(lambda / mu, n) / factorial(n)) * P0;
        } else {
          P[n] =
            (Math.pow(lambda / mu, n) /
              (factorial(numServers) * Math.pow(numServers, n - numServers))) *
            P0;
        }
      }
    }
    setResults({ lambda, mu, rho, L, Lq, W, Wq, P });
  };

  const createService = () => {
    if (!newServiceName.trim() || !results) {
      alert("Nome do serviço e resultados são necessários.");
      return;
    }
    const newService = {
      name: newServiceName.trim(),
      arrivalQueue: selectedArrivalQueue,
      serviceQueue: selectedServiceQueue,
      metrics: results,
    };
    saveServices([...services, newService]);
    setNewServiceName("");
    setSelectedArrivalQueue("");
    setSelectedServiceQueue("");
    setResults(null);
  };

  const deleteService = (index: number) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      const newServices = services.filter((_, i) => i !== index);
      saveServices(newServices);
    }
  };

  const exportServiceToPDF = (service: (typeof services)[0]) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, permita pop-ups para exportar o PDF.");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${service.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #333;
              border-bottom: 2px solid #666;
              padding-bottom: 10px;
            }
            h2 {
              color: #555;
              margin-top: 20px;
            }
            .metric {
              display: inline-block;
              margin: 10px 20px 10px 0;
            }
            .metric strong {
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>${service.name}</h1>
          <p><strong>Fila de Chegada:</strong> ${service.arrivalQueue}</p>
          <p><strong>Fila de Atendimento:</strong> ${service.serviceQueue}</p>
          
          <h2>Métricas do Sistema</h2>
          <div>
            <div class="metric"><strong>λ:</strong> ${
              isFinite(service.metrics.lambda)
                ? service.metrics.lambda.toFixed(4)
                : "N/A"
            } chegadas/s</div>
            <div class="metric"><strong>μ:</strong> ${
              isFinite(service.metrics.mu)
                ? service.metrics.mu.toFixed(4)
                : "N/A"
            } atendimentos/s</div>
            <div class="metric"><strong>ρ:</strong> ${
              isFinite(service.metrics.rho)
                ? service.metrics.rho.toFixed(4)
                : "N/A"
            }</div>
            <div class="metric"><strong>L:</strong> ${
              isFinite(service.metrics.L) ? service.metrics.L.toFixed(4) : "N/A"
            }</div>
            <div class="metric"><strong>Lq:</strong> ${
              isFinite(service.metrics.Lq)
                ? service.metrics.Lq.toFixed(4)
                : "N/A"
            }</div>
            <div class="metric"><strong>W:</strong> ${
              isFinite(service.metrics.W) ? service.metrics.W.toFixed(4) : "N/A"
            } s</div>
            <div class="metric"><strong>Wq:</strong> ${
              isFinite(service.metrics.Wq)
                ? service.metrics.Wq.toFixed(4)
                : "N/A"
            } s</div>
            <div class="metric"><strong>P0:</strong> ${
              service.metrics.P[0] !== null && isFinite(service.metrics.P[0])
                ? service.metrics.P[0].toFixed(4)
                : "N/A"
            }</div>
          </div>
          
          <h2>Probabilidades de Estado P(n)</h2>
          <table>
            <thead>
              <tr>
                <th>n</th>
                <th>P(n)</th>
              </tr>
            </thead>
            <tbody>
              ${service.metrics.P.map(
                (p, n) => `
                <tr>
                  <td>${n}</td>
                  <td>${p !== null && isFinite(p) ? p.toFixed(4) : "N/A"}</td>
                </tr>
              `
              ).join("")}
            </tbody>
          </table>
          
          <p style="margin-top: 40px; text-align: center; color: #666;">
            Gerado em: ${new Date().toLocaleString("pt-BR")}
          </p>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const arrivalQueues = queues.filter((q) => q.type === "arrival");
  const serviceQueues = queues.filter((q) => q.type === "service");

  const clearAllData = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar TODOS os dados armazenados? Esta ação não pode ser desfeita."
      )
    ) {
      localStorage.removeItem("queueing-services");
      localStorage.removeItem("queueing-queues");
      localStorage.removeItem("queueing-data");
      localStorage.removeItem("queueing-totals");
      window.location.reload();
    }
  };

  return (
    <div>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--element-bg)] to-[var(--bg-gradient-end)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-center animate-slide-in-left flex-1">
              Dashboards
            </h1>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
            >
              Limpar Dados
            </button>
          </div>
          <div
            className="mb-8 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <QueueSelector
              selectedArrivalQueue={selectedArrivalQueue}
              setSelectedArrivalQueue={setSelectedArrivalQueue}
              selectedServiceQueue={selectedServiceQueue}
              setSelectedServiceQueue={setSelectedServiceQueue}
              numServers={numServers}
              setNumServers={setNumServers}
              maxN={maxN}
              setMaxN={setMaxN}
              calculateQueueMetrics={calculateQueueMetrics}
              arrivalQueues={arrivalQueues}
              serviceQueues={serviceQueues}
            />
            <MetricsResults
              results={results}
              newServiceName={newServiceName}
              setNewServiceName={setNewServiceName}
              createService={createService}
            />
          </div>
          <div className="grid grid-cols-1 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                index={index}
                deleteService={deleteService}
                exportServiceToPDF={exportServiceToPDF}
                getCumulativeData={getCumulativeData}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
