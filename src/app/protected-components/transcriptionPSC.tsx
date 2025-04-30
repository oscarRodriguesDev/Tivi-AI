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
import TranscriptionModal from "./modalTranscription";



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
  * - Caso contrário, exibe um erro no console.
  *
  * @function handleStartListening
  * @returns {void}
  */

  const handleStartListening = () => {
    if (!recognition) {
      console.error("Reconhecimento de voz não foi inicializado corretamente.");
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



  /**
 * Hook `useEffect` que solicita permissão de uso do microfone ao montar o componente
 * e inicia automaticamente a transcrição de voz.
 *
 * - Verifica se a API de reconhecimento de voz está disponível no navegador.
 * - Solicita permissão de uso do microfone via `getUserMedia`.
 * - Se concedida, inicia uma instância de `SpeechRecognition` configurada para transcrição contínua em português (PT-BR).
 * - Salva automaticamente cada transcrição final na API.
 * - Trata erros de permissão ou falhas na API de reconhecimento de voz.
 * - Interrompe o reconhecimento ao desmontar o componente.
 *
 * @function useEffect
 * @returns {void}
 */


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



  /**
* Renderiza a interface do componente principal de transcrição.
*
* Componentes e elementos incluídos:
* - `TranscriptionModal`: Modal que exibe a análise da transcrição.
* - Título da transcrição.
* - Mensagem de erro (se houver).
* - Bloco de exibição da transcrição (rolável, com altura máxima de 60vh).
* - Conjunto de botões fixos para ações:
*   - Exibir modal com análise (`setIsOpen`).
*   - Salvar a transcrição em PDF (`handleSavePDF`).
*   - Gerar insights com base na transcrição (`handleGetInsights`).
*   - Iniciar ou parar a escuta do microfone (toggle entre `handleStartListening` e `handleStopListening`).
*
* A interface é responsiva e utiliza ícones (FaEraser, FaFilePdf, FaBrain, RiPlayList2Fill, FaStop)
* para facilitar a interação do usuário com as funções principais.
*
* @returns {JSX.Element} Interface completa da transcrição de voz e controles de interação.
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
          title="Ver Transcrição"
        >

          <HiDocumentMagnifyingGlass size={14} />
        </button>

        <button
          onClick={handleClearTranscription}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          title="Limpar Transcrição"
        >
          <FaEraser size={14} />
        </button>
        <button
          onClick={handleSavePDF}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
          title="Salvar PDF"
        >
          <FaFilePdf size={14} />
        </button>
        <button
          onClick={() => handleGetInsights(transcription)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
          title="Análise"
        >
          <FaBrain size={14} />
        </button>





        {!listening ? (
          <button
            onClick={handleStartListening}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
            title="Iniciar Transcrição"
          >
            <RiPlayList2Fill size={14} />
          </button>
        ) : (
          <button
            onClick={handleStopListening}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
            title="Parar Transcrição"
          >
            <FaStop size={14} />

          </button>
        )}


      </div>
    </>
  );
}