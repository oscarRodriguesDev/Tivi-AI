'use client'
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from "../../components/boxTranscript";

export default function Home() {
  const [peerId, setPeerId] = useState<string>("");
  const [remoteId, setRemoteId] = useState<string>("");
  const [msgPsicologo, setMsgPsicologo] = useState<string>("Aguardando transcrição...");
  const [msgPaciente, setMsgPaciente] = useState<string>("Aguardando transcrição...");
  const [callActive, setCallActive] = useState<boolean>(false);
  const peerRef = useRef<Peer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentCall = useRef<MediaConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const { idpaciente } = useParams();
  
  const recognitionPsicologo = useRef<SpeechRecognition | null>(null);
  const recognitionPaciente = useRef<SpeechRecognition | null>(null);

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
          remoteStreamRef.current = remoteStream;
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
          iniciarTranscricaoPaciente(remoteStream); // Inicia a transcrição do paciente
        });

        call.on("close", () => endCall());
      });
    });

    return () => peer.destroy();
  }, []);

  const callPeer = () => {
    if (!remoteId || !peerRef.current) return;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
      iniciarTranscricaoPsicologo(stream); // Inicia a transcrição do psicólogo

      const call = peerRef.current?.call(remoteId, stream);
      call?.on("stream", (remoteStream) => {
        remoteStreamRef.current = remoteStream;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        iniciarTranscricaoPaciente(remoteStream); // Inicia a transcrição do paciente
      });
    });
  };

  const iniciarTranscricaoPsicologo = (stream: MediaStream) => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error("Reconhecimento de fala não suportado no navegador.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionPsicologo.current = new SpeechRecognition();
    recognitionPsicologo.current.continuous = true;
    recognitionPsicologo.current.interimResults = true;
    recognitionPsicologo.current.lang = "pt-BR";

    recognitionPsicologo.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setMsgPsicologo(transcript);
    };

    recognitionPsicologo.current.start();
  };

  const iniciarTranscricaoPaciente = (stream: MediaStream) => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error("Reconhecimento de fala não suportado no navegador.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionPaciente.current = new SpeechRecognition();
    recognitionPaciente.current.continuous = true;
    recognitionPaciente.current.interimResults = true;
    recognitionPaciente.current.lang = "pt-BR";

    recognitionPaciente.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setMsgPaciente(transcript);
    };

    recognitionPaciente.current.start();
  };

  const endCall = () => {
    setMsgPsicologo('');
    setMsgPaciente('');

    recognitionPsicologo.current?.stop();
    recognitionPaciente.current?.stop();

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
            className="w-full p-4 rounded-lg border-2 border-gray-700 bg-[#303030] text-white"
            onChange={(e) => setRemoteId(e.target.value)}
          />
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <button onClick={callPeer} className="w-32 py-3 px-6 text-white bg-indigo-600 rounded-lg">Chamar</button>
          <button onClick={endCall} className="w-32 py-3 px-6 text-white bg-red-600 rounded-lg">Finalizar</button>
        </div>
        
        <LiveTranscription titulo="Psicólogo" mensagem={msgPsicologo} />
        <LiveTranscription titulo="Paciente" mensagem={msgPaciente} />
      </div>
    </div>
  );
}
