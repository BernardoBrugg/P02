"use client";

import { useState, useMemo } from "react";

interface Record {
  queue: string;
  type: "arrival" | "service";
  timestamp: string;
  totalTime: number;
  element: number;
  arriving: string;
  exiting: string;
}

interface ChronometerProps {
  queue: string;
  type: "arrival" | "service";
  getNextElement: (queue: string) => number;
  currentTotal: number;
  onRecord: (record: Omit<Record, "id">) => void;
  currentAppTimeMs: number;
}

export function Chronometer({
  queue,
  type,
  getNextElement,
  currentTotal,
  onRecord,
  currentAppTimeMs,
}: ChronometerProps) {
  const pendingClients: { element: number; arriving: number }[] = [];
  const [currentServicing, setCurrentServicing] = useState<{
    element: number;
    arrivedTime: number;
    startTime: string;
  } | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const displayTime = useMemo(() => {
    if (type === "arrival" && startTime) {
      return currentAppTimeMs - startTime;
    } else if (type === "service" && currentServicing) {
      return currentAppTimeMs - currentServicing.arrivedTime;
    } else {
      return 0;
    }
  }, [currentAppTimeMs, startTime, currentServicing, type]);
  const currentWait = 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds
      .toString()
      .padStart(2, "0")}`;
  };

  const addArrival = () => {
    const now = currentAppTimeMs;
    if (!startTime) {
      setStartTime(now);
    }
    const element = getNextElement(queue);
    const record: Record = {
      queue,
      type,
      timestamp: new Date(currentAppTimeMs).toISOString(),
      totalTime: 0,
      element,
      arriving: new Date(currentAppTimeMs).toISOString(),
      exiting: "",
    };
    onRecord(record);
  };

  const arrivedAtService = () => {
    const element = getNextElement(queue);
    const startTimeStr = new Date(currentAppTimeMs).toISOString();
    setCurrentServicing({ element, arrivedTime: currentAppTimeMs, startTime: startTimeStr });
  };

  const completedService = () => {
    if (currentServicing) {
      const exitingTime = currentAppTimeMs;
      const totalTime = exitingTime - currentServicing.arrivedTime;
      const record: Record = {
        queue,
        type,
        timestamp: currentServicing.startTime,
        totalTime,
        element: currentServicing.element,
        arriving: currentServicing.startTime,
        exiting: new Date(exitingTime).toISOString(),
      };
      onRecord(record);
      setCurrentServicing(null);
    }
  };

  return (
    <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-8 rounded-2xl shadow-md group font-sans">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          {queue}
        </h3>
        <div className="text-4xl text-[var(--accent)] font-bold">
          {formatTime(displayTime)}
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-secondary)] font-medium">
            Elementos Totais:
          </span>
          <span className="text-2xl font-bold text-[var(--text-primary)]">
            {currentTotal}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-secondary)] font-medium">
            {type === "arrival" ? "Aguardando:" : "Em Atendimento:"}
          </span>
          <span className="text-2xl font-bold text-[var(--text-primary)]">
            {type === "arrival"
              ? pendingClients.length
              : currentServicing
              ? 1
              : 0}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-secondary)] font-medium">
            {type === "arrival" ? "Espera Atual:" : "Tempo de Atendimento:"}
          </span>
          <span className="text-xl text-[var(--accent)] font-bold">
            {(type === "arrival" && pendingClients.length > 0) ||
            (type === "service" && currentServicing)
              ? formatTime(currentWait)
              : "--"}
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
        {type === "arrival" ? (
          <>
            <button
              onClick={addArrival}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg"
            >
              +1
            </button>
          </>
        ) : (
          <>
            <button
              onClick={arrivedAtService}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg"
            >
              Chegou no atendimento
            </button>
            <button
              onClick={completedService}
              disabled={!currentServicing}
              className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Completou atendimento
            </button>
          </>
        )}
      </div>
    </div>
  );
}
