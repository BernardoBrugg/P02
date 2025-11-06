"use client";

import { useState, useEffect, useMemo } from "react";
import { TimestampCard } from "../../components/TimestampCard";
import { Nav } from "../../components/Nav";
import { AddQueue } from "../../components/AddQueue";
import { QueueItem } from "../../components/QueueItem";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

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
  >([]);
  const [newQueue, setNewQueue] = useState("");
  const [newQueueType, setNewQueueType] = useState<"arrival" | "service">(
    "arrival"
  );
  const [numAttendants, setNumAttendants] = useState(1);
  const [data, setData] = useState<Record[]>([]);
  const [queueTotals, setQueueTotals] = useState<{ [key: string]: number }>({});

  const [currentAppTimeMs, setCurrentAppTimeMs] = useState(() => Date.now());
  const currentAppTime = useMemo(
    () => new Date(currentAppTimeMs),
    [currentAppTimeMs]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAppTimeMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribeQueues = onSnapshot(collection(db, 'queues'), (snapshot) => {
      const q = snapshot.docs.map(doc => doc.data() as { name: string; type: "arrival" | "service"; numAttendants?: number });
      setQueues(q);
    });
    const unsubscribeData = onSnapshot(collection(db, 'data'), (snapshot) => {
      const d = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Record));
      setData(d);
    });
    const unsubscribeTotals = onSnapshot(collection(db, 'totals'), (snapshot) => {
      const t: { [key: string]: number } = {};
      snapshot.docs.forEach(doc => t[doc.id] = doc.data().total);
      setQueueTotals(t);
    });
    return () => {
      unsubscribeQueues();
      unsubscribeData();
      unsubscribeTotals();
    };
  }, []);

  const addQueue = async () => {
    if (
      newQueue.trim() &&
      !queues.some((queue) => queue.name === newQueue.trim())
    ) {
      try {
        await setDoc(doc(db, 'queues', newQueue.trim()), {
          name: newQueue.trim(),
          type: newQueueType,
          ...(newQueueType === "service" ? { numAttendants } : {})
        });
        await setDoc(doc(db, 'activeServices', newQueue.trim()), {currentServicing: []});
        await setDoc(doc(db, 'totals', newQueue.trim()), {total: 0});
        toast.success("Fila adicionada com sucesso!");
        setNewQueue("");
      } catch (error) {
        toast.error("Erro ao adicionar fila: " + (error instanceof Error ? error.message : String(error)));
      }
    } else {
      toast.warn("Nome da fila inválido ou já existe.");
    }
  };

  const removeQueue = async (index: number) => {
    const queueToRemove = queues[index];
    try {
      await deleteDoc(doc(db, 'queues', queueToRemove.name));
      await deleteDoc(doc(db, 'activeServices', queueToRemove.name));
      await deleteDoc(doc(db, 'totals', queueToRemove.name));
      toast.success("Fila removida com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover fila: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const getNextElement = (queue: string) => {
    const current = queueTotals[queue] || 0;
    const next = current + 1;
    setDoc(doc(db, 'totals', queue), {total: next});
    return next;
  };

  const recordEvent = (record: Omit<Record, "id">) => {
    addDoc(collection(db, 'data'), record);
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
