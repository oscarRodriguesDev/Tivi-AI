"use client";
import { useState } from "react";
import { showSuccessMessage } from "../util/messages";

type AvaliacaoCampos = {
  audio: number;
  video: number;
  experienciaGeral: number;
  comentario: string;
};

export default function AvaliacaoReuniao() {
  const [avaliacao, setAvaliacao] = useState<AvaliacaoCampos>({
    audio: 0,
    video: 0,
    experienciaGeral: 0,
    comentario: "",
  });

  const [isAvaliado, setAvaliado] = useState<boolean>(false)


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAvaliado(true)
    console.log("Avaliação enviada:", avaliacao);
    showSuccessMessage("Obrigado Por avaliar, até breve !!!");
  };

  const campos: { label: string; key: keyof AvaliacaoCampos }[] = [
    { label: "Qualidade do Áudio", key: "audio" },
    { label: "Qualidade do Vídeo", key: "video" },
    { label: "Experiência Geral", key: "experienciaGeral" },
  ];

  const renderNota = (campo: keyof AvaliacaoCampos) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((nota) => (
        <button
          key={nota}
          type="button"
          className={`w-9 h-9 rounded-full text-sm font-semibold border transition-colors duration-150 ${avaliacao[campo] === nota
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-blue-100"
            }`}
          onClick={() =>
            setAvaliacao((prev) => ({ ...prev, [campo]: nota }))
          }
        >
          {nota}
        </button>
      ))}
    </div>
  );
  <img src='/public/marca/big_icon_tiviai.png' alt="teste" />

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: `url("/marca/big_icon_tiviai.png")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "1500px",
      }}
    >
      {/* camada com cor + blur */}
      <div className={`w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8 ${isAvaliado ? "hidden" : ""
        }`}>
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-8">
          Avalie sua reunião
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {campos.map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 w-48">{label}</span>
                {renderNota(key)}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Comentários:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows={4}
              placeholder="Conte-nos o que achou da reunião..."
              value={avaliacao.comentario}
              onChange={(e) =>
                setAvaliacao((prev) => ({
                  ...prev,
                  comentario: e.target.value,
                }))
              }
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Enviar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
/* adaptar o prisma para salvar a avaliação do paciente */