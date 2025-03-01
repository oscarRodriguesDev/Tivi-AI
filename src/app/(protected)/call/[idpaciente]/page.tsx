'use client';
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from "../../../components/boxtrancriptv";

export default function Home() {
  const [peerId, setPeerId] = useState<string>("");
  const [remoteId, setRemoteId] = useState<string>("");
  const [msg, setMsg] = useState<string>("Aguardando transcrição");
  const [callActive, setCallActive] = useState<boolean>(false); // Controle da chamada ativa
  const peerRef = useRef<Peer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentCall = useRef<MediaConnection | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const { idpaciente } = useParams(); // Pegando o ID da URL corretamente


  // Flag para distinguir quem está falando
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
      handleTranscription('text', isPsychologist);
      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  };

  useEffect(() => {
    if (!idpaciente) return; // não faz nada
    const peer = new Peer(uuidv4());
    peerRef.current = peer;
    peer.on("open", (id) => setPeerId(id));

    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        monitorMicrophone(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
        call.answer(stream);
        setCallActive(true);
        currentCall.current = call; // Armazena a chamada ativa

        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        });

        call.on("close", () => endCall()); // Listener para quando a chamada for encerrada
      });
    });

    return () => peer.destroy(); // Limpa a instância do Peer ao desmontar
  }, []);

  const callPeer = () => {
    setMsg('Transcrevendo Chamada...');

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

  // Função de transcrição: recebe o texto e marca se é psicólogo ou paciente
  const handleTranscription = (text: string, isPsychologist: boolean) => {
    // Definindo quem está falando, psicólogo ou paciente
    const speaker = isPsychologist ? 'psicologo' : 'paciente';

    // Atualizando a transcrição com o título correto
    setTranscription(prevTranscription => prevTranscription + `\n${speaker}: ${text}`);
  };

  return (
    <div className="flex  flex-row items-center justify-center min-h-screen bg-[#181818] text-white p-8">
      <div className="w-full max-w-4xl bg-[#202124] p-6 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-semibold text-center text-indigo-500 mb-6">Video Conferência</h1>

        <p className="text-lg text-center text-gray-400 mb-2">Sua ID de Participante</p>
        <p className="text-2xl font-semibold text-center text-indigo-400 mb-8">{peerId}</p>

        <div className="w-full max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Digite o ID do parceiro"
            className="w-full p-4 rounded-lg border-2 border-gray-700 bg-[#303030] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-md transition duration-200"
            onChange={(e) => setRemoteId(e.target.value)}
          />
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={callPeer}
            className="w-32 py-3 px-6 text-white bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-lg shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          >
            Chamar
          </button>
          <button
            onClick={endCall}
            className="w-32 py-3 px-6 text-white bg-gradient-to-r from-red-600 to-red-400 rounded-lg shadow-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
          >
            Finalizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="relative w-full h-80">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full rounded-lg shadow-lg border-4 border-indigo-500" />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-md font-semibold text-sm">Psicologo</div>
          </div>
          <div className="relative w-full h-80">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full rounded-lg shadow-lg border-4 border-indigo-500" />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-md font-semibold text-sm">Paciente</div>
          </div>
        </div>
      </div>

      {/* Transcrição unificada */}
      <div>
        <LiveTranscription 
         usuario={'Psicologo'}
         mensagem={transcription} // A transcrição agora é unificada         
        />
      </div>
    </div>
  );
}
