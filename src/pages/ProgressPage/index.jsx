import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/ProgressBar";
import LogsPanel from "../../components/LogsPanel";

export default function ProgressPage() {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("running");

  useEffect(() => {
    // Logs em tempo real
    window.electron.ipcRenderer.on("log", (_, message) => {
      setLogs((prev) => [...prev, message]);
    });

    // Progresso
    window.electron.ipcRenderer.on("progress", (_, value) => {
      setProgress(value);
    });

    // Finalização
    window.electron.ipcRenderer.on("done", () => {
      setStatus("done");
      setProgress(100);
    });

    window.electron.ipcRenderer.on("error", (_, err) => {
      setStatus("error");
      setLogs((prev) => [...prev, `❌ Erro: ${err}`]);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners("log");
      window.electron.ipcRenderer.removeAllListeners("progress");
      window.electron.ipcRenderer.removeAllListeners("done");
      window.electron.ipcRenderer.removeAllListeners("error");
    };
  }, []);

  return (
    <section className="min-h-screen bg-primary text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-righteous mb-6">
        Configuração em andamento
      </h1>

      <ProgressBar progress={progress} />

      <div className="mt-6 w-full max-w-3xl">
        <LogsPanel logs={logs} />
      </div>

      <div className="mt-4 text-sm opacity-80">
        Status: {status}
      </div>
    </section>
  );
}
