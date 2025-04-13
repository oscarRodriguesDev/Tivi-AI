'use client';


/**
 * Importações necessárias para o funcionamento do componente de videochamada:
 *
 * - `useEffect`, `useRef`, `useState`: Hooks do React para lidar com estado, referências e efeitos colaterais.
 * - `useParams`: Hook do Next.js para acessar os parâmetros da URL.
 * - `Peer`, `MediaConnection`: Componentes da biblioteca PeerJS para estabelecer conexões P2P de áudio/vídeo.
 * - `LiveTranscription`: Componente personalizado responsável pela transcrição ao vivo da conversa.
 * - Ícones (`Mic`, `MicOff`, `Video`, `VideoOff`, `LogOut`): Ícones da biblioteca Lucide para representar os controles da interface.
 */

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from '../../components/transcriptPAC'
import { Mic, MicOff, Video, VideoOff, LogOut } from "lucide-react";


/**
 * Componente `PublicCallPage`
 *
 * Este componente representa a interface da videochamada pública entre psicólogo e paciente.
 * Ele utiliza a biblioteca `peerjs` para estabelecer uma conexão P2P (peer-to-peer) de vídeo e áudio,
 * além de monitorar o microfone do paciente e gerar transcrições em tempo real, que são exibidas para o psicólogo.
 *
 * 🔹 FUNCIONALIDADES PRINCIPAIS:
 * - Estabelece chamada de vídeo e áudio entre dois usuários (psicólogo e paciente).
 * - Identifica o papel do participante (psicólogo ou paciente) e organiza a transcrição conforme o papel.
 * - Usa o Web Audio API (`AnalyserNode`) para monitorar o volume de entrada e determinar se alguém está falando.
 * - Envia o ID do peer para uma API back-end para mapeamento com a sessão da sala.
 * - Exibe a transcrição em tempo real usando o componente `<LiveTranscription />`.
 * - Permite ligar/desligar microfone e vídeo localmente.
 *
 * 🔧 USO DE HOOKS E REFERÊNCIAS:
 * - `useState`: Controla estados de interface e dados como vídeo, áudio, transcrição, ID do peer, etc.
 * - `useRef`: Armazena elementos de vídeo/áudio e instâncias persistentes como `Peer` e `AudioContext`.
 * - `useEffect`: Inicializa o peer e define os manipuladores de chamada ao carregar o componente.
 * - `useParams`: Captura o `iddinamico` da URL para identificar a sala.
 *
 * 🧠 MONITORAMENTO DE MICROFONE:
 * - A função `monitorMicrophone` usa `AnalyserNode` para ler o volume do microfone.
 * - Quando o volume é alto o suficiente, assume que o usuário está falando e dispara `handleTranscription`.
 * - O áudio remoto é automaticamente mutado para evitar eco durante a fala.

 * 📝 TRANSCRIÇÃO:
 * - `handleTranscription` atualiza o estado com a transcrição da conversa, separando psicólogo e paciente.
 * - A transcrição é exibida ao vivo para o psicólogo, e associada à sala em questão.

 * 📹 INTERFACE:
 * - Vídeo principal: mostra o vídeo do outro participante.
 * - Vídeo em miniatura: mostra o próprio vídeo.
 * - Controles flutuantes: ativar/desativar microfone, vídeo e encerrar chamada.
 *
 * 🚨 NOTAS:
 * - A parte de ligar/desligar microfone e vídeo ainda precisa ser implementada funcionalmente.
 * - Atualmente, a transcrição é feita apenas do lado do paciente (ou quem estiver configurado como `!isPsychologist`).
 * - A gravação e transcrição do áudio do psicólogo diretamente do alto-falante ainda está em desenvolvimento.
 *
 * 🧪 DEPENDÊNCIAS:
 * - `peerjs`: conexão WebRTC simplificada.
 * - `lucide-react`: ícones para a interface.
 * - `LiveTranscription`: componente personalizado para exibir e salvar transcrições.

 * @returns JSX.Element - Interface completa da videochamada com transcrição ao vivo.
 */


