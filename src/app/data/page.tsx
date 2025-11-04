"use client";

import { useState, useMemo } from "react";
import Papa from "papaparse";
import { Nav } from "../../components/Nav";

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

interface LinkedItem {
  customer: number;
  arrivalTime: number;
  serviceTime: number;
  interarrival: number;
}

export default function Data() {
  const [data, setData] = useState<QueueRecord[]>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("queueing-data");
      if (storedData) {
        const parsed = JSON.parse(storedData) as QueueRecord[];
        return parsed.map((r: QueueRecord, index: number) => ({
          ...r,
          id: r.id || `legacy-${Date.now()}-${index}`,
        }));
      }
    }
    return [];
  });

  const [selectedArrivalQueue, setSelectedArrivalQueue] = useState<
    string | null
  >(null);
  const [selectedServiceQueues, setSelectedServiceQueues] = useState<string[]>(
    []
  );
  const [importQueue, setImportQueue] = useState("");

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !importQueue.trim()) {
      alert("Selecione um arquivo e especifique o nome da fila.");
      return;
    }
    Papa.parse(file, {
      header: true,
      delimiter: ";",
      complete: (results) => {
        const importedData: QueueRecord[] = (
          results.data as Record<string, string>[]
        )
          .map((row, index) => {
            const tipo = row["Tipo"];
            const timestamp = row["Carimbo de Data/Hora"];
            const tempoTotalStr = row["Tempo Total"];
            const elemento = parseInt(row["Elemento"]);
            const chegando = row["Chegando"];
            const saindo = row["Saindo"];
            const totalTime = parseFloat(tempoTotalStr.replace("s", "")) * 1000;
            return {
              id: `import-${Date.now()}-${index}`,
              queue: tipo as "arrival" | "service",
              type: tipo as "arrival" | "service",
              timestamp,
              totalTime,
              element: elemento,
              arriving: chegando,
              exiting: saindo === "--" ? "" : saindo,
            };
          })
          .filter(
            (r) =>
              r.type && r.timestamp && !isNaN(r.element) && !isNaN(r.totalTime)
          );
        if (importedData.length === 0) {
          alert("Nenhum dado válido encontrado no CSV.");
          return;
        }
        saveData([...data, ...importedData]);
        setImportQueue("");
        event.target.value = "";
        alert(`${importedData.length} registros importados com sucesso.`);
      },
      error: (error) => {
        alert("Erro ao importar CSV: " + error.message);
      },
    });
  };

  const linkedData = useMemo<LinkedItem[]>(() => {
    if (selectedArrivalQueue && selectedServiceQueues.length > 0) {
      const arrivals = data
        .filter((r) => r.queue === selectedArrivalQueue && r.type === "arrival")
        .sort(
          (a, b) =>
            new Date(a.arriving).getTime() - new Date(b.arriving).getTime()
        );
      const services = data.filter(
        (r) => selectedServiceQueues.includes(r.queue) && r.type === "service"
      );
      const linked: LinkedItem[] = [];
      arrivals.forEach((arrival) => {
        const service = services.find((s) => s.element === arrival.element);
        if (service) {
          linked.push({
            customer: arrival.element,
            arrivalTime: new Date(arrival.arriving).getTime(),
            serviceTime: service.totalTime,
            interarrival: 0,
          });
        }
      });
      linked.sort((a, b) => a.arrivalTime - b.arrivalTime);
      linked.forEach((item, index) => {
        item.interarrival =
          index === 0 ? 0 : item.arrivalTime - linked[index - 1].arrivalTime;
      });
      return linked;
    } else {
      return [];
    }
  }, [selectedArrivalQueue, selectedServiceQueues, data]);

  const saveData = (newData: QueueRecord[]) => {
    setData(newData);
    localStorage.setItem("queueing-data", JSON.stringify(newData));
  };

  const deleteRecord = (record: QueueRecord) => {
    const newData = data.filter((r) => r.id !== record.id);
    saveData(newData);
  };

  const clearAllData = () => {
    if (
      confirm(
        "Tem certeza de que deseja limpar todos os dados? Esta ação não pode ser desfeita."
      )
    ) {
      saveData([]);
      setSelectedArrivalQueue(null);
      setSelectedServiceQueues([]);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--element-bg)] to-[var(--bg-gradient-end)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Nav />
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] mb-8 text-center animate-fade-in">
          Dados
        </h1>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
            Importar Dados
          </h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              value={importQueue}
              onChange={(e) => setImportQueue(e.target.value)}
              placeholder="Nome da fila"
              className="flex-1 px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
            />
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="flex-1 px-4 py-3 border border-[var(--element-border)] rounded-xl bg-[var(--element-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>
        {data.length > 0 && (
          <div className="mb-8 text-center">
            <button
              onClick={clearAllData}
              className="px-8 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Limpar Todos os Dados
            </button>
          </div>
        )}
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
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              {selectedArrivalQueue} & {selectedServiceQueues.join(", ")}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-[var(--element-bg)] rounded-2xl shadow-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Tipo</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Carimbo de Data/Hora
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Tempo Total
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Elemento
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Chegando
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Saindo
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .filter(
                      (record) =>
                        record.queue === selectedArrivalQueue ||
                        selectedServiceQueues.includes(record.queue)
                    )
                    .map((record, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[var(--text-secondary)] transition-colors duration-300"
                      >
                        <td className="border-t border-[var(--element-border)] px-6 py-4 text-[var(--text-primary)]">
                          {record.type}
                        </td>
                        <td className="border-t border-[var(--element-border)] px-6 py-4 text-[var(--text-primary)]">
                          {formatDateWithMilliseconds(record.timestamp)}
                        </td>
                        <td className="border-t border-[var(--element-border)] px-6 py-4 text-[var(--text-primary)]">
                          {formatTime(record.totalTime)}
                        </td>
                        <td className="border-t border-[var(--element-border)] px-6 py-4 text-[var(--text-primary)]">
                          {record.element}
                        </td>
                        <td className="border-t border-[var(--element-border)] px-6 py-4 text-[var(--text-primary)]">
                          {formatDateWithMilliseconds(record.arriving)}
                        </td>
                        <td className="border-t border-[var(--element-border)] px-6 py-4 text-[var(--text-primary)]">
                          {record.exiting
                            ? formatDateWithMilliseconds(record.exiting)
                            : "--"}
                        </td>
                        <td className="border-t border-[var(--element-border)] px-6 py-4">
                          <button
                            onClick={() => deleteRecord(record)}
                            className="text-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300 p-2 rounded-full hover:bg-[var(--text-muted)]"
                          >
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
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                Dados Vinculados por Cliente
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-[var(--element-bg)] rounded-2xl shadow-xl overflow-hidden">
                  <thead className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Tempo de Chegada
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Tempo de Serviço
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Tempo Interchegada
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {linkedData.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[var(--text-secondary)] transition-colors duration-300"
                      >
                        <td className="border-t border-[var(--element-border)] px-6 py-4 text-[var(--text-primary)]">
                          {item.customer}
                        </td>
                        <td className="border-t border-[var(--element-border)] px-6 py-4 text-[var(--text-primary)]">
                          {formatDateWithMilliseconds(
                            item.arrivalTime.toString()
                          )}
                        </td>
                        <td className="border-t border-[var(--element-border)] px-6 py-4 text-[var(--text-primary)]">
                          {formatTime(item.serviceTime)}
                        </td>
                        <td className="border-t border-[var(--element-border)] px-6 py-4 text-[var(--text-primary)]">
                          {formatTime(item.interarrival)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
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
                  onClick={() => {
                    if (!selectedArrivalQueue) {
                      setSelectedArrivalQueue(queueName);
                    } else {
                      setSelectedServiceQueues((prev) => [...prev, queueName]);
                    }
                  }}
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
        )}
      </div>
    </div>
  );
}
