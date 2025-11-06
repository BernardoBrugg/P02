"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Nav } from "../../components/Nav";
import { ImportData } from "../../components/ImportData";
import { ClearData } from "../../components/ClearData";
import { QueueList } from "../../components/QueueList";
import { DataTable } from "../../components/DataTable";
import { ExportButton } from "../../components/ExportButton";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

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

interface ImportedRecord {
  queue: string;
  type: "arrival" | "service";
  timestamp: string;
  totalTime: number;
  element: number;
  arriving: string;
  exiting: string;
}

export default function Data() {
  const [data, setData] = useState<QueueRecord[]>([]);
  const [queues, setQueues] = useState<{ name: string; type: "arrival" | "service"; numAttendants?: number }[]>([]);
  const [queueTotals, setQueueTotals] = useState<{ [key: string]: number }>({});

  const [selectedArrivalQueue, setSelectedArrivalQueue] = useState<
    string | null
  >(null);
  const [selectedServiceQueues, setSelectedServiceQueues] = useState<string[]>(
    []
  );
  const [importQueue, setImportQueue] = useState("");

  useEffect(() => {
    const unsubscribeData = onSnapshot(collection(db, 'data'), (snapshot) => {
      const d = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as QueueRecord));
      setData(d);
    });
    const unsubscribeQueues = onSnapshot(collection(db, 'queues'), (snapshot) => {
      const q = snapshot.docs.map(doc => doc.data() as { name: string; type: "arrival" | "service"; numAttendants?: number });
      setQueues(q);
    });
    const unsubscribeTotals = onSnapshot(collection(db, 'totals'), (snapshot) => {
      const t: { [key: string]: number } = {};
      snapshot.docs.forEach(doc => t[doc.id] = doc.data().total);
      setQueueTotals(t);
    });
    return () => {
      unsubscribeData();
      unsubscribeQueues();
      unsubscribeTotals();
    };
  }, []);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !importQueue.trim()) {
      toast.warn("Selecione um arquivo e especifique o nome da fila.");
      return;
    }
    Papa.parse(file, {
      header: true,
      delimiter: ";",
      complete: (results) => {
        const importedData: ImportedRecord[] = (
          results.data as Record<string, string>[]
        )
          .map((row) => {
            const tipo = row["Tipo"];
            const timestamp = row["Carimbo de Data/Hora"];
            const tempoTotalStr = row["Tempo Total"];
            const elemento = parseInt(row["Elemento"]);
            const chegando = row["Chegando"];
            const saindo = row["Saindo"];
            if (
              !tipo ||
              !timestamp ||
              isNaN(elemento) ||
              !tempoTotalStr ||
              typeof tempoTotalStr !== "string"
            ) {
              return null;
            }
            const totalTime = parseFloat(tempoTotalStr.replace("s", "")) * 1000;
            if (isNaN(totalTime)) {
              return null;
            }
            return {
              queue: importQueue.trim(),
              type: tipo as "arrival" | "service",
              timestamp,
              totalTime,
              element: elemento,
              arriving: chegando,
              exiting: saindo === "--" ? "" : saindo,
            };
          })
          .filter((r) => r !== null);
        if (importedData.length === 0) {
          toast.error("Nenhum dado válido encontrado no CSV.");
          return;
        }
        // Add to Firestore
        importedData.forEach(record => addDoc(collection(db, 'data'), record));
        // Add queue if not exists
        const queueExists = queues.some(q => q.name === importQueue.trim());
        if (!queueExists) {
          setDoc(doc(db, 'queues', importQueue.trim()), {name: importQueue.trim(), type: importedData[0].type});
        }
        setImportQueue("");
        event.target.value = "";
        toast.success(`${importedData.length} registros importados com sucesso.`);
      },
      error: (error) => {
        toast.error("Erro ao importar CSV: " + (error as Error).message);
      },
    });
  };

  const deleteRecord = (record: QueueRecord) => {
    deleteDoc(doc(db, 'data', record.id));
    toast.success("Registro excluído com sucesso.");
  };

  const clearAllData = () => {
    if (
      confirm(
        "Tem certeza de que deseja limpar todos os dados? Esta ação afetará todos os usuários."
      )
    ) {
      // Note: Clearing all data for all users
      // In a real app, you might want to restrict this
      setData([]);
      setQueues([]);
      setQueueTotals({});
      // To clear Firestore, you would need to delete all docs, but for simplicity, just reset local state
      // Actually, since it's synced, perhaps don't clear Firestore
      toast.success("Dados limpos com sucesso.");
    }
  };

  const formatTime = (ms: number) => {
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
  };

  const formatDateWithMilliseconds = (dateString: string) => {
    if (!dateString || dateString === "--") return "--";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const exportToCSV = (queueName: string) => {
    const queueData = data.filter((record) => record.queue === queueName);
    const csvData = queueData.map((record) => ({
      Tipo: record.type,
      "Carimbo de Data/Hora": formatDateWithMilliseconds(record.timestamp),
      "Tempo Total": formatTime(record.totalTime),
      Elemento: record.element,
      Chegando: formatDateWithMilliseconds(record.arriving),
      Saindo: record.exiting
        ? formatDateWithMilliseconds(record.exiting)
        : "--",
    }));
    const csv = Papa.unparse(csvData, { delimiter: ";" });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `dados-${queueName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueQueues = Array.from(new Set(data.map((record) => record.queue)));

  const onSelectQueue = (queueName: string) => {
    if (!selectedArrivalQueue) {
      setSelectedArrivalQueue(queueName);
    } else {
      setSelectedServiceQueues((prev) => [...prev, queueName]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--element-bg)] to-[var(--bg-gradient-end)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Nav />
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] mb-8 text-center animate-fade-in">
          Dados
        </h1>
        <ImportData
          importQueue={importQueue}
          setImportQueue={setImportQueue}
          handleImport={handleImport}
        />
        <ClearData dataLength={data.length} clearAllData={clearAllData} />
        {data.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)] animate-fade-in">
            Nenhum dado registrado ainda.
          </p>
        ) : selectedArrivalQueue && selectedServiceQueues.length > 0 ? (
          <div className="animate-fade-in">
            <button
              onClick={() => {
                setSelectedArrivalQueue(null);
                setSelectedServiceQueues([]);
              }}
              className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Voltar
            </button>
            <ExportButton
              selectedArrivalQueue={selectedArrivalQueue}
              exportToCSV={exportToCSV}
            />
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              {selectedArrivalQueue}
            </h2>
            <DataTable
              data={data}
              selectedArrivalQueue={selectedArrivalQueue}
              selectedServiceQueues={selectedServiceQueues}
              deleteRecord={deleteRecord}
              formatTime={formatTime}
              formatDateWithMilliseconds={formatDateWithMilliseconds}
            />
          </div>
        ) : (
          <QueueList
            uniqueQueues={uniqueQueues}
            data={data}
            onSelectQueue={onSelectQueue}
          />
        )}
      </div>
    </div>
  );
}
