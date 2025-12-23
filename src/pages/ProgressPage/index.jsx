import { useEffect, useState } from "react";

const etapas = ["prepare", "apps", "system", "finish"];

export default function ProgressPage() {
  const [etapaAtual, setEtapaAtual] = useState("prepare");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!window.electron) return;

    window.electron.onProgress(({ etapa, log }) => {
      setEtapaAtual(etapa);
      setLogs((prev) => [...prev, `[${etapa}] ${log}`]);
    });
  }, []);

  const progresso =
    ((etapas.indexOf(etapaAtual) + 1) / etapas.length) * 100;

  return (
    <div className="min-h-screen bg-primary text-white p-6">
      <h1 className="text-2xl mb-4">Configurando máquina...</h1>

      {/* Barra de progresso */}
      <div className="w-full bg-gray-700 rounded h-4 mb-4">
        <div
          className="bg-green-500 h-4 rounded transition-all"
          style={{ width: `${progresso}%` }}
        />
      </div>

      {/* Etapa atual */}
      <p className="mb-4">
        Etapa atual: <strong>{etapaAtual}</strong>
      </p>

      {/* Logs */}
      <div className="bg-black rounded p-3 h-80 overflow-y-auto text-sm font-mono">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}
