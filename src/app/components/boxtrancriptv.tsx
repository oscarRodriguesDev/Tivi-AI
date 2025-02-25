"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";

interface LiveTranscriptionProps {
  mensagem: string;
  usuario: string;
}

export default function LiveTranscription({ usuario, mensagem }: LiveTranscriptionProps) {
  const [transcription, setTranscription] = useState<string>("");
  const [recognition, setRecognition] = useState<any>(null);
  const [listening, setListening] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [titulo, setTitulo] = useState<string>("user1");


  useEffect(() => {
    const savedMessages = localStorage.getItem("transcriptions");
    if (savedMessages) {
      setTranscription(savedMessages);
    }
  }, []);
  

  


  useEffect(() => {
    fetchMessages(); // Atualiza as mensagens ao montar o componente
  }, []);


  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/transcriptions");
      const data = await response.json();
  
      if (data.transcript) {
        const newMessages = data.transcript.split("\n");
  
        setTranscription((prev) => {
          const allMessages = prev ? prev.split("\n") : [];
          const combinedMessages = [...allMessages, ...newMessages];
  
          // Use Set para garantir mensagens únicas
          const uniqueMessages = [...new Set(combinedMessages)];
  
          return uniqueMessages.join("\n");
        });
      }
    }
  
    fetchData();
  }, []);
  

  
  // 🔥 Atualiza as mensagens sempre que iniciar a transcrição
  const handleStartListening = async () => {
    if (!recognition) {
      console.error("Reconhecimento de voz não foi inicializado corretamente.");
      return;
    }
    await fetchMessages(); // Carrega todas as mensagens ANTES de começar a transcrição
    setListening(true);
    recognition.start();
  };

  // 🔥 Ao parar, garante que as mensagens estejam atualizadas
  const handleStopListening = () => {
    if (!recognition) return;
    setListening(false);
    recognition.stop();
    
    // Aguarde um curto tempo para garantir que todas as mensagens foram processadas antes de buscar novamente
    setTimeout(() => {
      fetchMessages();
    }, 500); // Meio segundo para dar tempo da API processar a mensagem
  };
  
  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/message", { method: "GET" });
  
      if (!response.ok) {
        throw new Error("Erro ao recuperar mensagens.");
      }
  
      const data = await response.json();
  
      if (data.transcriptions && Array.isArray(data.transcriptions)) {
        setTranscription(data.transcriptions.join("\n")); // 🔥 Junta todas as mensagens corretamente
      } else {
        setTranscription(""); // 🔥 Evita exibir 'undefined'
      }
    } catch (error) {
      setError(`Erro ao carregar mensagens: ${error}`);
    }
  };
  

  const handleClearTranscription = () => {
    setTranscription("");
  };



  const handleSavePDF = async (): Promise<void> => {
    try {
      const response = await fetch("/api/message", { method: "GET" });
  
      if (!response.ok) {
        throw new Error("Erro ao recuperar mensagens.");
      }
  
      const data: { transcriptions: string[] } = await response.json();
  
      if (!data.transcriptions || data.transcriptions.length === 0) {
        alert("Nenhuma mensagem para salvar.");
        return;
      }
  
      // Usando Set para garantir que não haja duplicação de mensagens
      const uniqueMessages = new Set(data.transcriptions);
  
      // Criando o PDF
      const doc = new jsPDF();
      let yOffset = 10; // Controla o posicionamento das mensagens no PDF
  
      // Adiciona apenas mensagens únicas
      uniqueMessages.forEach((message) => {
        doc.text(message || "Nenhuma transcrição disponível", 10, yOffset);
        yOffset += 10; // Ajuste o espaçamento entre as mensagens
      });
  
      // Salvar o PDF
      doc.save("transcricao.pdf"); //melhorar nomeclatura desse
  
      // Limpar o localStorage
      localStorage.removeItem("transcriptions");
  
      // Limpar o estado (opcional)
      setTranscription("");
  
    } catch (error) {
      setError(`Erro ao gerar PDF: ${error}`);
    }
  };
  



  return (
    <div className="w-96  ml-10 pb-4 bg-slate-700 rounded-lg p-4">
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

      <div className="flex-1 h-96 overflow-y-scroll bg-gray-800 p-2 rounded-md text-sm text-white">
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
