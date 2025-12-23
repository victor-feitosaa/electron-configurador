import React, { useEffect, useState } from "react";

export default function ModalSettings({ isOpen, onClose, onApply }) {
  const [configLocal, setConfigLocal] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const configInicial = {
        apps: {
          chrome: { enabled: true },
          vlc: { enabled: true },
          winrar: { enabled: true },
          adobe: { enabled: true },
          java: { enabled: true },
        },
        sistema: {
          energia: { enabled: true },
          windowsUpdate: { enabled: true },
          fuso: { value: "America/Sao_Paulo" },
        },
        extras: {
          instaladoresImportados: [],
        },
      };

      setConfigLocal(JSON.parse(JSON.stringify(configInicial)));
    }
  }, [isOpen]);

  if (!isOpen || !configLocal) return null;

  function toggleSistema(key) {
    setConfigLocal(prev => ({
      ...prev,
      sistema: {
        ...prev.sistema,
        [key]: {
          ...prev.sistema[key],
          enabled: !prev.sistema[key].enabled,
        },
      },
    }));
  }

  function alterarFuso(valor) {
    setConfigLocal(prev => ({
      ...prev,
      sistema: {
        ...prev.sistema,
        fuso: {
          value: valor,
        },
      },
    }));
  }

  function toggleApp(appKey) {
    setConfigLocal(prev => ({
      ...prev,
      apps: {
        ...prev.apps,
        [appKey]: {
          ...prev.apps[appKey],
          enabled: !prev.apps[appKey].enabled,
        },
      },
    }));
  }

  function importarInstalador(event) {
    const file = event.target.files[0];
    if (!file) return;

    const novoInstalador = {
      nome: file.name,
      caminho: file.path || file.name, // no Electron vem path
      tipo: file.name.endsWith(".msi") ? "msi" : "exe",
    };

    setConfigLocal(prev => ({
      ...prev,
      extras: {
        ...prev.extras,
        instaladoresImportados: [
          ...prev.extras.instaladoresImportados,
          novoInstalador,
        ],
      },
    }));
  }


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-primary w-full max-w-lg rounded-lg p-6 text-white">

        <h2 className="text-lg font-bold mb-4">
          Configuração Personalizada
        </h2>

        {/* APPS */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Aplicativos</h3>

          <div className="space-y-2">
            {Object.entries(configLocal.apps).map(([key, data]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.enabled}
                  onChange={() => toggleApp(key)}
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SISTEMA */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Sistema</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={configLocal.sistema.energia.enabled}
                onChange={() => toggleSistema("energia")}
              />
              Economia de energia
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={configLocal.sistema.windowsUpdate.enabled}
                onChange={() => toggleSistema("windowsUpdate")}
              />
              Windows Update
            </label>

            <div>
              <label className="block text-sm mb-1">
                Fuso horário
              </label>
              <select
                value={configLocal.sistema.fuso.value}
                onChange={(e) => alterarFuso(e.target.value)}
                className="w-full p-2 rounded text-black"
              >
                <option value="America/Sao_Paulo">São Paulo</option>
                <option value="America/Rio_Branco">Rio Branco</option>
                <option value="America/Manaus">Manaus</option>
              </select>
            </div>
          </div>
        </div>

        {/* INSTALADORES */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">
            Instaladores personalizados
          </h3>

          <input
            type="file"
            accept=".exe,.msi"
            onChange={importarInstalador}
            className="block w-full text-sm text-gray-300"
          />

          {configLocal.extras.instaladoresImportados.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {configLocal.extras.instaladoresImportados.map((inst, index) => (
                <li key={index} className="flex justify-between">
                  <span>{inst.nome}</span>
                  <span className="text-gray-400 uppercase">
                    {inst.tipo}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>


        {/* BOTÕES */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600"
          >
            Cancelar
          </button>

          <button
            onClick={() => onApply(configLocal)}
            className="px-4 py-2 rounded bg-white text-primary font-bold"
          >
            Aplicar
          </button>
        </div>

      </div>
    </div>
  );
}
