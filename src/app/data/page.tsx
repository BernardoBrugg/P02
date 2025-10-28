"use client";

import { useState } from "react";
import Papa from "papaparse";

interface Record {
  queue: string;
  timestamp: string;
  totalTime: number;
  element: number;
  arriving: string;
  exiting: string;
}

export default function Data() {
  const [data, setData] = useState<Record[]>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("queueing-data");
      return storedData ? JSON.parse(storedData) : [];
    }
    return [];
  });

  const saveData = (newData: Record[]) => {
    setData(newData);
    localStorage.setItem("queueing-data", JSON.stringify(newData));
  };

  const deleteRecord = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    saveData(newData);
  };

  const formatTime = (ms: number) => {
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
  };

  const exportToCSV = () => {
    const csvData = data.map((record) => ({
      Fila: record.queue,
      "Carimbo de Data/Hora": record.timestamp,
      "Tempo Total": formatTime(record.totalTime),
      Elemento: record.element,
      Chegando: record.arriving,
      Saindo: record.exiting,
    }));
    const csv = Papa.unparse(csvData, { delimiter: ";" });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "dados-filas.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600 mb-8 text-center animate-fade-in">
          Dados
        </h1>
        <div className="mb-8 text-center animate-slide-in-left">
          <button
            onClick={exportToCSV}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exportar para CSV
          </button>
        </div>
        {data.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 animate-fade-in">
            Nenhum dado registrado ainda.
          </p>
        ) : (
          <div
            className="overflow-x-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-orange-500 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Fila</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Carimbo de Data/Hora
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Tempo Total
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Elemento
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Chegando
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Saindo</th>
                  <th className="px-6 py-4 text-left font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <td className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-gray-900 dark:text-white">
                      {record.queue}
                    </td>
                    <td className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-gray-900 dark:text-white">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-gray-900 dark:text-white">
                      {formatTime(record.totalTime)}
                    </td>
                    <td className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-gray-900 dark:text-white">
                      {record.element}
                    </td>
                    <td className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-gray-900 dark:text-white">
                      {new Date(record.arriving).toLocaleString()}
                    </td>
                    <td className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-gray-900 dark:text-white">
                      {new Date(record.exiting).toLocaleString()}
                    </td>
                    <td className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                      <button
                        onClick={() => deleteRecord(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