export default function PublicCallPage() {



/**
 * ID do peer remoto (opcionalmente utilizado para referência futura).
 * Pode ser usado para reconectar ou registrar a chamada.
 */
const [remoteId, setRemoteId] = useState<string>("");

/**
 * Mensagem de status exibida durante a transcrição (ex: "Aguardando transcrição").
 */
const [msg, setMsg] = useState<string>("Aguardando transcrição");

/**
 * Referência ao contexto de áudio utilizado para processar e analisar o som do microfone.
 */
const audioContextRef = useRef<AudioContext | null>(null);

/**
 * Referência ao analisador de frequência da Web Audio API.
 * Utilizado para monitorar o volume do microfone em tempo real.
 */
const analyserRef = useRef<AnalyserNode | null>(null);

/**
 * Fonte de áudio conectada ao microfone local, usada como entrada para o analisador.
 */
const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

/**
 * Referência ao elemento de áudio do participante remoto, utilizado para controlar o som recebido.
 */
const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

/**
 * ID dinâmico da sala de atendimento, extraído da URL usando o App Router do Next.js.
 */
const { iddinamico } = useParams();

/**
 * ID único gerado para o peer atual ao se conectar ao servidor PeerJS.
 */
const [peerId, setPeerId] = useState<string>("");

/**
 * Indica se uma chamada de vídeo está ativa no momento.
 */
const [callActive, setCallActive] = useState<boolean>(false);

/**
 * Referência ao objeto PeerJS que representa o peer local.
 */
const peerRef = useRef<Peer | null>(null);

/**
 * Referência ao elemento de vídeo local (do próprio usuário).
 */
const videoRef = useRef<HTMLVideoElement | null>(null);

/**
 * Referência ao vídeo do participante remoto.
 */
const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

/**
 * Representa a conexão de mídia ativa com o outro participante da chamada.
 */
const currentCall = useRef<MediaConnection | null>(null);

/**
 * Estado que controla se o microfone local está ligado ou desligado.
 */
const [mic, setMic] = useState<boolean>(true);

/**
 * Estado que controla se a câmera local está ligada ou desligada.
 */
const [video, setVideo] = useState<boolean>(true);

/**
 * Define se o usuário atual é o psicólogo.
 * Usado para rotular corretamente as falas na transcrição.
 */
const [isPsychologist, setIsPsychologist] = useState<boolean>(true);

/**
 * Armazena a transcrição da conversa realizada durante a chamada.
 */
const [transcription, setTranscription] = useState<string>("");


 

  /**
   * Função para monitorar o volume do microfone.
   * 
   * - Cria um contexto de áudio se ainda não existir.
   * - Configura um analisador de frequência para detectar atividade sonora.
   * - Conecta a fonte de áudio do microfone ao analisador.
   * @param {MediaStream} stream - Fluxo de áudio do microfone local.
   * @returns {void}
   */
  const monitorMicrophone = (stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const audioContext = audioContextRef.current;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Definição do tamanho da análise de frequência
    analyserRef.current = analyser;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    sourceRef.current = source;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length; // Calcula o volume médio

      if (remoteAudioRef.current) {
        remoteAudioRef.current.muted = volume > 10; // Se estiver falando, muta o alto-falante
      }
      handleTranscription(transcription, !isPsychologist);
      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  };


  /**
 * Atualiza a transcrição da conversa em tempo real, identificando o falante como psicólogo ou paciente.
 *
 * @param {string} text - Texto da fala capturada para ser adicionada à transcrição.
 * @param {boolean} isPsychologist - Indica se a fala é do psicólogo (`true`) ou do paciente (`false`).
 */

  const handleTranscription = (text: string, isPsychologist: boolean) => {
    // Definindo quem está falando, psicólogo ou paciente
    const speaker = isPsychologist ? 'psicologo' : 'paciente';

    // Atualizando a transcrição com o título correto
    setTranscription(prevTranscription => prevTranscription + `\n${speaker}: ${transcription}`);

  };



/**
 * Efeito que inicializa a conexão PeerJS para chamadas de vídeo.
 *
 * - Cria um novo `Peer` e obtém seu ID ao abrir a conexão.
 * - Envia o `peerId` gerado para a API associando-o ao `iddinamico` da URL.
 * - Escuta chamadas recebidas e responde com mídia local (áudio/vídeo).
 * - Conecta os fluxos de mídia local e remota aos elementos de vídeo correspondentes.
 * - Inicia o monitoramento do microfone para controlar o áudio remoto com base no volume.
 * - Limpa e destrói o peer ao desmontar o componente.
 *
 * @dependency `iddinamico` - ID dinâmico extraído da URL, necessário para associar o `peerId` na API.
 */

  useEffect(() => {
    if (!iddinamico) return; // Se não tem ID na URL, não faz nada

    const peer = new Peer(); // Cria um novo peer
    peerRef.current = peer;

    peer.on("open", async (id) => {
      setPeerId(id); // Define o ID do Peer

      try {
        // Envia o ID gerado para a API
        await fetch(`/api/save_peer?iddinamico=${iddinamico}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ iddinamico, peerId: id }),
        });
      } catch (error) {
        console.error("Erro ao enviar peerId para a API:", error);
      }
    });

    // Responder chamadas do psicólogo
    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        call.answer(stream);
        setCallActive(true);
        currentCall.current = call;
        monitorMicrophone(stream);
        setMsg('Transcrevendo Chamada...');


        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        
          // Se quiser, também pode criar um elemento <audio> separado
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current.play();
          }

          
        });

        call.on("close", () => endCall());
      });
    });

    return () => peer.destroy(); // Limpa o peer ao desmontar
  }, [iddinamico]);




  /** 
   * Encerra a chamada de vídeo atual.
   *
   * - Limpa a mensagem de status.
   * - Fecha a conexão ativa.
   * - Para o fluxo de vídeo local.
   * - Para o fluxo de vídeo remoto.
   * 
   */
  const endCall = () => {
    setMsg('');
    if (currentCall.current) currentCall.current.close();
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current?.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    setCallActive(false);
  };



  /**
 * Renderiza a interface da chamada de vídeo entre psicólogo e paciente.
 *
 * - Exibe o vídeo remoto (psicólogo) em tela cheia.
 * - Exibe o vídeo local (paciente) em miniatura no canto inferior esquerdo.
 * - Mostra a identificação de quem é quem na chamada.
 * - Inclui um botão "Sair" para encerrar a chamada.
 * - Exibe a transcrição ao vivo da fala do paciente, sendo enviada ao psicólogo.
 * - Controles para ligar/desligar microfone e câmera, com ícones que refletem o estado atual.
 *
 * @returns {JSX.Element} JSX do layout da chamada com controles e transcrição.
 */

  return (
    <div className="relative w-screen h-screen bg-gradient-to-r from-blue-400 to-green-300">
      {/* Vídeo do Paciente - Ocupa 100% da tela */}
      {/*  <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" /> */}
      <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-2 left-2 text-blue-800 p-2 font-semibold text-sm">
        Psicologo
      </div>


      {/* Vídeo do Psicólogo - Menor no canto inferior esquerdo */}
      <div className="absolute bottom-4 left-4 w-1/4 h-auto">
        {/* <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto bg-black object-cover border-2 border-indigo-500" /> */}
        <video
         ref={videoRef}
          autoPlay
           playsInline
           className="w-full h-auto bg-black object-cover border-2 border-indigo-500" 
           muted={true}
           />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 font-semibold text-sm">
          você
        </div>
      </div>

      {/* Botão de Sair - Ajustado para ficar acima do vídeo */}
      {callActive && (
        <div className="absolute top-4 right-4">
          <button
            onClick={endCall}
            className="py-3 px-6 text-white bg-gradient-to-r from-red-600 to-red-400 shadow-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
          >
            Sair
          </button>
        </div>
      )}
      {/* nessa versão vamos buscar a transcrição do paciente e enviar para o psicólogo, 
      mas estamos trabalhando para conseguir buscar a trasncriçao diretor do auto falante do psicologo */}

      <div className=" absolute  bottom-[40%] right-4 w-auto max-w-[30%]">
        <LiveTranscription
          usuario={'Paciente'}
          mensagem={transcription}
          sala={iddinamico as string}

        />
      </div>


      <div className="absolute bottom-6 left-[50%] transform -translate-x-1/2 flex space-x-6 p-4 rounded-xl">

        {/* botão para desativar o microfone */}
        <button
          className="p-3 bg-gray-700 text-white rounded-full shadow-md hover:bg-gray-800 transition"
          onClick={() => {
            setMic(!mic)
            if (mic) {
              //LIGAR MICROFONE
            } else {
              //DESLIGAR MICROFONE
            }
          }}
        >
          {mic ? <Mic size={12} /> : <MicOff size={12} />}
        </button>


        <button
          className="p-3 bg-gray-700 text-white rounded-full shadow-md hover:bg-gray-800 transition"
          onClick={() => {
            setVideo(!video)
            if (video) {
              //LIGAR VIDEO
            } else {
              //DESLIGAR VIDEO
            }
          }}
        >
          {video ? <Video size={12} /> : <VideoOff size={12} />}
        </button>

        <button
          className="p-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
          onClick={endCall}
        >
          <LogOut size={12} />
        </button>
      </div>

    </div>



  );
}
