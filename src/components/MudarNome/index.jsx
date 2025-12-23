import React from "react";

export default function MudarNome({ nome, onNomeChange }) {
    return (
        <div className="flex flex-col items-start justify-start h-full w-[600px] p-4  bg-primary bg-opacity-90 rounded-lg border border-secondary border-opacity-20 border-1-solid font-prompt">
            <h2 className="text-md font-semibold mb-2">Mudar Nome (opcional)</h2>
            <div className="w-full gap-5 flex flex-col">
                <input
                    type="text"
                    onChange={(e) => onNomeChange(e.target.value)}
                    className="text-sm p-2 border-b border-secundary rounded w-full text-left"
                    placeholder="Nome da máquina"
                />
                <input
                    type="text"
                    onChange={(e) => onNomeChange(e.target.value)}
                    className="text-sm p-2 border-b border-secundary rounded w-full text-left"
                    placeholder="Nome do grupo de trabalho"
                />

            </div>
        </div>
    );
}