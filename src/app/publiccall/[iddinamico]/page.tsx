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


    //codigo antigo do peeron call
    // Responder chamadas do psicólogo
    /*   peer.on("call", (call) => {
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
   */

  /*   peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
          call.answer(stream);
          setCallActive(true);
          currentCall.current = call;
          monitorMicrophone(stream);
          setMsg('Transcrevendo Chamada...');

          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
            if (remoteAudioRef.current) {
              remoteAudioRef.current.srcObject = remoteStream;
              remoteAudioRef.current.play();
            }
          });

          call.on("close", () => endCall());
        })
        .catch((error) => {
          console.error("Erro ao acessar microfone/câmera:", error);
          alert("Não foi possível acessar o microfone ou a câmera. Verifique as permissões do navegador.");
        });
    });

 */


    peer.on("call", (call) => {
      // Primeiro tenta com vídeo e áudio
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .catch((error) => {
          console.warn("Vídeo bloqueado, tentando somente áudio:", error);
          return navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        })
        .then((stream) => {
          if (!stream) {
            throw new Error("Sem acesso ao microfone e câmera");
          }
    
          if (videoRef.current && stream.getVideoTracks().length > 0) {
            videoRef.current.srcObject = stream;
          }
    
          call.answer(stream);
          setCallActive(true);
          currentCall.current = call;
          monitorMicrophone(stream);
          setMsg('Transcrevendo Chamada...');
    
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current && remoteStream.getVideoTracks().length > 0) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
            if (remoteAudioRef.current) {
              remoteAudioRef.current.srcObject = remoteStream;
              remoteAudioRef.current.play();
            }
          });
    
          call.on("close", () => endCall());
        })
        .catch((finalError) => {
          console.error("Erro total ao acessar mídia:", finalError);
          alert("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
        });
    });
    
    return () => peer.destroy(); // Limpa o peer ao desmontar
  }, []);




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
  const [hasShownAlert, setHasShownAlert] = useState(false);

  useEffect(() => {
    if (!hasShownAlert) {
      alert('Por favor, aguarde o psicólogo entrar na sala. Não saia desta página ou você poderá perder a conexão.');
      setHasShownAlert(true);
    }
  }, [hasShownAlert]);

  useEffect(() => {
    const handleUnload = () => {
      if (currentCall.current) {
        currentCall.current.close();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);




  return (

    //codigo antigo da tela de call do paciente ainda podemos utilziar alguma coisa daqui

    /*    
       <div className="">
         <video ref={remoteVideoRef} autoPlay playsInline className="" />
         <div className="">
           Psicologo
         </div>
         <div className="">
           <video
            ref={videoRef}
             autoPlay
              playsInline
              className="" 
              muted={true}
              />
           <div className="">
             você
           </div>
         </div>
         <div className="">
           <LiveTranscription
             usuario={'Paciente'}
             mensagem={transcription}
             sala={iddinamico as string}
           />
         </div>
         <div className="">
         
           <button
             className=""
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
             className=""
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
             className=""
             onClick={endCall}
           >
             <LogOut size={12} />
           </button>
         </div>
       </div>
   
     */
    <div className="min-h-screen bg-gray-900 text-white p-4 relative">
      {/* Video Container */}
      <div className="relative w-full h-[calc(100vh-200px)] rounded-lg overflow-hidden">
        {/* Remote Video (Psychologist) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video (Patient) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-blue-500 shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            muted={true}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-xs text-center">
            Você
          </div>
        </div>
      </div>

      {/* Transcription Area */}
      <div className="mt-4 bg-gray-800 rounded-lg p-4 h-[150px] overflow-y-auto">
        <LiveTranscription
          usuario={'Paciente'}
          mensagem={transcription}
          sala={iddinamico as string}
        />
      </div>

      {/* Control Buttons */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-800/80 p-3 rounded-full backdrop-blur-sm">
        <button
          className="p-3 rounded-full hover:bg-gray-700 transition-colors"
          onClick={() => {
            setMic(!mic);
            if (mic) {
              //LIGAR MICROFONE
            } else {
              //DESLIGAR MICROFONE
            }
          }}
        >
          {mic ? <Mic size={20} className="text-white" /> : <MicOff size={20} className="text-red-500" />}
        </button>

        <button
          className="p-3 rounded-full hover:bg-gray-700 transition-colors"
          onClick={() => {
            setVideo(!video);
            if (video) {
              //LIGAR VIDEO
            } else {
              //DESLIGAR VIDEO
            }
          }}
        >
          {video ? <Video size={20} className="text-white" /> : <VideoOff size={20} className="text-red-500" />}
        </button>

        <button
          className="p-3 rounded-full hover:bg-red-600 transition-colors bg-red-500"
          onClick={endCall}
        >
          <LogOut size={20} className="text-white" />
        </button>
      </div>
    </div>
  );




}


//testando