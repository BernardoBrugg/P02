"use client";

import { useState, useEffect } from "react";

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
}

export function Chronometer({
  queue,
  type,
  getNextElement,
  currentTotal,
  onRecord,
}: ChronometerProps) {
  const [pendingClients, setPendingClients] = useState<
    { element: number; arriving: number }[]
  >([]);
  const [currentServicing, setCurrentServicing] = useState<{
    element: number;
    arrivedTime: number;
    startTime: string;
  } | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [displayTime, setDisplayTime] = useState(0);
  const [currentWait, setCurrentWait] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (type === "arrival" && startTime) {
      interval = setInterval(() => {
        setDisplayTime(Date.now() - startTime);
      }, 10);
    } else if (type === "service" && currentServicing) {
      interval = setInterval(() => {
        setDisplayTime(Date.now() - currentServicing.arrivedTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [startTime, currentServicing, type]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (type === "arrival" && pendingClients.length > 0) {
      interval = setInterval(() => {
        setCurrentWait(Date.now() - pendingClients[0].arriving);
      }, 10);
    } else if (type === "service" && currentServicing) {
      interval = setInterval(() => {
        setCurrentWait(Date.now() - currentServicing.arrivedTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [pendingClients, currentServicing, type]);

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

  const stop = () => {
    setStartTime(null);
    setPendingClients([]);
    setCurrentServicing(null);
    setDisplayTime(0);
  };

  const addArrival = () => {
    const now = Date.now();
    if (!startTime) {
      setStartTime(now);
    }
    const element = getNextElement(queue);
    const record: Record = {
      queue,
      type,
      timestamp: new Date().toISOString(),
      totalTime: 0,
      element,
      arriving: new Date().toISOString(),
      exiting: "",
    };
    onRecord(record);
  };

  const arrivedAtService = () => {
    const element = getNextElement(queue);
    const startTime = new Date().toISOString();
    setCurrentServicing({ element, arrivedTime: Date.now(), startTime });
  };

  const completedService = () => {
    if (currentServicing) {
      const exitingTime = Date.now();
      const totalTime = exitingTime - currentServicing.arrivedTime;
      const record: Record = {
        queue,
        type,
        timestamp: currentServicing.startTime,
        totalTime,
        element: currentServicing.element,
        arriving: currentServicing.startTime,
        exiting: new Date().toISOString(),
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
              className="flex-1 px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:bg-[var(--accent-hover)] transition-all duration-300 shadow-lg"
            >
              +1
            </button>
          </>
        ) : (
          <>
            <button
              onClick={arrivedAtService}
              className="flex-1 px-6 py-3 bg-[var(--button-info)] text-white rounded-xl font-semibold hover:bg-[var(--button-info-hover)] transition-all duration-300 shadow-lg"
            >
              Chegou no atendimento
            </button>
            <button
              onClick={completedService}
              disabled={!currentServicing}
              className="flex-1 px-6 py-3 bg-[var(--button-success)] text-white rounded-xl font-semibold hover:bg-[var(--button-success-hover)] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Completou atendimento
            </button>
          </>
        )}
      </div>
    </div>
  );
}
