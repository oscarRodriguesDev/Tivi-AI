"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";

interface LiveTranscriptionProps {
  mensagem: string; 
  usuario: string; // Identificador único do usuário (ex: "User1" ou "User2")
}

export default function LiveTranscription({ usuario, mensagem }: LiveTranscriptionProps) {
  const [transcription, setTranscription] = useState<string>("");
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

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "pt-BR";

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          transcript += result[0].transcript + "\n";
        }
      }

      if (transcript.trim()) {
        const formattedMessage = `${usuario}: ${transcript}`;
        setTranscription((prev) => prev + formattedMessage + "\n");
        saveMessage(formattedMessage); // Salvar no servidor
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Erro no reconhecimento: ${event.error}`);
    };

    setRecognition(recognitionInstance);

    fetchMessages(); // Recupera mensagens ao iniciar o componente

    // Atualiza as mensagens periodicamente
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 3000); // Atualiza a cada 3 segundos

    return () => {
      recognitionInstance.stop();
      clearInterval(intervalId); // Limpar intervalo ao desmontar
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/message', { method: 'GET' });
  
      if (!response.ok) {
        throw new Error("Erro ao recuperar mensagens.");
      }
  
      const data = await response.json();
  
      if (data.transcript) {
        // Separamos as mensagens em linhas distintas
        setTranscription(data.transcript.split("\n").join("\n"));
      }
    } catch (error) {
      setError(`Erro ao carregar mensagens: ${error}`);
    }
  };
  
  const saveMessage = async (transcript: string) => {
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar a mensagem.");
      }

      fetchMessages(); // Atualiza mensagens imediatamente
    } catch (error) {
      setError(`Erro ao salvar a mensagem: ${error}`);
    }
  };

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
    setTranscription("");
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
