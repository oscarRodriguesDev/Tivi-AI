"use client";


import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { FaBrain, FaDochub, FaEraser, FaFilePdf, FaStop, FaWalking, FaSave } from "react-icons/fa";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

import { RiPlayList2Fill } from "react-icons/ri";
import TranscriptionModal from "./modalTranscription";;
import { showErrorMessage, showPersistentLoadingMessage, showSuccessMessage, updateToastMessage, } from "../../../../util/messages";
import { DocumentoModal } from "./modaldoc";
import { useAccessControl } from "@/app/context/AcessControl";



//interfaces
interface LiveTranscriptionProps {
  mensagem: string;
  usuario: string;
  sala: string
}

interface Docs {
  id: string
  name: string
  psicologoId: string
  prompt: string
}

//interface Paciente
interface Paciente {
  id: string
  nome: string
}



export default function LiveTranscription({ usuario, mensagem, sala }: LiveTranscriptionProps) {

  const [transcription, setTranscription] = useState<string>("");
  const [recognition, setRecognition] = useState<any>(null);
  const [listening, setListening] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [titulo, setTitulo] = useState<string>("");
  const [analise, setAnalise] = useState<string>('nenhuma analise')
  const [ligado, setLigado] = useState<boolean>(false) //usar essa variavel pra controlar quando vai transcrever
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<string>();
  const [prompt, setPrompt] = useState<string>('me de uma visão geral do paciente');
  const { userID } = useAccessControl();
  const [paciente, setPaciente] = useState<Paciente[]>([])
  const [selecionado, setSelecionado] = useState<string>('');
  const [idpaciente, setIdPaciente] = useState<string>('');


  //gera os insights
  const handleGenerate = () => {
    if (tipoSelecionado) {
      console.log('Gerar documento do tipo:', tipoSelecionado);
      // Chama a função que gera o insight/documento
      handleGetInsights(transcription);
      setShowModal(false);
    } else {
      alert('Selecione um tipo de documento primeiro!');
    }
  };


  //verifica reconhecimento de voz
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





  //busca e atualiza as mensagens
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/message?sala=${sala}`, { method: 'GET' });

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


  //savar as mensagens no server
  const saveMessage = async (transcript: string) => {
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sala, transcript }), // <-- ADICIONA AQUI
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar a mensagem.");
      }

      // Após salvar a mensagem, busca as mensagens novamente
      handleClearTranscription();
      await fetchMessages();
    } catch (error) {
      setError(`Erro ao salvar a mensagem: ${error}`);
    }
  };


  //iniciar o reconheciemtno de fala
  const handleStartListening = () => {
    if (!recognition) {
      showErrorMessage("Reconhecimento de voz não foi inicializado corretamente.");
      return;
    }
    setListening(true);
    recognition.start();
  };


  //para o reconheciemtno de fala
  const handleStopListening = () => {
    if (!recognition) return;
    setListening(false);
    recognition.stop();
  };

  //limpa a transcrição
  const handleClearTranscription = () => {
    setTranscription("");
  };


  //gera o pdf
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


  //gera a análise
  const handleGetInsights = async (mensagem: string) => {
    const toastId = showPersistentLoadingMessage('Gerando documentação da consulta...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); //120 segundos
    try {
      const response = await fetch(`/api/internal/insight/psicochat/?tipo=${tipoSelecionado}&&prompt=${prompt}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: mensagem }),
        signal: controller.signal,
      });


      clearTimeout(timeoutId);

      if (!response.ok) {
        updateToastMessage(toastId, 'Erro ao gerar relatório.', 'error');
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
      const data = await response.json();
      updateToastMessage(toastId, 'Relatório gerado com sucesso!', 'success');
      const respostaGPT = data.response || "Nenhuma resposta gerada.";
      setAnalise(respostaGPT);

      return respostaGPT;

    } catch (error) {
      showErrorMessage("Erro ao buscar insights: " + error);
      return "Erro ao obter resposta.";
    }
  };


  //busca os documentos para gerar as transcrições
  const fetchDocumentos = async (tipo: string) => {
    try {
      const response = await fetch(`/api/uploads/doc-model/?psicologoId=${userID}`)
      if (!response.ok) throw new Error("Erro ao buscar documentos")

      const data: Docs[] = await response.json()

      const documentoSelecionado = data.find(doc => doc.name === tipo)

      if (documentoSelecionado) {
        const prompt = documentoSelecionado.prompt
        setPrompt(prompt || "")
      }

    } catch (error) {
      console.error("Erro ao buscar documentos:", error)
    }
  }


  //buscar pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(`/api/internal/register_pacientes?psicologoId=${userID}`)
        if (!response.ok) throw new Error('Erro ao buscar pacientes')
        const data = await response.json()
        setPaciente(data)
      } catch (error) {
        console.error('Erro ao buscar paciente:', error)
      }
    }

    fetchPacientes()
  },[userID] )



  //salva a trancrição no banco de dados
  async function saveTranscription(id: string) {
    const formattedTranscription = `*--${new Date().toLocaleString()}\n${transcription.trim()}--*\n`;

    try {
      const response = await fetch('/api/internal/prontuario/save-transcription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pacienteId: id,
          transcription: formattedTranscription, // <-- agora está correto
        }),
      });

      if (!response.ok) {
        showErrorMessage('Erro ao salvar transcrição');
      } else {
        showSuccessMessage('Transcrição salva com sucesso!');
      }

      const data = await response.json();
      console.log('Transcrição salva com sucesso:', data);

      return data;
    } catch (error) {
      console.error('Erro ao salvar transcrição:', error);
      showErrorMessage('Erro ao salvar transcrição');
      throw error;
    }

  }

  


  //seleciona o tipo de documento que vai gerar a analise
  const handleSelectTipo = (tipo: string) => {
    setTipoSelecionado(tipo);
    fetchDocumentos(tipo);

  };



  return (

    <>
      {/* Modal para geração de documento */}
      {showModal && (
        <DocumentoModal
          onClose={() => setShowModal(false)}
          onGenerate={handleGenerate}
          onSelectTipo={handleSelectTipo}
          tipoSelecionado={tipoSelecionado}
          prompt={prompt}
        />
      )}



      {/* Modal com transcrição completa */}
      <TranscriptionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        transcription={analise}
      />

      {/* Contêiner fixo no canto inferior direito */}
      <div className="fixed bottom-6 right-6 w-[300px] max-h-[65vh] bg-black bg-opacity-60 backdrop-blur-sm text-white rounded-lg shadow-xl flex flex-col p-4 z-50">

        {/* Título */}
        <h1 className="text-md font-semibold text-center mb-2">{titulo}</h1>

        {/* Erro, se houver */}
        {error && (
          <p className="text-red-400 text-center text-sm mb-2">{error}</p>
        )}

        {/* Área de transcrição */}
        <div className="flex-1 overflow-y-auto p-2 text-sm border border-white/20 rounded max-h-[40vh]">
          {transcription ? (
            <p className="whitespace-pre-wrap">{transcription}</p>
          ) : (
            <p className="text-gray-300 text-center italic">Aguardando transcrição...</p>
          )}
        </div>

        {/* Select estilizado */}
        <>
        
        <select
          className="mt-3 bg-white text-black text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={selecionado}
          onChange={(e) => { setSelecionado(e.target.value); setIdPaciente(e.target.value); }}
        >
          <option value="">Selecione o paciente</option>
          {paciente.map((paciente) => (
            <option key={paciente.id} value={paciente.id}

            >
              {paciente.nome}
            </option>
          ))}
        </select>
        </>

        {/* Botões de ação */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 transition p-2 rounded-md flex items-center justify-center"
            title="Ver Transcrição"
          >
            <HiDocumentMagnifyingGlass size={16} />
          </button>

          <button
            onClick={handleClearTranscription}
            className="bg-blue-500 hover:bg-blue-600 transition p-2 rounded-md flex items-center justify-center"
            title="Limpar Transcrição"
          >
            <FaEraser size={16} />
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 transition p-2 rounded-md flex items-center justify-center"
            title="Análise"
          >
            <FaBrain size={16} />
          </button>

          <button
            className="bg-green-500 hover:bg-green-600 transition p-2 rounded-md flex items-center justify-center"
            title="Salvar Transcrição"
          onClick={() => saveTranscription(idpaciente)}
          >
            <FaSave size={16} />
          </button>

          {!listening ? (
            <button
              onClick={handleStartListening}
              className="col-span-4 bg-red-600 hover:bg-red-500 transition p-2 rounded-md flex items-center justify-center"
              title="Iniciar Transcrição"
            >
              <RiPlayList2Fill size={16} />
            </button>
          ) : (
            <button
              onClick={handleStopListening}
              className="col-span-4 bg-red-600 hover:bg-red-500 transition p-2 rounded-md flex items-center justify-center"
              title="Parar Transcrição"
            >
              <FaStop size={16} />
            </button>
          )}
        </div>
      </div>
    </>


  );
}