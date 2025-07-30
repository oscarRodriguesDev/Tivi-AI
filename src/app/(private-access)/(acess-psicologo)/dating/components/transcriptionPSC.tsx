"use client";

/**
 * Importações necessárias para o componente de transcrição e geração de PDF.
 *
 * - `useState`, `useEffect`: Hooks do React para gerenciamento de estado e efeitos colaterais.
 * - `jsPDF`: Biblioteca para criação de arquivos PDF no frontend.
 * - Ícones: Importação de ícones usados na interface do usuário para ações como gerar PDF, apagar, iniciar/pausar ações.
 * - `TranscriptionModal`: Componente de modal utilizado para exibir ou editar transcrições em uma interface modal.
 */

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { FaBrain, FaDochub, FaEraser, FaFilePdf, FaStop, FaWalking } from "react-icons/fa";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

import { RiPlayList2Fill } from "react-icons/ri";
import TranscriptionModal from "./modalTranscription"; ;
import { showErrorMessage, showPersistentLoadingMessage,updateToastMessage, } from "../../../../util/messages";
import { DocumentoModal } from "./modaldoc";
import { useAccessControl } from "@/app/context/AcessControl";






/**
 * Interface para as propriedades do componente de transcrição ao vivo.
 *
 * - `mensagem`: String contendo a transcrição atual.
 * - `usuario`: String identificando o usuário que está falando.
 * - `sala`: String identificando a sala de reunião.
 * 
 * @interface LiveTranscriptionProps
 * @property {string} mensagem - Transcrição atual.
 * @property {string} usuario - Usuário que está falando.
 * @property {string} sala - Sala de reunião.
 */
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



/**
 * Componente `LiveTranscription`
 *
 * Este componente é responsável por realizar a transcrição de voz em tempo real durante sessões de atendimento 
 * entre psicólogo e paciente. Ele utiliza a API de Reconhecimento de Fala do navegador para capturar e transcrever 
 * as falas dos participantes, salvando cada trecho no backend por sala identificada.
 *
 * Funcionalidades principais:
 * - Iniciar/parar gravação de voz via reconhecimento de fala.
 * - Exibir transcrição em tempo real no painel.
 * - Salvar transcrições no servidor associadas a uma "sala".
 * - Recuperar transcrições salvas previamente.
 * - Gerar insights automáticos com IA (via API do ChatGPT) com base nas transcrições.
 * - Exportar a transcrição e análise em formato PDF.
 * - Modal para exibir análise detalhada ao psicólogo.
 *
 * Props:
 * @param {string} usuario - Identifica o papel de quem está falando (ex: "Psicólogo" ou "Paciente").
 * @param {string} mensagem - Texto inicial da transcrição (caso exista).
 * @param {string} sala - ID único da sala onde está ocorrendo a conversa.
 *
 * Observações:
 * - O sistema usa `useState` e `useEffect` para controlar o fluxo da transcrição.
 * - Há um botão de análise que envia todo o conteúdo transcrito para a API `/api/psicochat`.
 * - Os dados são salvos no backend via chamadas à API `/api/message`.
 * - O sistema também gera arquivos PDF com o conteúdo da conversa e análise gerada.
 */


