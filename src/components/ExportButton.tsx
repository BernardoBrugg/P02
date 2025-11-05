import React from "react";

interface ExportButtonProps {
  selectedArrivalQueue: string | null;
  exportToCSV: (queueName: string) => void;
}

export function ExportButton({
  selectedArrivalQueue,
  exportToCSV,
}: ExportButtonProps) {
  if (!selectedArrivalQueue) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => exportToCSV(selectedArrivalQueue)}
        className="px-8 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white rounded-xl font-semibold hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all duration-300 transform hover:scale-105 shadow-lg"
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
  );
}
