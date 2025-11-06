"use client";

import { useState, useEffect, useMemo } from "react";
import { TimestampCard } from "../../components/TimestampCard";
import { Nav } from "../../components/Nav";
import { TimeConfig } from "../../components/TimeConfig";
import { AddQueue } from "../../components/AddQueue";
import { QueueItem } from "../../components/QueueItem";

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

export default function Chronometers() {
  const [queues, setQueues] = useState<
    { name: string; type: "arrival" | "service"; numAttendants?: number }[]
  >(() => {
    if (typeof window !== "undefined") {
      const storedQueues = localStorage.getItem("queueing-queues");
      return storedQueues ? JSON.parse(storedQueues) : [];
    }
    return [];
  });
  const [newQueue, setNewQueue] = useState("");
  const [newQueueType, setNewQueueType] = useState<"arrival" | "service">(
    "arrival"
  );
  const [numAttendants, setNumAttendants] = useState(1);
  const [data, setData] = useState<Record[]>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("queueing-data");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        return parsed.map((r: Partial<Record>, index: number) => ({
          id: r.id || `legacy-${Date.now()}-${index}`,
          ...r,
        }));
      }
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

  const [currentAppTimeMs, setCurrentAppTimeMs] = useState(() => Date.now());
  const currentAppTime = useMemo(
    () => new Date(currentAppTimeMs),
    [currentAppTimeMs]
  );
  const [milliseconds, setMilliseconds] = useState(0);

  const [timeMode, setTimeMode] = useState<"default" | "custom">("default");
  const [customStartTime, setCustomStartTime] = useState<Date | null>(null);

  const setCurrentAppTime = (date: Date) => setCurrentAppTimeMs(date.getTime());

  const updateMilliseconds = (ms: number) => {
    setMilliseconds(ms);
  };

  const handleSetTimeMode = (mode: "default" | "custom") => {
    setTimeMode(mode);
    if (mode === "custom" && !customStartTime) {
      const now = new Date();
      setCustomStartTime(now);
      setCurrentAppTimeMs(now.getTime());
    }
  };

  useEffect(() => {
    if (timeMode === "default") {
      const interval = setInterval(() => {
        setCurrentAppTimeMs(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeMode]);

  useEffect(() => {
    if (timeMode === "custom" && milliseconds > 0 && customStartTime) {
      const interval = setInterval(() => {
        setCurrentAppTimeMs((prev) => prev + milliseconds);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeMode, milliseconds, customStartTime]);

  const saveQueues = (
    newQueues: {
      name: string;
      type: "arrival" | "service";
      numAttendants?: number;
    }[]
  ) => {
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
    if (
      newQueue.trim() &&
      !queues.some((queue) => queue.name === newQueue.trim())
    ) {
      const newQueues = [
        ...queues,
        {
          name: newQueue.trim(),
          type: newQueueType,
          ...(newQueueType === "service" ? { numAttendants } : {}),
        },
      ];
      saveQueues(newQueues);
      setNewQueue("");
    }
  };

  const removeQueue = (index: number) => {
    const queueToRemove = queues[index];
    const newQueues = queues.filter((_, i) => i !== index);
    saveQueues(newQueues);

    const newData = data.filter(
      (record) => record.queue !== queueToRemove.name
    );
    saveData(newData);

    // Remove total for this queue
    const newTotals = { ...queueTotals };
    delete newTotals[queueToRemove.name];
    saveTotals(newTotals);
  };

  const getNextElement = (queue: string) => {
    const current = queueTotals[queue] || 0;
    const next = current + 1;
    const newTotals = { ...queueTotals, [queue]: next };
    saveTotals(newTotals);
    return next;
  };

  const recordEvent = (record: Omit<Record, "id">) => {
    const newRecord = {
      ...record,
      id: `record-${Date.now()}-${Math.random()}`,
    };
    saveData([...data, newRecord]);
  };

  return (
    <div>
      <Nav />
      <div
        className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--element-bg)] to-[var(--bg-gradient-end)] py-12 px-4 sm:px-6 lg:px-8"
        suppressHydrationWarning={true}
      >
        <div className="max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <TimestampCard currentTime={currentAppTime} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-8 text-center animate-slide-in-left">
            Cronômetros
          </h1>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Configuração de Tempo
            </h2>
            <TimeConfig
              timeMode={timeMode}
              setTimeMode={handleSetTimeMode}
              customStartTime={customStartTime}
              setCustomStartTime={setCustomStartTime}
              milliseconds={milliseconds}
              updateMilliseconds={updateMilliseconds}
              setCurrentAppTime={setCurrentAppTime}
            />
          </div>
          <div
            className="mb-8 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <AddQueue
              newQueue={newQueue}
              setNewQueue={setNewQueue}
              newQueueType={newQueueType}
              setNewQueueType={setNewQueueType}
              numAttendants={numAttendants}
              setNumAttendants={setNumAttendants}
              addQueue={addQueue}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {queues.map((queue, index) => (
              <QueueItem
                key={index}
                queue={queue}
                index={index}
                removeQueue={removeQueue}
                getNextElement={getNextElement}
                currentTotal={queueTotals[queue.name] || 0}
                onRecord={recordEvent}
                currentAppTimeMs={currentAppTimeMs}
                timeMode={timeMode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
