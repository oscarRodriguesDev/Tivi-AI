'use client';

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Peer, { MediaConnection } from "peerjs";

export default function PublicCallPage() {
  const { iddinamico } = useParams(); // Pegando o ID da URL corretamente

  const [peerId, setPeerId] = useState<string>('');
  const [callActive, setCallActive] = useState<boolean>(false);

  const peerRef = useRef<Peer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentCall = useRef<MediaConnection | null>(null);

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

        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        });

        call.on("close", () => endCall());
      });
    });

    return () => peer.destroy(); // Limpa o peer ao desmontar
  }, [iddinamico]);

  const endCall = () => {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#181818] text-white p-8">
      <div className="w-full max-w-4xl bg-[#202124] p-6 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-semibold text-center text-indigo-500 mb-6">Reunião de Psicoterapia</h1>

        <p className="text-lg text-center text-gray-400 mb-2">ID da Sala: {iddinamico}</p>
        <p className="text-lg text-center text-gray-400 mb-8">Sua conexão ID: {peerId}</p>

        <div className="flex justify-center mb-8">
          {callActive && (
            <button
              onClick={endCall}
              className="w-32 py-3 px-6 text-white bg-gradient-to-r from-red-600 to-red-400 rounded-lg shadow-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
            >
              Sair
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="relative w-full h-80">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full rounded-lg shadow-lg border-4 border-indigo-500" />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-md font-semibold text-sm">Você (Paciente)</div>
          </div>
          <div className="relative w-full h-80">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full rounded-lg shadow-lg border-4 border-indigo-500" />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-md font-semibold text-sm">Psicólogo (Host)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
