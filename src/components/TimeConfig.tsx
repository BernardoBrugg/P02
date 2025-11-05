import { useState } from "react";

interface TimeConfigProps {
  timeMode: 'default' | 'custom';
  setTimeMode: (mode: 'default' | 'custom') => void;
  customStartTime: Date | null;
  setCustomStartTime: (value: Date | null) => void;
  milliseconds: number;
  updateMilliseconds: (ms: number) => void;
  setCurrentAppTime: (value: Date) => void;
}

export function TimeConfig({
  timeMode,
  setTimeMode,
  customStartTime,
  setCustomStartTime,
  milliseconds,
  updateMilliseconds,
  setCurrentAppTime,
}: TimeConfigProps) {
  const [dateError, setDateError] = useState("");
  const [msError, setMsError] = useState("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      setDateError("Data e hora inválidas");
      return;
    }
    setDateError("");
    setCustomStartTime(date);
    setCurrentAppTime(date);
  };

  const handleMsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = Number(value);
    if (isNaN(num) || num < 0 || num >= 1000) {
      setMsError("Milissegundos devem ser um número entre 0 e 999");
      return;
    }
    setMsError("");
    updateMilliseconds(num);
  };

  return (
    <div className="bg-[var(--element-bg)] p-6 rounded-lg shadow-lg border border-[var(--border-color)]">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="timeMode"
              value="default"
              checked={timeMode === 'default'}
              onChange={() => setTimeMode('default')}
              className="mr-2"
            />
            Horário Padrão
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="timeMode"
              value="custom"
              checked={timeMode === 'custom'}
              onChange={() => setTimeMode('custom')}
              className="mr-2"
            />
            Horário Personalizado
          </label>
        </div>
        {timeMode === 'custom' && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Data e Hora Inicial
              </label>
              <input
                type="datetime-local"
                value={
                  customStartTime
                    ? customStartTime.toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleDateChange}
                className="w-full px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
              />
              {dateError && (
                <p className="text-red-500 text-sm mt-1">{dateError}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Milissegundos por Segundo
              </label>
              <input
                type="number"
                value={milliseconds}
                onChange={handleMsChange}
                placeholder="Milissegundos"
                className="w-full px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
              />
              {msError && <p className="text-red-500 text-sm mt-1">{msError}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
