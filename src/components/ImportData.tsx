import React from "react";

interface ImportDataProps {
  handleImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImportData({
  handleImport,
}: ImportDataProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
        Importar Dados
      </h2>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="file"
          accept=".csv"
          multiple
          onChange={handleImport}
          className="flex-1 px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
        />
      </div>
    </div>
  );
}