export default function LiveTranscription({ usuario, mensagem, sala }: LiveTranscriptionProps) {

  /**
 * Estados principais do componente LiveTranscription:
 * 
 * @state {string} transcription - Armazena a transcrição atual em tempo real da conversa.
 * @state {any} recognition - Instância da API de reconhecimento de voz do navegador.
 * @state {boolean} listening - Indica se o sistema está escutando o microfone no momento.
 * @state {string} error - Mensagem de erro exibida ao usuário em caso de falhas.
 * @state {string} titulo - Título exibido na interface (pode ser definido dinamicamente).
 * @state {string} analise - Armazena a resposta/insight retornada pelo GPT após análise da transcrição.
 * @state {boolean} ligado - Variável de controle que pode ser usada para ativar/desativar a transcrição automática.
 * @state {boolean} isOpen - Controla a exibição do modal de análise da transcrição.
 */
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






  /**
 * Efeito que inicializa o reconhecimento de voz usando a API nativa do navegador.
 *
 * - Verifica se a API `SpeechRecognition` está disponível no navegador.
 * - Cria uma instância de reconhecimento contínuo com idioma em "PT-BR".
 * - Escuta eventos de resultado (`onresult`) e extrai transcrições finais.
 * - Para cada transcrição final, atualiza o estado local e salva na API.
 * - Escuta erros de reconhecimento e atualiza o estado `error`.
 * - Salva a instância de reconhecimento no estado `recognition`.
 * - Configura uma verificação periódica (ainda que o `setInterval` esteja vazio por enquanto).
 * 
 * @returns {void} - Limpa a instância e o intervalo ao desmontar o componente.
 * 
 * ⚠️ Observações:
 * - A lógica atual remove `prev` ao atualizar a transcrição para evitar repetições.
 * - Pode ser estendida para processar resultados parciais ou multiusuários no futuro.
 */

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




  /**
  * Função responsável por buscar a transcrição mais recente da sala via API.
  *
  * - Realiza uma requisição GET para o endpoint `/api/message?sala={sala}`.
  * - Se houver um `transcript` na resposta, atualiza o estado `transcription`,
  *   apenas se for diferente do texto atual para evitar sobrescrita desnecessária.
  * - Em caso de erro na requisição ou falha no JSON, atualiza o estado `error`.
  *
  * @async
  * @function fetchMessages
  * @returns {Promise<void>}
  *
  * @throws {Error} - Lança erro caso a requisição falhe ou a resposta não seja ok.
  */

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



  /**
   * Salva uma nova transcrição no backend e atualiza a lista de mensagens.
   *
   * - Envia uma requisição POST para o endpoint `/api/message` com os dados da sala e transcrição.
   * - Após salvar com sucesso, limpa a transcrição atual e busca as mensagens atualizadas.
   * - Em caso de falha, define o erro no estado.
   *
   * @async
   * @function saveMessage
   * @param {string} transcript - Texto da transcrição que será salvo no backend.
   * @returns {Promise<void>}
   *
   * @throws {Error} - Lança erro se a requisição falhar ou a resposta não for satisfatória.
   */

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





  /**
  * Inicia o processo de reconhecimento de voz.
  *
  * - Verifica se a instância de `recognition` está disponível.
  * - Se estiver, ativa o estado de escuta (`listening`) e começa a capturar a voz do usuário.
  * - Caso contrário, exibe um erro.
  *
  * @function handleStartListening
  * @returns {void}
  */

  const handleStartListening = () => {
    if (!recognition) {
      showErrorMessage("Reconhecimento de voz não foi inicializado corretamente.");
      return;
    }
    setListening(true);
    recognition.start();
  };


  /**
 * Para o processo de reconhecimento de voz.
 *
 * - Verifica se a instância de `recognition` está disponível.
 * - Se estiver, desativa o estado de escuta (`listening`) e para a captura da voz do usuário.
 *
 * @function handleStopListening
 * @returns {void}
 */
  const handleStopListening = () => {
    if (!recognition) return;
    setListening(false);
    recognition.stop();
  };


  /**
 * Limpa a transcrição atual.
 *
 * - Define o estado `transcription` como uma string vazia.
 *
 * @function handleClearTranscription
 * @returns {void}
 */
  const handleClearTranscription = () => {
    setTranscription("");
  };


  /**
 * Função para salvar o PDF de forma responsiva.
 *
 * - Cria um novo documento PDF com orientação vertical, tamanho A4.
 * - Define margens e espaçamento entre linhas.
 * - Utiliza a função `wrapText` para dividir o texto em linhas de acordo com a largura máxima.
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



  /**
 * Função para buscar insights da conversa usando a API do ChatGPT.
 *
 * - Cria um controlador de aborto para evitar que a requisição dure mais de 2 minutos.
 * - Realiza uma requisição POST para o endpoint `/api/psicochat` com a mensagem a ser analisada.
 * - Se a resposta não for ok, lança um erro.
 *
 * @async
 * @function handleGetInsights
 * @param {string} mensagem - Mensagem a ser analisada.
 * @returns {Promise<string>} - Resposta do ChatGPT.
 */
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
     showErrorMessage("Erro ao buscar insights: "+ error);
      return "Erro ao obter resposta.";
    }
  };



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
  <TranscriptionModal isOpen={isOpen} onClose={() => setIsOpen(false)} transcription={analise} />

  {/* Contêiner fixo no canto inferior direito */}
  <div className="fixed bottom-6 right-6 w-[300px] max-h-[65vh] bg-black bg-opacity-60 backdrop-blur-sm text-white rounded-lg shadow-xl flex flex-col p-4 z-50">

    {/* Título */}
    <h1 className="text-md font-semibold text-center mb-2">{titulo}</h1>

    {/* Erro, se houver */}
    {error && <p className="text-red-400 text-center text-sm mb-2">{error}</p>}

    {/* Área de transcrição */}
    <div className="flex-1 overflow-y-auto p-2 text-sm border border-white/20 rounded max-h-[40vh]">
      {transcription ? (
        <p className="whitespace-pre-wrap">{transcription}</p>
      ) : (
        <p className="text-gray-300 text-center italic">Aguardando transcrição...</p>
      )}
    </div>

    {/* Botões de ação */}
    <div className="grid grid-cols-3 gap-2 mt-4">
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

      {!listening ? (
        <button
          onClick={handleStartListening}
          className="col-span-3 bg-red-600 hover:bg-red-500 transition p-2 rounded-md flex items-center justify-center"
          title="Iniciar Transcrição"
        >
          <RiPlayList2Fill size={16} />
        </button>
      ) : (
        <button
          onClick={handleStopListening}
          className="col-span-3 bg-red-600 hover:bg-red-500 transition p-2 rounded-md flex items-center justify-center"
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