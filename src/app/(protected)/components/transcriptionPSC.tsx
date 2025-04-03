"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { FaBrain, FaDochub, FaEraser, FaFilePdf, FaStop, FaWalking } from "react-icons/fa";
import { RiPlayList2Fill } from "react-icons/ri";
import TranscriptionModal from "./modalTranscription";



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
  const [analise, setAnalise] = useState<string>('nenhuma analise')
  const [ligado, setLigado] = useState<boolean>(false) //usar essa variavel pra controlar quando vai transcrever
  const [isOpen, setIsOpen] = useState<boolean>(false);
 



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
          transcript = result[0].transcript + "\n";
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



  /* essas funções controlam quando grava e quando não grava */
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
    const controller = new AbortController();
   
   
    
    const timeoutId = setTimeout(() => controller.abort(), 120000); //120 segundos
  
    try {
      const response = await fetch('/api/psicochat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: mensagem }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    

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



  /*   //use efect para gravar automaticamentde
    useEffect(() => {
      if (typeof window === "undefined") return;
    
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
      if (!SpeechRecognition) {
        setError("Seu navegador não suporta reconhecimento de voz.");
        return;
      }
    
      // Função para pedir permissão e iniciar a transcrição
      const requestMicrophonePermission = async () => {
        try {
          // Tentamos acessar o microfone. O prompt de permissão é exibido automaticamente.
          await navigator.mediaDevices.getUserMedia({ audio: true });
    
          const recognitionInstance = new SpeechRecognition();
          recognitionInstance.continuous = true;
          recognitionInstance.interimResults = false;
          recognitionInstance.lang = "PT-BR";
    
          recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
            let transcript = "";
    
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const result = event.results[i];
              if (result.isFinal) {
                transcript = result[0].transcript + "\n";
              }
            }
    
            if (transcript.trim()) {
              setTranscription((prev) => `${usuario}: ${transcript}`);
              saveMessage(`${usuario}: ${transcript}`); // Salvar transcrição na API
            }
          };
    
          recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
            setError(`Erro no reconhecimento: ${event.error}`);
          };
    
          setRecognition(recognitionInstance);
    
          // Iniciar transcrição após permissão
          recognitionInstance.start();
        } catch (err) {
          setError("Permissão para usar o microfone não concedida.");
        }
      };
    
      // Dispara a solicitação de permissão
      requestMicrophonePermission();
    
      // Cleanup
      return () => {
        if (recognition) {
          recognition.stop(); // Parar o reconhecimento quando o componente for desmontado
        }
      };
    }, []); // A dependência vazia faz com que isso seja executado apenas uma vez no mount
    
   */


  return (

    <>

     <TranscriptionModal isOpen={isOpen} onClose={() => setIsOpen(false)} transcription={analise} />

      <h1 className="text-lg font-semibold text-center mb-2 text-white">{titulo}</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}



      <div className="flex-1 overflow-y-auto p-2 rounded-md text-sm text-white  max-h-[60vh]">
        {transcription ? (
          <p className="whitespace-pre-wrap">{transcription}</p>
        ) : (
          <p className="text-gray-800 text-center">{'Aguardando transcrição...'}</p>
        )}
      </div>

     

      <div className="fixed left-[90%] grid grid-cols-2  justify-center gap-2">
        <button
         /*  onClick={handleClearTranscription} */
         onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          title="Limpar Transcrição"
        >
          <FaEraser size={10} />
        </button>
        <button
          onClick={handleSavePDF}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
          title="Salvar PDF"
        >
          <FaFilePdf size={10} />
        </button>
        <button
          onClick={() => handleGetInsights(transcription)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
          title="Análise"
        >
          <FaBrain size={10} />
        </button>

      

        {!listening ? (
          <button
            onClick={handleStartListening}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
            title="Iniciar Transcrição"
          >
            <RiPlayList2Fill size={10} />
          </button>
        ) : (
          <button
            onClick={handleStopListening}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
            title="Parar Transcrição"
          >
            <FaStop size={10} />

          </button>
        )}

       
      </div>
    </>
  );
}