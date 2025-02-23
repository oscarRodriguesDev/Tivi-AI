"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";

interface LiveTranscriptionProps {
  mensagem: string;
  usuario: string; // Identificador único do usuário (ex: "User1" ou "User2")
}

export default function LiveTranscription({ usuario, mensagem }: LiveTranscriptionProps) {
  const [transcription, setTranscription] = useState<string>("");
  const [transcriptionUser2, setTranscriptionUser2] = useState<string>(""); // Transcrição para o outro usuário
  const [recognition, setRecognition] = useState<any>(null);
  const [listening, setListening] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [titulo, setTitulo] = useState<string>("user1");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    // Inicialização do reconhecimento de voz para o usuário 1
    const recognitionInstanceUser1 = new SpeechRecognition();
    recognitionInstanceUser1.continuous = true;
    recognitionInstanceUser1.interimResults = false;
    recognitionInstanceUser1.lang = "pt-BR";

    recognitionInstanceUser1.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          transcript += result[0].transcript + "\n";
        }
      }

      if (transcript.trim()) {
        setTranscription((prev) => {
          return prev + `${usuario}: ${transcript}\n`;
        });
      }
    };

    recognitionInstanceUser1.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Erro no reconhecimento: ${event.error}`);
    };

    // Inicialização do reconhecimento de voz para o outro usuário
    const recognitionInstanceUser2 = new SpeechRecognition();
    recognitionInstanceUser2.continuous = true;
    recognitionInstanceUser2.interimResults = false;
    recognitionInstanceUser2.lang = "pt-BR";

    recognitionInstanceUser2.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          transcript += result[0].transcript + "\n";
        }
      }

      if (transcript.trim()) {
        setTranscriptionUser2((prev) => {
          return prev + `Outro Usuário: ${transcript}\n`;
        });
      }
    };

    recognitionInstanceUser2.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Erro no reconhecimento do outro usuário: ${event.error}`);
    };

    setRecognition({ user1: recognitionInstanceUser1, user2: recognitionInstanceUser2 });

    return () => {
      recognitionInstanceUser1.stop();
      recognitionInstanceUser2.stop();
    };
  }, []);

  const handleStartListening = () => {
    if (!recognition || !recognition.user1 || !recognition.user2) {
      console.error("Reconhecimento de voz não foi inicializado corretamente.");
      return;
    }
    setListening(true);
    recognition.user1.start();
    recognition.user2.start();
  };

  const handleStopListening = () => {
    if (!recognition) return;
    setListening(false);
    recognition.user1.stop();
    recognition.user2.stop();
  };

  const handleClearTranscription = () => {
    setTranscription("");
    setTranscriptionUser2(""); // Limpar a transcrição do outro usuário também
  };

  const handleSavePDF = () => {
    const doc = new jsPDF();
    doc.text(transcription + transcriptionUser2, 10, 10);
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
        {transcription || transcriptionUser2 ? (
          <>
            <p className="whitespace-pre-wrap">{transcription}</p>
            <p className="whitespace-pre-wrap mt-4">{transcriptionUser2}</p>
          </>
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
