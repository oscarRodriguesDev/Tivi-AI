'use client';

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from "../../dating/components/transcriptionPSC";
import HeadPage from "@/app/(private-access)/components/headPage";
import { FaVideo } from "react-icons/fa";
import { FcVideoCall, FcEndCall } from "react-icons/fc";
import { showErrorMessage } from "@/app/util/messages";

export default function Home() {

   const [peerId, setPeerId] = useState<string>("");


   const [remoteId, setRemoteId] = useState<string>("")
   const [msg, setMsg] = useState<string>("Aguardando transcrição");
   const [callActive, setCallActive] = useState<boolean>(false);
   const peerRef = useRef<Peer | null>(null);
   const videoRef = useRef<HTMLVideoElement | null>(null);
 
   const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
   const currentCall = useRef<MediaConnection | null>(null);
   const audioContextRef = useRef<AudioContext | null>(null);
   const analyserRef = useRef<AnalyserNode | null>(null);
   const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
   const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
   const params = useParams();
   const searchParams = useSearchParams();
   const iddinamico = params.idpaciente;
   const idpaciente = searchParams.get('iddinamico');
   const [isPsychologist, setIsPsychologist] = useState<boolean>(true);
   const [transcription, setTranscription] = useState<string>("");
 
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

     /*  if (remoteAudioRef.current) {
        remoteAudioRef.current.muted = volume > 10; // Se estiver falando, muta o alto-falante
      } */
      handleTranscription('text', isPsychologist);
      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  };


  useEffect(() => {
    if (!iddinamico) {
      return;
    }

    const peer = new Peer(uuidv4());
    peerRef.current = peer;
  
    peer.on("open", (id) => setPeerId(id));
    peer.on("call", (call) => {
      // Primeiro tenta com vídeo e áudio
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .catch((error) => {
          showErrorMessage("Vídeo bloqueado, tentando somente áudio:", error);
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
          showErrorMessage("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
        });
    });
    

    return () => {
      peer.destroy(); // Limpa instância ao desmontar
    };
  }, [iddinamico]);
  

/**
 * Inicia uma chamada de vídeo com o peer remoto utilizando PeerJS.
 *
 * - Define a mensagem de status como "Transcrevendo Chamada...".
 * - Define o `remoteId` com base no ID do paciente extraído da URL.
 * - Solicita permissão para acessar o microfone e a câmera do dispositivo.
 * - Configura o stream local no `videoRef`.
 * - Realiza a chamada ao peer remoto utilizando o `remoteId` e envia o stream.
 * - Ao receber o stream remoto, define no `remoteVideoRef`.
 * testar
 *
 * ⚠️ Se `remoteId` ou `peerRef` não estiverem definidos, a função retorna sem executar.
 */
  const callPeer = () => {
    setMsg('Transcrevendo Chamada...');
    setRemoteId(idpaciente as string);

    if (!remoteId || !peerRef.current) return;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true, // Reduz eco do próprio microfone
        noiseSuppression: true, // Ajuda a reduzir ruídos
        autoGainControl: false  // Evita que o volume mude sozinho
      }
    }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;

      const call = peerRef.current?.call(remoteId, stream);
      call?.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      });
    });
  };

  const endCall = () => {
    setMsg('');

    if (currentCall.current) {
      currentCall.current.close();
    }
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
 * Atualiza o estado de transcrição com a fala do interlocutor atual.
 *
 * @param text - Texto da fala transcrita.
 * @param isPsychologist - Indica se quem falou foi o psicólogo (`true`) ou o paciente (`false`).
 *
 * A transcrição é armazenada de forma contínua, com prefixo identificando o interlocutor.
 */

  const handleTranscription = (text: string, isPsychologist: boolean) => {
    const speaker = isPsychologist ? 'psicologo' : 'paciente';
    setTranscription(prevTranscription => prevTranscription + `\n${speaker}: ${text}`);
  };

/**
 * Componente de interface da sala de reunião por vídeo.
 *
 * Exibe dois vídeos: um principal para o paciente e um menor sobreposto para o psicólogo.
 * Contém botões para iniciar e encerrar chamadas, além de uma área para transcrição ao vivo da conversa.
 *
 * @returns JSX.Element - Estrutura visual da sala de reunião.
 *
 * Elementos:
 * - `<video ref={remoteVideoRef}>`: Vídeo do paciente (ocupando tela cheia).
 * - `<video ref={videoRef}>`: Vídeo do psicólogo (em tamanho reduzido, sobreposto).
 * - Botões:
 *   - `callPeer`: Inicia a chamada.
 *   - `endCall`: Encerra a chamada.
 * - `LiveTranscription`: Componente de transcrição em tempo real unificada da conversa.
 */


  return (

    <>

      <HeadPage title='Sala de Reunião' icon={<FaVideo size={20} />} />

      <div className=" flex  flex-col items-center justify-center w-[98%] h-[83vh] -my-5 bg-gradient-to-r from-blue-400 to-green-300 text-black p-8">

        <div className="relative w-full h-full">
          {/* video do paciente */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full bg-gray-300 border-4 border-indigo-500 object-cover"
          />
          <div className="absolute top-1 left-2 bg-black bg-opacity-50 text-white p-2 rounded-md font-semibold text-sm">
            Paciente
          </div>
        </div>

        {/* video pscologo */}
        <div className="absolute top-[63%] left-[20%] w-60 h-60">
          <video ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full bg-gray-600 rounded-lg shadow-lg z-50"
            muted={true}
          />
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-md font-semibold text-sm z-50">Psicologo</div>
        </div>


        <div className="absolute top-[90%] left-[55%] flex justify-center pt-8 gap-6 mb-8">
          <button
            onClick={callPeer}
            className="bg-blue-200 rounded-full p-1"
          >
            <FcVideoCall size={24} />

          </button>

          <button
            onClick={endCall}
            className="bg-blue-200 rounded-full p-1"
          >
            <FcEndCall size={24} />
          </button>


        </div>

        {/* Transcrição unificada */}
         <div className="absolute top-[20%] left-[70%] flex justify-center pt-8 gap-6 mb-8">
        <LiveTranscription 
         usuario={'Psicologo'}
         mensagem={transcription} // A transcrição agora é unificada         
         sala={iddinamico as string}
        />
      </div> 
      </div>
    </>

  );
}