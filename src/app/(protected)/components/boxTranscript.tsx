"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";

interface LiveTranscriptionProps {
  titulo:string;
  mensagem: string; // Texto exibido na interface
}

export default function LiveTranscription({ mensagem }: LiveTranscriptionProps) {
  const [transcription, setTranscription] = useState<string>("");
  const [recognition, setRecognition] = useState<any>(null);
  const [listening, setListening] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true; // Mantém o reconhecimento ativo
    recognitionInstance.interimResults = false; // Desativa resultados parciais para evitar repetições
    recognitionInstance.lang = "pt-BR";

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        // Verifica se o resultado é final
        if (result.isFinal) {
          transcript += result[0].transcript + " ";
        }
      }

      // Prevenir adicionar transcrições repetidas
      setTranscription((prev) => {
        // Adiciona a nova transcrição se for diferente da anterior
        if (prev.trim() !== transcript.trim()) {
          return prev + transcript;
        }
        return prev;
      });
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Erro no reconhecimento:", event.error);
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
    };
  }, []);

  const handleStartListening = () => {
    if (!recognition) {
      console.error("Reconhecimento de voz não foi inicializado corretamente.");
      return;
    }
    setListening(true);
    recognition.start();
  };

  const handleStopListening = () => {
    if (!recognition) return;
    setListening(false);
    recognition.stop();
  };

  const handleClearTranscription = () => {
    setTranscription(""); // Limpar a transcrição
  };

  // Função para gerar o PDF
  const handleSavePDF = () => {
    const doc = new jsPDF();
    doc.text(transcription, 10, 10);
    doc.save("transcricao.pdf");
  };

  return (
    <div className="w-96 ml-10 pb-4 bg-slate-700 rounded-lg p-4">
      <h1 className="text-lg font-semibold text-center mb-2 text-white">Transcrição ao Vivo</h1>

      <div className="flex gap-2 justify-center mb-2">
        {!listening ? (
          <button
            onClick={handleStartListening}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Iniciar Transcrição
          </button>
        ) : (
          <button
            onClick={handleStopListening}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Parar Transcrição
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-800 p-2 rounded-md text-sm text-white">
        {transcription ? (
          <p className="whitespace-pre-wrap">{transcription}</p>
        ) : (
          <p className="text-gray-400 text-center">{mensagem || "Aguardando transcrição..."}</p>
        )}
      </div>

      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={handleClearTranscription}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Limpar Transcrição
        </button>
        <button
          onClick={handleSavePDF}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
        >
          Salvar como PDF
        </button>
      </div>
    </div>
  );
}


//coreção na tipagem do evento:" recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {"