import React from "react";

interface ClearDataProps {
  dataLength: number;
  clearAllData: () => void;
}

export function ClearData({ dataLength, clearAllData }: ClearDataProps) {
  if (dataLength === 0) return null;

  return (
    <div className="mb-8 text-center">
      <button
        onClick={clearAllData}
        className="px-8 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Limpar Todos os Dados
      </button>
    </div>
  );
}
