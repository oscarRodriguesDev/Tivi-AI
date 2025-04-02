'use client'

import { ReactNode, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from '../transcriptionPSC';
import { Mic, MicOff, Video, VideoOff, LogOut, X } from "lucide-react";

interface ModalMeetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalMeet: React.FC<ModalMeetProps> = ({ isOpen, onClose }) => {
  const { iddinamico } = useParams();
  const [peerId, setPeerId] = useState<string>("");
  const [callActive, setCallActive] = useState<boolean>(false);
  const [mic, setMic] = useState<boolean>(true);
  const [video, setVideo] = useState<boolean>(true);
  const [transcription, setTranscription] = useState<string>("");
  
  const peerRef = useRef<Peer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentCall = useRef<MediaConnection | null>(null);

  useEffect(() => {
    if (!iddinamico || !isOpen) return;

    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", async (id) => {
      setPeerId(id);
      await fetch(`/api/save_peer?iddinamico=${iddinamico}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iddinamico, peerId: id }),
      }).catch(console.error);
    });

    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video, audio: mic }).then((stream) => {
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

    return () => peer.destroy();
  }, [iddinamico, isOpen, mic, video]);

  const endCall = () => {
    if (currentCall.current) currentCall.current.close();
    [videoRef, remoteVideoRef].forEach(ref => {
      if (ref.current?.srcObject) {
        (ref.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        ref.current.srcObject = null;
      }
    });
    setCallActive(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="relative w-[80%] h-[80%] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Botão para fechar o modal */}
        <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-gray-200 rounded-full hover:bg-gray-300">
          <X size={20} />
        </button>

        {/* Vídeo principal */}
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {/* Vídeo pequeno */}
        <div className="absolute bottom-4 left-4 w-1/4 h-auto border-2 border-indigo-500">
          <video ref={videoRef} autoPlay playsInline className="w-full h-auto bg-black object-cover" />
        </div>

        {/* Controles */}
        {callActive && (
          <div className="absolute bottom-6 left-[50%] transform -translate-x-1/2 flex space-x-6 p-4 bg-gray-800 rounded-xl text-white">
            <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-800" onClick={() => setMic(!mic)}>
              {mic ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-800" onClick={() => setVideo(!video)}>
              {video ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button className="p-3 bg-red-600 rounded-full hover:bg-red-700" onClick={endCall}>
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalMeet;
