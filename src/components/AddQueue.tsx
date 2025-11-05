import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AddQueueProps {
  newQueue: string;
  setNewQueue: (value: string) => void;
  newQueueType: "arrival" | "service";
  setNewQueueType: (value: "arrival" | "service") => void;
  addQueue: () => void;
}

export function AddQueue({
  newQueue,
  setNewQueue,
  newQueueType,
  setNewQueueType,
  addQueue,
}: AddQueueProps) {
  return (
    <Card className="p-6 mb-4">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <input
          type="text"
          value={newQueue}
          onChange={(e) => setNewQueue(e.target.value)}
          placeholder="Nome da nova fila"
          className="flex-1 px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
        />
        <Select
          value={newQueueType}
          onValueChange={(value) =>
            setNewQueueType(value as "arrival" | "service")
          }
        >
          <SelectTrigger className="px-4 py-3 rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arrival">Chegada</SelectItem>
            <SelectItem value="service">Atendimento</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addQueue} className="px-6 py-3">
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
        </Button>
      </div>
    </Card>
  );
}
