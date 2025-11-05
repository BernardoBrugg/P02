import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Chronometer } from "./Chronometer";

interface QueueItemProps {
  queue: { name: string; type: "arrival" | "service" };
  index: number;
  removeQueue: (index: number) => void;
  getNextElement: (queue: string) => number;
  currentTotal: number;
  onRecord: (record: Omit<Record, "id">) => void;
  currentAppTimeMs: number;
}

interface Record {
  id: string;
  queue: string;
  type: "arrival" | "service";
  timestamp: string;
  totalTime: number;
  element: number;
  arriving: string;
  exiting: string;
}

export function QueueItem({
  queue,
  index,
  removeQueue,
  getNextElement,
  currentTotal,
  onRecord,
  currentAppTimeMs,
}: QueueItemProps) {
  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
    >
      <Card className="p-6 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          {queue.name} ({queue.type === "arrival" ? "Chegada" : "Atendimento"})
        </h2>
        <Button variant="ghost" size="icon" onClick={() => removeQueue(index)}>
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
        </Button>
      </Card>
      <Chronometer
        queue={queue.name}
        type={queue.type}
        getNextElement={getNextElement}
        currentTotal={currentTotal}
        onRecord={onRecord}
        currentAppTimeMs={currentAppTimeMs}
      />
    </div>
  );
}
