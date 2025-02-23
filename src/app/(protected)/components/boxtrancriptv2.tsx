"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";

interface LiveTranscriptionProps {
  titulo: string;
  mensagem: string; // Texto exibido na interface
}

export default function LiveTranscription({ mensagem }: LiveTranscriptionProps) {
  const [transcription, setTranscription] = useState<string>("");
  const [recognition, setRecognition] = useState<any>(null);
  const [listening, setListening] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [whoIsTalking, setWhoIsTalking] = useState<string>("");
  const [titulo,setTitulo]=useState<string>("user");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "pt-BR";

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      let speaker = "Outro"; // Definindo um valor padrão (outro locutor)

      // Aqui, se você tiver algum critério para definir o locutor, pode ajustar
      // No exemplo, isso é feito por uma simples alternância a cada novo bloco de fala
      if (whoIsTalking === "Usuário") {
        speaker = "Outro"; // Altera para "Outro" depois que o usuário fala
      } else {
        speaker = "Usuário"; // Se for o outro, passa a ser o "Usuário"
      }

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          transcript += result[0].transcript + " ";
        }
      }

      setWhoIsTalking(speaker); // Alterna quem está falando
      setTranscription((prev) => {
        return prev + `${speaker}: ${transcript} \n`;
      });
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Erro no reconhecimento: ${event.error}`);
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
    };
  }, [whoIsTalking]);

  const handleStartListening = () => {
    if (!recognition) {
      console.error("Reconhecimento de voz não foi inicializado corretamente.");
      return;
    }
    setListening(true);
    setTranscription(""); // Limpar a transcrição anterior ao iniciar
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

  const handleSavePDF = () => {
    const doc = new jsPDF();
    doc.text(transcription, 10, 10);
    doc.save("transcricao.pdf");
  };

  return (
    <div className="w-96 ml-10 pb-4 bg-slate-700 rounded-lg p-4">
      <h1 className="text-lg font-semibold text-center mb-2 text-white">{titulo}</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
