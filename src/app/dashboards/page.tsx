"use client";

import { useState, useEffect, useCallback } from "react";
import { Nav } from "../../components/Nav";
import { QueueSelector } from "../../components/QueueSelector";
import { MetricsResults } from "../../components/MetricsResults";
import { ServiceCard } from "../../components/ServiceCard";
import { db } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import { QueueMetrics, StoredService } from "../../lib/types";

interface Record {
  id: string;
  queue: string;
  type: "arrival" | "service";
  timestamp: string;
  totalTime: number;
  element: number;
  arriving: string;
  exiting: string;
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

export default function Dashboards() {
  const [queues, setQueues] = useState<
    { name: string; type: "arrival" | "service"; numAttendants?: number }[]
  >([]);
  const [data, setData] = useState<Record[]>([]);
  const [services, setServices] = useState<StoredService[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("queueing-services");
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("Error parsing services from localStorage:", e);
        localStorage.removeItem("queueing-services");
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    const unsubscribeQueues = onSnapshot(
      collection(db, "queues"),
      (snapshot) => {
        const q = snapshot.docs.map(
          (doc) =>
            doc.data() as {
              name: string;
              type: "arrival" | "service";
              numAttendants?: number;
            }
        );
        setQueues(q);
      }
    );
    const unsubscribeData = onSnapshot(collection(db, "data"), (snapshot) => {
      const d = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Record)
      );
      setData(d);
    });
    return () => {
      unsubscribeQueues();
      unsubscribeData();
    };
  }, []);

  const [selectedArrivalQueue, setSelectedArrivalQueue] = useState("");
  const [selectedServiceQueue, setSelectedServiceQueue] = useState("");
  const [results, setResults] = useState<QueueMetrics | null>(null);
  const [numServers, setNumServers] = useState(1);
  const [maxN, setMaxN] = useState(10);
  const [newServiceName, setNewServiceName] = useState("");

  const getCumulativeData = useCallback(
    (service: StoredService) => {
      const arrivalData = data
        .filter(
          (d) =>
            d.queue === service.arrivalQueue &&
            d.type === "arrival" &&
            !isNaN(new Date(d.timestamp).getTime())
        )
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      const serviceData = data
        .filter(
          (d) =>
            d.queue === service.serviceQueue &&
            d.type === "service" &&
            !isNaN(new Date(d.arriving).getTime()) &&
            !isNaN(new Date(d.exiting).getTime())
        )
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
      const startTime = events.length > 0 ? events[0].time : 0;
      const maxPoints = 100;
      const step = Math.max(1, Math.ceil(events.length / maxPoints));
      for (let i = 0; i < events.length; i += step) {
        const e = events[i];
        if (e.type === "arrival") arrivals++;
        else departures++;
        chartData.push({
          time: (e.time - startTime) / 1000,
          arrivals,
          departures,
        });
      }
      return chartData;
    },
    [data]
  );

  const calculateQueueMetrics = () => {
    try {
      if (!selectedArrivalQueue || !selectedServiceQueue) {
        toast.warn("Selecione filas de chegada e atendimento.");
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
        .filter(
          (d) =>
            commonElements.has(d.element) &&
            !isNaN(new Date(d.timestamp).getTime())
        )
        .sort((a, b) => a.element - b.element);
      const filteredServiceData = serviceData
        .filter(
          (d) =>
            commonElements.has(d.element) &&
            !isNaN(new Date(d.arriving).getTime()) &&
            !isNaN(new Date(d.exiting).getTime())
        )
        .sort((a, b) => a.element - b.element);

      if (filteredArrivalData.length === 0) {
        toast.error(
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
        toast.error(
          "Todos os tempos de chegada são idênticos. Por favor, registre chegadas com timestamps diferentes para calcular a taxa de chegada (λ)."
        );
        return;
      }

      const avgInterArrival =
        interArrivals.reduce((a, b) => a + b, 0) / interArrivals.length;
      const lambda = 1 / avgInterArrival;

      // Validate lambda
      if (!isFinite(lambda) || lambda <= 0) {
        toast.error(
          "Erro ao calcular a taxa de chegada. Verifique os dados de entrada."
        );
        return;
      }

      // Compute service times for mu
      const serviceTimes = filteredServiceData.map((s) => s.totalTime / 1000);

      // Filter out zero or negative service times
      const validServiceTimes = serviceTimes.filter((t) => t > 0);

      if (validServiceTimes.length === 0) {
        toast.error(
          "Todos os tempos de serviço são zero ou inválidos. Por favor, registre atendimentos com duração adequada."
        );
        return;
      }

      const avgServiceTime =
        validServiceTimes.reduce((a, b) => a + b, 0) / validServiceTimes.length;
      const mu = 1 / avgServiceTime;

      // Validate mu
      if (!isFinite(mu) || mu <= 0) {
        toast.error(
          "Erro ao calcular a taxa de atendimento. Verifique os dados de entrada."
        );
        return;
      }
      // Compute empirical waiting times
      const waitingTimes = [];
      for (let i = 0; i < filteredArrivalData.length; i++) {
        const arrivalTime = new Date(
          filteredArrivalData[i].timestamp
        ).getTime();
        const serviceStart = new Date(
          filteredServiceData[i].arriving
        ).getTime();
        if (serviceStart < arrivalTime) {
          toast.error(
            `Para o elemento ${filteredArrivalData[i].element}, o tempo de início do atendimento deve ser posterior ao tempo de chegada.`
          );
          return;
        }
        waitingTimes.push((serviceStart - arrivalTime) / 1000);
      }
      const avgWq =
        waitingTimes.reduce((a, b) => a + b, 0) / waitingTimes.length;
      const rho = lambda / (numServers * mu);
      // Check if rho >= 1, which means the system is unstable
      if (rho >= 1) {
        toast.warn(
          `O sistema está sobrecarregado (ρ = ${rho.toFixed(
            4
          )} ≥ 1). As fórmulas de estado estacionário não se aplicam. A fila cresce indefinidamente.`
        );
        // Continue calculating anyway
      }

      // New formulas for general birth-death process
      const lambdaK = (k: number) => lambda; // Constant arrivals
      const muK = (k: number) => Math.min(k, numServers) * mu; // Service rate up to numServers

      const C: number[] = [1]; // C_0 = 1
      for (let n = 1; n <= maxN; n++) {
        C[n] = C[n - 1] * (lambdaK(n) / muK(n));
      }

      const sumC = C.slice(1).reduce((sum, c) => sum + c, 0); // sum_{n=1}^∞ C_n (truncated)
      const P0 = 1 / (1 + sumC);

      const P: number[] = [];
      for (let n = 0; n <= maxN; n++) {
        P[n] = C[n] * P0;
      }

      // Validate P
      if (P.some((p) => !isFinite(p))) {
        toast.error(
          "Métricas inválidas devido a sistema instável (probabilidades infinitas)."
        );
        return;
      }

      // L = sum_{n=0}^∞ n * P_n
      const L = P.reduce((sum, p, n) => sum + n * p, 0);

      // Lq = sum_{n=s}^∞ (n - s) * P_n, where s = numServers
      const Lq = P.slice(numServers).reduce(
        (sum, p, idx) => sum + (idx + numServers - numServers) * p,
        0
      );

      // λ (already calculated as lambda)

      // W = L / λ
      const W = L / lambda;

      // Wq = Lq / λ
      const Wq = Lq / lambda;

      // Validate key metrics
      if (!isFinite(L) || !isFinite(Lq) || !isFinite(W) || !isFinite(Wq)) {
        toast.error("Métricas inválidas devido a dados instáveis.");
        return;
      }

      // Calculate idle time empirically
      const idleTimes: number[] = [];
      let serverBusyUntil = new Date(
        filteredArrivalData[0].timestamp
      ).getTime();
      let totalIdleTime = 0;
      for (let i = 0; i < filteredServiceData.length; i++) {
        const arrivalTime = new Date(
          filteredArrivalData[i].timestamp
        ).getTime();
        const serviceTime = filteredServiceData[i].totalTime; // in ms
        const idleForThis = Math.max(0, arrivalTime - serverBusyUntil);
        idleTimes.push(idleForThis / 1000);
        totalIdleTime += idleForThis;
        serverBusyUntil = Math.max(serverBusyUntil, arrivalTime) + serviceTime;
      }
      const idleTime = totalIdleTime / 1000;
      const idleProportion =
        idleTime /
        ((serverBusyUntil -
          new Date(filteredArrivalData[0].timestamp).getTime()) /
          1000);
      setResults({
        lambda,
        mu,
        rho,
        L,
        Lq,
        W,
        Wq,
        P,
        idleTime,
        idleProportion,
        avgServiceTime,
        idleTimes,
        waitingTimes,
        interArrivals,
        serviceTimes: validServiceTimes,
        timestamps: filteredArrivalData.map((d) =>
          new Date(d.timestamp).getTime()
        ),
      });
      toast.success("Métricas calculadas com sucesso!");
    } catch (error) {
      console.error("Erro ao calcular métricas:", error);
      toast.error("Erro ao calcular métricas.");
    }
  };
  const createService = () => {
    if (!newServiceName.trim() || !results) {
      toast.warn("Nome do serviço e resultados são necessários.");
      return;
    }
    if (services.length >= 1) {
      toast.warn(
        "Apenas 1 serviço pode ser criado por vez. Exclua o serviço atual para adicionar outro."
      );
      return;
    }
    const { interArrivals, serviceTimes, timestamps, ...metricsWithoutInter } =
      results;
    const newService: StoredService = {
      id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newServiceName.trim(),
      arrivalQueue: selectedArrivalQueue,
      serviceQueue: selectedServiceQueue,
      metrics: metricsWithoutInter,
      serviceTimes: serviceTimes,
      timestamps: timestamps,
      interArrivals: interArrivals,
    };
    const updatedServices = [...services, newService];
    try {
      localStorage.setItem(
        "queueing-services",
        JSON.stringify(updatedServices)
      );
      setServices(updatedServices);
      toast.success("Serviço criado com sucesso!");
    } catch {
      toast.error("Erro ao salvar serviço: armazenamento local cheio.");
      return;
    }
    setNewServiceName("");
    setSelectedArrivalQueue("");
    setSelectedServiceQueue("");
    setResults(null);
  };

  const deleteService = (index: number) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      const updatedServices = services.filter((_, i) => i !== index);
      setServices(updatedServices);
      localStorage.setItem(
        "queueing-services",
        JSON.stringify(updatedServices)
      );
      toast.success("Serviço excluído com sucesso!");
    }
  };

  const exportServiceToPDF = () => {
    // Implement PDF export if needed
    toast.info("Export to PDF not implemented yet.");
  };

  const arrivalQueues = queues.filter((q) => q.type === "arrival");
  const serviceQueues = queues.filter((q) => q.type === "service");

  const clearAllData = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar TODOS os dados armazenados? Esta ação afetará todos os usuários."
      )
    ) {
      // Clear Firestore collections
      // Note: This is dangerous, in real app restrict to admin
      setQueues([]);
      setData([]);
      setServices([]);
      localStorage.removeItem("queueing-services");
      toast.success("Todos os dados foram limpos com sucesso!");
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
                key={service.id}
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
