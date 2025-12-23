import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfigOption from "../../components/ConfigOption";
import MudarNome from "../../components/MudarNome";
import ModalSettings from "../../components/ModalSettings";

/**
 * MODELO BASE DA CONFIGURAÇÃO
 * (contrato entre front e back)
 */
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
    fuso: { value: "America/Rio_Branco" },
    papelDeParede: { enabled: false, path: "" },
  },
  extras: {
    instaladoresImportados: [],
  },
};

export default function MainPage() {
  const navigate = useNavigate();

  // "padrao" | "personalizada" | null
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // configuração ativa
  const [configAtual, setConfigAtual] = useState(configInicial);

  // nome da máquina
  const [nomeMaquina, setNomeMaquina] = useState("");

  function handlePadrao() {
    setSelectedOption("padrao");
    setConfigAtual(configInicial);
  }

  function handlePersonalizada() {
    setModalOpen(true);
  }

  function aplicarPersonalizada(novaConfig) {
    setConfigAtual(novaConfig);
    setSelectedOption("personalizada");
    setModalOpen(false);
  }

  async function iniciarConfiguracao() {
    if (!selectedOption) return;

    // segurança para rodar no navegador
    if (!window.electron) {
      console.warn("Electron não disponível (modo web)");
      return;
    }

    const payload = {
      tipo: selectedOption,
      nomeMaquina,
      config: configAtual,
    };

    console.log("Payload enviado:", payload);

    navigate("/progress", { state: payload });

    // próximo passo (depois):
    // navigate("/progresso");
  }

  return (
    <section className="relative z-10 min-h-screen w-full max-w-[1440px] mx-auto flex flex-col justify-center bg-primary py-10">
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-white">

        <h1 className="text-xl lg:text-2xl font-righteous mb-6">
          SELECIONE UMA CONFIGURAÇÃO
        </h1>

        {/* Opções */}
        <div className="w-full max-w-xl space-y-4">
          <ConfigOption
            title="Configuração Padrão"
            description="Instala/Atualiza todos os apps padrões e aplica as configurações necessárias."
            selected={selectedOption === "padrao"}
            onClick={handlePadrao}
          />

          <ConfigOption
            title="Configuração Personalizada"
            description="Cria uma configuração personalizada com apps e configurações específicas."
            selected={selectedOption === "personalizada"}
            onClick={handlePersonalizada}
          />
        </div>

        {/* Nome da máquina */}
        <div className="mt-6">
          <MudarNome
            nome={nomeMaquina}
            onNomeChange={setNomeMaquina}
          />
        </div>

        {/* Botão iniciar */}
        <div className="py-4">
          <button
            onClick={iniciarConfiguracao}
            disabled={!selectedOption}
            className={`
              font-bold py-2 px-6 rounded-lg transition
              ${
                selectedOption
                  ? "bg-white text-primary hover:bg-gray-300"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }
            `}
          >
            Iniciar Configuração
          </button>
        </div>

      </div>

      {/* Modal de configuração personalizada */}
      <ModalSettings
        isOpen={modalOpen}
        configAtual={configAtual}
        onClose={() => setModalOpen(false)}
        onApply={aplicarPersonalizada}
      />
    </section>
  );
}
