"use client";

import { useState, useEffect } from "react";

interface Record {
  queue: string;
  timestamp: string;
  totalTime: number;
  element: number;
  arriving: string;
  exiting: string;
}

interface ChronometerProps {
  queue: string;
  getNextElement: (queue: string) => number;
  currentTotal: number;
  onRecord: (record: Record) => void;
}

export function Chronometer({
  queue,
  getNextElement,
  currentTotal,
  onRecord,
}: ChronometerProps) {
  const [pendingClients, setPendingClients] = useState<
    { element: number; arriving: number }[]
  >([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [displayTime, setDisplayTime] = useState(0);
  const [currentWait, setCurrentWait] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime) {
      interval = setInterval(() => {
        setDisplayTime(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pendingClients.length > 0) {
      interval = setInterval(() => {
        setCurrentWait(Date.now() - pendingClients[0].arriving);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [pendingClients]);

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

  const arriving = () => {
    const now = Date.now();
    if (!startTime) {
      setStartTime(now);
    }
    const element = getNextElement(queue);
    setPendingClients((prev) => [...prev, { element, arriving: now }]);
  };

  const exiting = () => {
    if (pendingClients.length === 0) return;
    const client = pendingClients[0];
    setPendingClients((prev) => prev.slice(1));
    const exitingTime = Date.now();
    const totalTime = exitingTime - client.arriving;
    const record: Record = {
      queue,
      timestamp: new Date(exitingTime).toISOString(),
      totalTime,
      element: client.element,
      arriving: new Date(client.arriving).toISOString(),
      exiting: new Date(exitingTime).toISOString(),
    };
    onRecord(record);
  };

  const stop = () => {
    setStartTime(null);
    setPendingClients([]);
    setDisplayTime(0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {queue}
        </h3>
        <div className="text-4xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600 font-bold">
          {formatTime(displayTime)}
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Elementos Totais:
          </span>
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            {currentTotal}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Aguardando:
          </span>
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            {pendingClients.length}
          </span>
        </div>
        {pendingClients.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Espera Atual:
            </span>
            <span className="text-xl font-mono text-orange-500 font-bold">
              {formatTime(currentWait)}
            </span>
          </div>
        )}
      </div>
      <div className="flex space-x-4 justify-center">
        <button
          onClick={arriving}
          disabled={pendingClients.length > 0}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-semibold hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          Chegando
        </button>
        <button
          onClick={exiting}
          disabled={pendingClients.length === 0}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          Saindo
        </button>
        <button
          onClick={stop}
          className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-500 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 10h6m-6 4h6"
            />
          </svg>
          Parar
        </button>
      </div>
    </div>
  );
}
