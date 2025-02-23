'use client'
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from "../../components/boxTranscript";

// Importando reconhecimento de fala (SpeechRecognition)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'pt-BR'; // Defina o idioma da transcrição

export default function Home() {
  const [peerId, setPeerId] = useState<string>("");
  const [remoteId, setRemoteId] = useState<string>("");
  const [msg, setMsg] = useState<string>("Aguardando transcrição");
  const [callActive, setCallActive] = useState<boolean>(false);
  const peerRef = useRef<Peer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentCall = useRef<MediaConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const { idpaciente } = useParams();
  
  useEffect(() => {
    if (!idpaciente) return;
    
    const peer = new Peer(uuidv4());
    peerRef.current = peer;
    
    peer.on("open", (id) => setPeerId(id));

    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        call.answer(stream);
        setCallActive(true);
        currentCall.current = call;

        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
          startRemoteTranscription(remoteStream); // Inicia transcrição do áudio remoto
        });

        call.on("close", () => endCall());
      });
    });

    return () => peer.destroy();
  }, []);

  // Função para iniciar a transcrição de áudio local
  const startLocalTranscription = () => {
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setMsg((prevMsg) => prevMsg + "\nVocê: " + transcript);
    };
    recognition.start();
  };

  // Função para transcrever áudio remoto
  const startRemoteTranscription = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setMsg((prevMsg) => prevMsg + "\nPaciente: " + transcript);
    };

    recognition.start();
  };

  const callPeer = () => {
    if (!remoteId || !peerRef.current) return;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false
      }
    }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
      startLocalTranscription(); // Inicia transcrição local

      const call = peerRef.current?.call(remoteId, stream);
      call?.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        startRemoteTranscription(remoteStream); // Inicia transcrição remota
      });
    });
  };

  const endCall = () => {
    setMsg("Chamada finalizada.");

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
    recognition.stop();
    setCallActive(false);
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-[#181818] text-white p-8">
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
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-md font-semibold text-sm">Você</div>
          </div>
          <div className="relative w-full h-80">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full rounded-lg shadow-lg border-4 border-indigo-500" />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-md font-semibold text-sm">Parceiro</div>
          </div>
        </div>
      </div>

      <LiveTranscription mensagem={msg} />
    </div>
  );
}
