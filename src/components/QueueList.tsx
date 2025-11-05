import React from "react";

interface QueueRecord {
  id: string;
  queue: string;
  type: "arrival" | "service";
  timestamp: string;
  totalTime: number;
  element: number;
  arriving: string;
  exiting: string;
}

interface QueueListProps {
  uniqueQueues: string[];
  data: QueueRecord[];
  onSelectQueue: (queueName: string) => void;
}

export function QueueList({
  uniqueQueues,
  data,
  onSelectQueue,
}: QueueListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {uniqueQueues.map((queueName) => {
        const queueData = data.filter((r) => r.queue === queueName);
        const arrivalsCount = queueData.filter(
          (r) => r.type === "arrival"
        ).length;
        const servicesCount = queueData.filter(
          (r) => r.type === "service"
        ).length;
        return (
          <div
            key={queueName}
            className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow-md cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
            onClick={() => onSelectQueue(queueName)}
          >
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              {queueName}
            </h3>
            <p>
              <strong>Total de Registros:</strong> {queueData.length}
            </p>
            <p>
              <strong>Chegadas:</strong> {arrivalsCount}
            </p>
            <p>
              <strong>Atendimentos:</strong> {servicesCount}
            </p>
          </div>
        );
      })}
    </div>
  );
}
