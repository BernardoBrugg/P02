"use client";

import { useState, useEffect } from "react";
import { Nav } from "../../components/Nav";
import { QueueSelector } from "../../components/QueueSelector";
import { MetricsResults } from "../../components/MetricsResults";
import { ServiceCard } from "../../components/ServiceCard";
import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Service, QueueMetrics } from "../../lib/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ServicePDF } from "../../components/ServicePDF";
import { createRoot } from "react-dom/client";

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
    idleTime: number;
    idleProportion: number;
    avgServiceTime: number;
    idleTimes: number[];
    waitingTimes: number[];
  };
  serviceTimes: number[];
  timestamps: number[];
  interArrivals: number[];
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

  const [queues, setQueues] = useState<
    { name: string; type: "arrival" | "service"; numAttendants?: number }[]
  >([]);
  const [data, setData] = useState<Record[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [validServiceTimes, setValidServiceTimes] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);

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
    const unsubscribeServices = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        const s = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Service)
        );
        setServices(s);
      }
    );
    return () => {
      unsubscribeQueues();
      unsubscribeData();
      unsubscribeServices();
    };
  }, []);

  const [newServiceName, setNewServiceName] = useState("");
  const [selectedArrivalQueue, setSelectedArrivalQueue] = useState("");
  const [selectedServiceQueue, setSelectedServiceQueue] = useState("");
  const [results, setResults] = useState<QueueMetrics | null>(null);
  const [numServers, setNumServers] = useState(1);
  const [maxN, setMaxN] = useState(10);

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
      .filter((d) => commonElements.has(d.element))
      .sort((a, b) => a.element - b.element);
    const filteredServiceData = serviceData
      .filter((d) => commonElements.has(d.element))
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

    setValidServiceTimes(validServiceTimes);
    setTimestamps(
      filteredServiceData.map((s) => new Date(s.arriving).getTime())
    );

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
      const arrivalTime = new Date(filteredArrivalData[i].timestamp).getTime();
      const serviceStart = new Date(filteredServiceData[i].arriving).getTime();
      if (serviceStart < arrivalTime) {
        toast.error(
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
      toast.warn(
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
    // Calculate idle time empirically
    const idleTimes: number[] = [];
    let serverBusyUntil = new Date(filteredArrivalData[0].timestamp).getTime();
    let totalIdleTime = 0;
    for (let i = 0; i < filteredServiceData.length; i++) {
      const arrivalTime = new Date(filteredArrivalData[i].timestamp).getTime();
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
    });
    toast.success("Métricas calculadas com sucesso!");
  };

  const createService = async () => {
    if (!newServiceName.trim() || !results) {
      toast.warn("Nome do serviço e resultados são necessários.");
      return;
    }
    const newService = {
      name: newServiceName.trim(),
      arrivalQueue: selectedArrivalQueue,
      serviceQueue: selectedServiceQueue,
      metrics: results,
      serviceTimes: validServiceTimes,
      timestamps: timestamps,
      interArrivals: results.interArrivals,
    };
    try {
      await addDoc(collection(db, "services"), newService);
      toast.success("Serviço criado com sucesso!");
      setNewServiceName("");
      setSelectedArrivalQueue("");
      setSelectedServiceQueue("");
      setResults(null);
    } catch (error) {
      toast.error("Erro ao criar serviço: " + (error as Error).message);
    }
  };

  const deleteService = async (index: number) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      const serviceToDelete = services[index];
      try {
        await deleteDoc(doc(db, "services", serviceToDelete.id));
        toast.success("Serviço excluído com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir serviço: " + (error as Error).message);
      }
    }
  };

  const exportServiceToPDF = (service: (typeof services)[0]) => {
    const tempDiv = document.createElement("div");
    tempDiv.style.width = "800px";
    tempDiv.style.height = "auto";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    const root = createRoot(tempDiv);
    root.render(
      <ServicePDF
        service={service}
        isExport={true}
        getCumulativeData={getCumulativeData}
      />
    );

    setTimeout(() => {
      html2canvas(tempDiv, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${service.name}.pdf`);
        document.body.removeChild(tempDiv);
      });
    }, 2000); // Wait for rendering
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
