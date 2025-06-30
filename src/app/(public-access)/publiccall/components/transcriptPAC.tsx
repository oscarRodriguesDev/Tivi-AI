"use client";

/**
 * Importações de dependências e utilitários usados no componente de transcrição:
 *
 * - `useState`, `useEffect` (React): Hooks utilizados para gerenciar o estado e efeitos colaterais do componente.
 * - `jsPDF`: Biblioteca para geração de arquivos PDF diretamente no cliente.
 * - `FaBrain`, `FaEraser`, `FaFilePdf`, `FaStop` (react-icons/fa): Ícones utilizados na interface para representar ações como análise, limpar, exportar PDF e parar transcrição.
 * - `RiPlayList2Fill` (react-icons/ri): Ícone utilizado para representar o botão de iniciar transcrição.
 * - `useParams` (next/navigation): Hook do Next.js App Router utilizado para capturar parâmetros da URL, como o identificador da sala.
 */

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { FaBrain, FaEraser, FaFilePdf, FaStop } from "react-icons/fa";
import { RiPlayList2Fill } from "react-icons/ri";
import { useParams } from "next/navigation";
import { showErrorMessage, showInfoMessage} from "@/app/util/messages";


/**
 * Interface para definir as propriedades do componente `LiveTranscription`.
 *
 * - `mensagem`: Mensagem a ser exibida no componente.
 * - `usuario`: Nome do usuário que está falando.
 * - `sala`: Identificador da sala de reunião.
 * 
 * @interface LiveTranscriptionProps
 * @property {string} mensagem - Mensagem a ser exibida no componente.
 * @property {string} usuario - Nome do usuário que está falando.
 * @property {string} sala - Identificador da sala de reunião.
 */
interface LiveTranscriptionProps {
  mensagem: string;
  usuario: string;
  sala: string
}



/**
 * Componente `LiveTranscription`
 * 
 * Este componente é responsável por realizar a transcrição de voz em tempo real, 
 * associando-a a uma sala virtual para sessões entre psicólogos e pacientes.
 * 
 * Recursos principais:
 * 
 * - 🎙️ **Reconhecimento de voz (SpeechRecognition)**:
 *   Usa a API nativa de reconhecimento de fala do navegador (`SpeechRecognition` ou `webkitSpeechRecognition`)
 *   para transcrever a fala do usuário automaticamente em tempo real.
 * 
 * - 💬 **Armazenamento e recuperação de transcrições**:
 *   As transcrições são salvas em um backend via API REST e recuperadas conforme necessário, 
 *   garantindo persistência e sincronização dos dados da sessão.
 * 
 * - 🧠 **Análise com IA (ChatGPT)**:
 *   Envia a transcrição para uma rota que responde com insights, análises e observações que auxiliam o psicólogo.
 * 
 * - 📄 **Exportação para PDF**:
 *   Gera um arquivo `.pdf` da transcrição e da análise com layout formatado para impressão ou arquivamento.
 * 
 * - 🎛️ **Controles manuais e automáticos**:
 *   O usuário pode iniciar/parar a transcrição manualmente ou permitir que o sistema inicie automaticamente 
 *   após o aceite da permissão de microfone.
 * 
 * - ⚠️ **Tratamento de erros e notificações**:
 *   Exibe mensagens de erro caso o navegador não suporte o recurso ou se houver falhas no processo.
 * 
 * Props esperadas:
 * 
 * @component
 * @param {Object} props
 * @param {string} props.usuario - Nome ou identificador de quem está falando, usado para prefixar as falas.
 * @param {string} props.mensagem - Mensagem inicial ou conteúdo relevante para análise (não utilizado diretamente aqui).
 * @param {string} props.sala - Identificador da sala usada para salvar/recuperar transcrições associadas.
 * 
 * @returns {JSX.Element} Interface com os controles de transcrição, exibição do conteúdo e ações como salvar e analisar.
 * 
 * @example
 * <LiveTranscription usuario="Paciente" mensagem="" sala="abc123" />
 */


