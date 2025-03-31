
'use client';
import LiveTranscription from '../components/boxtrancriptv'
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Peer, { MediaConnection } from "peerjs";






export default function VideoCallScreen() {

    const [remoteId, setRemoteId] = useState<string>("");
    const [msg, setMsg] = useState<string>("Aguardando transcrição");
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
    const { iddinamico } = useParams(); // Pegando o ID da URL corretamente
  
    const [peerId, setPeerId] = useState<string>('');
    const [callActive, setCallActive] = useState<boolean>(false);
  
    const peerRef = useRef<Peer | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const currentCall = useRef<MediaConnection | null>(null);
  
  
    //flag para definir quem está falando
    const [isPsychologist, setIsPsychologist] = useState<boolean>(true);
    const [transcription, setTranscription] = useState<string>("");

    

  // Função para monitorar o volume do microfone
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


  // Função de transcrição: recebe o texto e marca se é psicólogo ou paciente
  const handleTranscription = (text: string, isPsychologist: boolean) => {
    // Definindo quem está falando, psicólogo ou paciente
    const speaker = isPsychologist ? 'psicologo' : 'paciente';

    // Atualizando a transcrição com o título correto
    setTranscription(prevTranscription => prevTranscription + `\n${speaker}: ${transcription}`);

  };

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
        });

        call.on("close", () => endCall());
      });
    });

    return () => peer.destroy(); // Limpa o peer ao desmontar
  }, [iddinamico]);

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



  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="relative w-screen h-screen bg-[#202124]">
      {/* Vídeo do Paciente - Ocupa 100% da tela */}
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 font-semibold text-sm">
        Você (Paciente)
      </div>

      {/* Vídeo do Psicólogo - Menor no canto inferior esquerdo */}
      <div className="absolute bottom-4 left-4 w-1/4 h-auto">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto object-cover border-4 border-indigo-500" />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 font-semibold text-sm">
          Psicólogo (Host)
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

      {/* Transcrição ao vivo */}
      <div className="absolute bottom-[40%] right-4 w-auto max-w-[30%]">
        <LiveTranscription usuario={"Paciente"} mensagem={transcription} />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Aviso Importante</h2>
            <p className="text-gray-700">
              Esta sessão está sendo gravada para fins terapêuticos e análise posterior.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
