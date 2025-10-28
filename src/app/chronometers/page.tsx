"use client";

import { useState } from "react";
import { Chronometer } from "../../components/Chronometer";
import { TimestampCard } from "../../components/TimestampCard";

interface Record {
  queue: string;
  timestamp: string;
  totalTime: number;
  element: number;
  arriving: string;
  exiting: string;
}

export default function Chronometers() {
  const [queues, setQueues] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const storedQueues = localStorage.getItem("queueing-queues");
      return storedQueues ? JSON.parse(storedQueues) : [];
    }
    return [];
  });
  const [newQueue, setNewQueue] = useState("");
  const [data, setData] = useState<Record[]>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("queueing-data");
      return storedData ? JSON.parse(storedData) : [];
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

  const saveQueues = (newQueues: string[]) => {
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
    if (newQueue.trim() && !queues.includes(newQueue.trim())) {
      const newQueues = [...queues, newQueue.trim()];
      saveQueues(newQueues);
      setNewQueue("");
    }
  };

  const removeQueue = (index: number) => {
    const newQueues = queues.filter((_, i) => i !== index);
    saveQueues(newQueues);
  };

  const getNextElement = (queue: string) => {
    const current = queueTotals[queue] || 0;
    const next = current + 1;
    const newTotals = { ...queueTotals, [queue]: next };
    saveTotals(newTotals);
    return next;
  };

  const recordEvent = (record: Record) => {
    saveData([...data, record]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-fade-in">
          <TimestampCard />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600 mb-8 text-center animate-slide-in-left">
          Cronômetros
        </h1>
        <div
          className="mb-8 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
              <input
                type="text"
                value={newQueue}
                onChange={(e) => setNewQueue(e.target.value)}
                placeholder="Nome da nova fila"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              />
              <button
                onClick={addQueue}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {queue}
                </h2>
                <button
                  onClick={() => removeQueue(index)}
                  className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
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
                queue={queue}
                getNextElement={getNextElement}
                currentTotal={queueTotals[queue] || 0}
                onRecord={recordEvent}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
