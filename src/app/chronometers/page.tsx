"use client";

import { useState } from "react";
import { Chronometer } from "../../components/Chronometer";
import { TimestampCard } from "../../components/TimestampCard";
import { Nav } from "../../components/Nav";

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

export default function Chronometers() {
  const [queues, setQueues] = useState<
    { name: string; type: "arrival" | "service" }[]
  >(() => {
    if (typeof window !== "undefined") {
      const storedQueues = localStorage.getItem("queueing-queues");
      return storedQueues ? JSON.parse(storedQueues) : [];
    }
    return [];
  });
  const [newQueue, setNewQueue] = useState("");
  const [newQueueType, setNewQueueType] = useState<"arrival" | "service">(
    "arrival"
  );
  const [data, setData] = useState<Record[]>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("queueing-data");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        return parsed.map((r: Partial<Record>, index: number) => ({
          id: r.id || `legacy-${Date.now()}-${index}`,
          ...r,
        }));
      }
    }
    return [];
  });
  const [queueTotals, setQueueTotals] = useState<{ [key: string]: number }>(
    () => {
      if (typeof window !== "undefined") {
        const storedTotals = localStorage.getItem("queueing-totals");
        return storedTotals ? JSON.parse(storedTotals) : {};
      }
      return {};
    }
  );

  const [currentAppTime, setCurrentAppTime] = useState(new Date());
  const [milliseconds, setMilliseconds] = useState(0);

  const updateTimeWithMilliseconds = (dateTimeValue: string) => {
    const baseDate = new Date(dateTimeValue);
    baseDate.setMilliseconds(milliseconds);
    setCurrentAppTime(baseDate);
  };

  const updateMilliseconds = (ms: number) => {
    const newTime = new Date(currentAppTime);
    newTime.setMilliseconds(ms);
    setMilliseconds(ms);
    setCurrentAppTime(newTime);
  };

  const saveQueues = (
    newQueues: { name: string; type: "arrival" | "service" }[]
  ) => {
    setQueues(newQueues);
    localStorage.setItem("queueing-queues", JSON.stringify(newQueues));
  };

  const saveData = (newData: Record[]) => {
    setData(newData);
    localStorage.setItem("queueing-data", JSON.stringify(newData));
  };

  const saveTotals = (newTotals: { [key: string]: number }) => {
    setQueueTotals(newTotals);
    localStorage.setItem("queueing-totals", JSON.stringify(newTotals));
  };

  const addQueue = () => {
    if (
      newQueue.trim() &&
      !queues.some((queue) => queue.name === newQueue.trim())
    ) {
      const newQueues = [
        ...queues,
        { name: newQueue.trim(), type: newQueueType },
      ];
      saveQueues(newQueues);
      setNewQueue("");
    }
  };

  const removeQueue = (index: number) => {
    const queueToRemove = queues[index];
    const newQueues = queues.filter((_, i) => i !== index);
    saveQueues(newQueues);

    const newData = data.filter(
      (record) => record.queue !== queueToRemove.name
    );
    saveData(newData);

    // Remove total for this queue
    const newTotals = { ...queueTotals };
    delete newTotals[queueToRemove.name];
    saveTotals(newTotals);
  };

  const getNextElement = (queue: string) => {
    const current = queueTotals[queue] || 0;
    const next = current + 1;
    const newTotals = { ...queueTotals, [queue]: next };
    saveTotals(newTotals);
    return next;
  };

  const recordEvent = (record: Omit<Record, "id">) => {
    const newRecord = {
      ...record,
      id: `record-${Date.now()}-${Math.random()}`,
    };
    saveData([...data, newRecord]);
  };

  return (
    <div>
      <Nav />
      <div
        className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--element-bg)] to-[var(--bg-gradient-end)] py-12 px-4 sm:px-6 lg:px-8"
        suppressHydrationWarning={true}
      >
        <div className="max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <TimestampCard />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] mb-8 text-center animate-slide-in-left">
            Cronômetros
          </h1>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Configuração de Tempo
            </h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <input
                type="datetime-local"
                value={currentAppTime.toISOString().slice(0, 16)}
                onChange={(e) => updateTimeWithMilliseconds(e.target.value)}
                className="flex-1 px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
              />
              <input
                type="number"
                value={milliseconds}
                onChange={(e) => updateMilliseconds(Number(e.target.value))}
                placeholder="Milissegundos"
                className="flex-1 px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
              />
              <button
                onClick={() => setCurrentAppTime(new Date())}
                className="px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white rounded-xl font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Usar Tempo Atual
              </button>
            </div>
          </div>
          <div
            className="mb-8 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                <input
                  type="text"
                  value={newQueue}
                  onChange={(e) => setNewQueue(e.target.value)}
                  placeholder="Nome da nova fila"
                  className="flex-1 px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
                />
                <select
                  value={newQueueType}
                  onChange={(e) =>
                    setNewQueueType(e.target.value as "arrival" | "service")
                  }
                  className="px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
                >
                  <option value="arrival">Chegada</option>
                  <option value="service">Atendimento</option>
                </select>
                <button
                  onClick={addQueue}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white rounded-xl font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg
                    className="w-5 h-5 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Adicionar Fila
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {queues.map((queue, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    {queue.name} (
                    {queue.type === "arrival" ? "Chegada" : "Atendimento"})
                  </h2>
                  <button
                    onClick={() => removeQueue(index)}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-300 p-2 rounded-full hover:bg-[var(--text-muted)]"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <Chronometer
                  queue={queue.name}
                  type={queue.type}
                  getNextElement={getNextElement}
                  currentTotal={queueTotals[queue.name] || 0}
                  onRecord={recordEvent}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
