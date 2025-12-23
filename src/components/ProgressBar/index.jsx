import React, { useEffect, useState } from "react";

export default function ProgressPage() {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("running"); // running | done | error

  useEffect(() => {
    // escuta logs
    window.electron.onConfigLog((message) => {
      setLogs((prev) => [...prev, message]);
    });

    // escuta progresso
    window.electron.onConfigProgress((value) => {
      setProgress(value);
    });

    // escuta finalização
    window.electron.onConfigFinished((result) => {
      setStatus(result.success ? "done" : "error");
      setProgress(100);
    });

    // cleanup (boa prática)
    return () => {
      window.electron.removeAllListeners();
    };
  }, []);

  return (
    <section className="min-h-screen bg-primary text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-2xl font-righteous mb-6">
        Configurando o sistema
      </h1>

      {/* Barra de progresso */}
      <div className="w-full max-w-xl bg-gray-700 rounded-full h-4 overflow-hidden mb-4">
        <div
          className="bg-white h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mb-6">{progress}%</p>

      {/* Logs */}
      <div className="w-full max-w-xl bg-black/40 rounded-lg p-4 h-64 overflow-y-auto text-sm font-mono">
        {logs.map((log, index) => (
          <div key={index} className="mb-1">
            {log}
          </div>
        ))}
      </div>

      {/* Status */}
      {status === "done" && (
        <p className="mt-4 text-green-400 font-bold">
          ✔ Configuração finalizada com sucesso
        </p>
      )}

      {status === "error" && (
        <p className="mt-4 text-red-400 font-bold">
          ✖ Erro durante a configuração
        </p>
      )}

    </section>
  );
}