export default function LiveTranscription({ usuario, mensagem, sala }: LiveTranscriptionProps) {

  /** 
   * Estado que armazena a transcrição atual da fala reconhecida.
   * Atualizada toda vez que uma nova fala é reconhecida como final.
   */
  const [transcription, setTranscription] = useState<string>("");

  /**
   * Instância da API de reconhecimento de voz (`SpeechRecognition`).
   * Inicializada após verificação de suporte e permissão ao microfone.
   */
  const [recognition, setRecognition] = useState<any>(null);

  /**
   * Indica se o reconhecimento de voz está atualmente ativo (em escuta).
   * Usado para alternar o botão de iniciar/parar.
   */
  const [listening, setListening] = useState<boolean>(false);

  /**
   * Armazena mensagens de erro relacionadas à transcrição,
   * como falta de suporte no navegador ou falha de permissão.
   */
  const [error, setError] = useState<string>("");

  /**
   * Título da sessão ou da transcrição. Pode ser definido externamente ou dinamicamente.
   * Exibido no topo da interface de transcrição.
   */
  const [titulo, setTitulo] = useState<string>("");

  /**
   * Armazena a resposta gerada pela análise da conversa usando IA.
   * Exibida ao psicólogo ou exportada no PDF.
   */
  const [analise, setAnalise] = useState<string>("nenhuma analise");

  /**
   * Indica se o sistema está "ligado" para iniciar a transcrição automaticamente.
   * Útil para controlar o modo de escuta automática.
   */
  const [ligado, setLigado] = useState<boolean>(false);
  //usar essa variavel pra controlar quando vai transcrever







  /**
   * Busca as mensagens transcritas do servidor com base na sala atual.
   * 
   * - Realiza uma requisição GET para a rota `/api/message`, passando o identificador da sala.
   * - Se a resposta contiver uma transcrição (`transcript`), atualiza o estado `transcription` apenas se o conteúdo for diferente do atual.
   * - Em caso de erro na requisição, atualiza o estado de erro com uma mensagem descritiva.
   */
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/message/?sala=${sala}`, { method: 'GET' });

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
   * Salva uma transcrição no servidor associada a uma sala específica.
   * 
   * - Envia uma requisição POST para a rota `/api/message` com o conteúdo da transcrição e o identificador da sala.
   * - Em caso de sucesso, limpa a transcrição atual e busca novamente todas as mensagens.
   * - Em caso de erro, atualiza o estado de erro com a mensagem correspondente.
   * 
   * @param {string} transcript - Texto transcrito a ser salvo no servidor.
   */
  const saveMessage = async (transcript: string) => {
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sala, transcript }),
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



  /**
   * Inicia o reconhecimento de voz.
   * 
   * - Verifica se a instância de reconhecimento está disponível.
   * - Se disponível, inicia a escuta e atualiza o estado `listening` para `true`.
   * - Caso contrário, exibe um erro no
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
   * Interrompe o reconhecimento de voz.
   * 
   * - Verifica se a instância de reconhecimento existe.
   * - Atualiza o estado `listening` para `false`.
   * - Chama o método `stop()` para encerrar a escuta de voz.
   */
  const handleStopListening = () => {
    if (!recognition) return;
    setListening(false);
    recognition.stop();
  };


  /**
   * Limpa o conteúdo da transcrição atual.
   * 
   * - Reseta o estado `transcription` para uma string vazia.
   */
  const handleClearTranscription = () => {
    setTranscription("");
  };




  /**
   * Salva a transcrição atual em um arquivo PDF.
   * 
   * - Cria um novo documento PDF com orientação vertical.
   * - Define o formato de página como A4.
   * - Calcula o espaçamento entre linhas e a largura máxima de cada página. 
   * 
   * @returns {void}
   * 
   */
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
   * Busca insights sobre a transcrição atual usando a API de análise com IA.
   * 
   * - Envia uma requisição POST para a rota `/api/psicochat` com a mensagem transcrita.
   * - Recebe a resposta da API e atualiza o estado `analise` com o conteúdo da resposta.
   *    
   * @param {string} mensagem - Mensagem transcrita a ser enviada para a API de análise.
   * 
   * @returns {Promise<string>} Resposta da API de análise.
   */

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
      const respostaGPT = data.response || "Nenhuma resposta gerada.";
      setAnalise(respostaGPT);
      return respostaGPT;


    } catch (error) {
      showErrorMessage("Erro ao buscar insights:" + error);
      return "Erro ao obter resposta.";
    }
  };




  /**
   * Inicializa o reconhecimento de voz automaticamnte.
   * 
   * - Verifica se o navegador suporta a API `SpeechRecognition`.
   * - Configura o reconhecimento contínuo de fala em português (PT-BR).
   * - Escuta os resultados finais e atualiza a transcrição com o nome do usuário.
   * 
   * @returns {void}
   */

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

        const confirmTranscription = window.confirm("Deseja iniciar a transcrição automática da sessão?");
        if (!confirmTranscription) {
          setError("Transcrição não iniciada - usuário não autorizou");
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
            setTranscription((prev) => `${usuario}: ${transcript}`);
            saveMessage(`${usuario}: ${transcript}`); // Salvar transcrição na API
          }
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {

          //deixar pra verificar essa questão da trascriçao,tem que pensar direito a respeito
          showInfoMessage('A transcrição foi desativada')


        };

        setRecognition(recognitionInstance);

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
        recognition.stop();
      }
    };
  }, []);



  /**
 * Renderiza a interface de transcrição ao vivo.
 *
 * A interface contém:
 * - Título da transcrição.
 * - Mensagem de erro (se houver).
 * - Área de exibição da transcrição, ou mensagem de espera.
 * - Botões de controle:
 *   - Limpar transcrição (ícone de borracha).
 *   - Salvar como PDF (ícone de PDF).
 *   - Obter insights (ícone de cérebro).
 *   - Iniciar ou parar transcrição de voz (ícones de play/stop).
 *
 * Estilos responsivos e rolagem inclusos para melhor usabilidade.
 */


  return (
    <div className="">


      <div className=" w-96 ml-10 pb-4 rounded-lg p-4 overflow-y-auto h-full">
        <h1 className="text-lg font-semibold text-center mb-2 text-white">{titulo}</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}



        <div className="  flex-1 overflow-y-auto p-2 rounded-md text-sm text-white  max-h-[60vh]">
          {transcription ? (
            <p className="whitespace-pre-wrap">{transcription}</p>
          ) : (
            <p className="text-gray-800 text-center">{'Aguardando transcrição...'}</p>
          )}
        </div>


      </div>



      <div className="absolute top-5  mt-auto mb-auto w-24">


        <div className="pb-1">


          <button
            onClick={handleClearTranscription}
            className="bg-blue-500 text-white px-4 py-2 ml-1 rounded-md hover:bg-blue-600 transition"
            title="Limpar Transcrição"
          >
            <FaEraser size={10} />
          </button>
          <button
            onClick={handleSavePDF}
            className="bg-yellow-500 text-white px-4 py-2 ml-1 rounded-md hover:bg-yellow-600 transition"
            title="Salvar PDF"
          >
            <FaFilePdf size={10} />
          </button>
        </div>
        <button
          onClick={() => handleGetInsights(transcription)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md ml-1 hover:bg-yellow-600 transition"
          title="Análise"
        >
          <FaBrain size={10} />
        </button>


        {!listening ? (
          <button
            onClick={handleStartListening}
            className="bg-red-600 text-white px-4 py-2 ml-1 rounded-md hover:bg-red-500 transition"
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
      *



    </div>
  );
}