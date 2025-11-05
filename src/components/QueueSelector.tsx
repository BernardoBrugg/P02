import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Queue {
  name: string;
  type: "arrival" | "service";
}

interface QueueSelectorProps {
  selectedArrivalQueue: string;
  setSelectedArrivalQueue: (value: string) => void;
  selectedServiceQueue: string;
  setSelectedServiceQueue: (value: string) => void;
  numServers: number;
  setNumServers: (value: number) => void;
  maxN: number;
  setMaxN: (value: number) => void;
  calculateQueueMetrics: () => void;
  arrivalQueues: Queue[];
  serviceQueues: Queue[];
}

export function QueueSelector({
  selectedArrivalQueue,
  setSelectedArrivalQueue,
  selectedServiceQueue,
  setSelectedServiceQueue,
  numServers,
  setNumServers,
  maxN,
  setMaxN,
  calculateQueueMetrics,
  arrivalQueues,
  serviceQueues,
}: QueueSelectorProps) {
  return (
    <Card className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
        Atrelar Filas e Calcular Sistema de Filas
      </h2>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="flex-1">
          <label className="block text-[var(--text-primary)] mb-2">
            Fila de Chegada
          </label>
          <Select
            value={selectedArrivalQueue}
            onValueChange={setSelectedArrivalQueue}
          >
            <SelectTrigger className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300">
              <SelectValue placeholder="Selecione fila de chegada" />
            </SelectTrigger>
            <SelectContent>
              {arrivalQueues.map((q) => (
                <SelectItem key={q.name} value={q.name}>
                  {q.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block text-[var(--text-primary)] mb-2">
            Fila de Atendimento
          </label>
          <Select
            value={selectedServiceQueue}
            onValueChange={setSelectedServiceQueue}
          >
            <SelectTrigger className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300">
              <SelectValue placeholder="Selecione fila de atendimento" />
            </SelectTrigger>
            <SelectContent>
              {serviceQueues.map((q) => (
                <SelectItem key={q.name} value={q.name}>
                  {q.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block text-[var(--text-primary)] mb-2">
            Número de Servidores
          </label>
          <input
            type="number"
            min="1"
            value={numServers}
            onChange={(e) => setNumServers(parseInt(e.target.value) || 1)}
            placeholder="Ex: 1 (M/M/1), 2 (M/M/2), etc."
            className="w-full px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[var(--text-primary)] mb-2">
            Número Máximo de Estados (n) para P(n)
          </label>
          <input
            type="number"
            min="0"
            value={maxN}
            onChange={(e) => setMaxN(parseInt(e.target.value) || 0)}
            placeholder="Ex: 10"
            className="w-full px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="flex-1 flex items-end">
          <Button onClick={calculateQueueMetrics} className="w-full px-6 py-3">
            Calcular Métricas
          </Button>
        </div>
      </div>
    </Card>
  );
}
