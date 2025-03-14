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
  const [titulo, setTitulo] = useState<string>("");
  const [analise,setAnalise]= useState<string>('nenhuma analise')


  /* faz a transcrição */
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
    recognitionInstance.lang = "PT-BR";
  
    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
  
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
           transcript =   result[0].transcript + "\n";
        }
      }
  
      if (transcript.trim()) {
        setTranscription((prev) => {
          const updatedTranscription = /* prev +  */`${usuario}: ${transcript}`; //solução para não repetir a transcrição foi tirar a prev
          saveMessage(updatedTranscription); // Salvar transcrição na API
          return updatedTranscription;
        });
      }
    };
  
    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Erro no reconhecimento: ${event.error}`);
    };
  
    setRecognition(recognitionInstance);
    // Verifica as novas mensagens a cada 5 segundos
    const intervalId = setInterval(() => {
    }, 5000); // Ajuste o intervalo conforme necessário
  
    return () => {
      recognitionInstance.stop();
      clearInterval(intervalId); // Limpar o intervalo quando o componente for desmontado
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
        const cleanedTranscript = data.transcript;
  
        // Só atualiza se o texto limpo for realmente novo
        if (cleanedTranscript !== transcription) {
          setTranscription(cleanedTranscript);
        }
      }
    } catch (error) {
      setError(`Erro ao carregar mensagens: ${error}`);
    }
  };
  
  


// Função para salvar a mensagem no servidor
const saveMessage = async (transcript: string) => {
  try {
    const response = await fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      throw new Error("Erro ao salvar a mensagem.");
    }

    // Após salvar a mensagem, busca as mensagens novamente
    handleClearTranscription()
    await fetchMessages();
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


  /* Função para salvar o pdf de forma responsiva */
  function handleSavePDF(): void {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const marginLeft = 10;
    const marginTop = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 7; // Espaçamento entre linhas
    const maxWidth = pageWidth - marginLeft * 2;

    let yPos = marginTop;

    const wrapText = (text: string): string[] => {
      return doc.splitTextToSize(text, maxWidth);
    };

    const addTextToPDF = (text: string): void => {
      const lines = wrapText(text);
      lines.forEach((line) => {
        if (yPos + lineHeight > pageHeight - marginTop) {
          doc.addPage();
          yPos = marginTop;
        }
        doc.text(line, marginLeft, yPos);
        yPos += lineHeight;
      });
    };

    addTextToPDF(transcription);
    yPos += lineHeight * 2;

    addTextToPDF("Análise detalhada da conversa:\n");
    yPos += lineHeight;

    addTextToPDF(analise);

    doc.save("transcricao.pdf");
  }


  /* Função traz a resposta do chat GPT, para apresentação para o psicologo e tambem para salvar no modal */
  const handleGetInsights = async (mensagem: string) => {
    try {
      const response = await fetch('/api/psicochat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: mensagem }),
      });
  
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Resposta completa da API:", data); // <-- Adicionando para depuração
        const respostaGPT = data.response || "Nenhuma resposta gerada.";
        setAnalise(respostaGPT);
        return respostaGPT;
    
  
    } catch (error) {
      console.error("Erro ao buscar insights:", error);
      return "Erro ao obter resposta.";
    }
  };
  




  return (
    <div className="w-96 ml-10 pb-4 bg-slate-700 rounded-lg p-4 overflow-y-auto max-h-[80vh]">
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

    <div className="flex-1 overflow-y-auto bg-gray-800 p-2 rounded-md text-sm text-white max-h-[60vh]">
      {transcription ? (
        <p className="whitespace-pre-wrap">{transcription}</p>
      ) : (
        <p className="text-gray-400 text-center">Aguardando transcrição...</p>
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
      <button
        onClick={() => handleGetInsights(transcription)}
        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
      >
        GPT Análise
      </button>
    </div>
  </div>
  );
}