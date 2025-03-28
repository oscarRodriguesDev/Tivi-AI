'use client'

import Image from 'next/image';
import chamado from '../../../../public/chamado.png'
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Peer, { MediaConnection } from "peerjs";
import { FaMicrophone, FaVideo, FaPhoneAlt, FaShareAlt, FaTimes } from 'react-icons/fa'; // Importando ícones

const ModalMeet = () => {
  const [peerId, setPeerId] = useState<string>("");
  const [remoteId, setRemoteId] = useState<string>("");
  const [msg, setMsg] = useState<string>("Aguardando transcrição");
  const [callActive, setCallActive] = useState<boolean>(false);
  const peerRef = useRef<Peer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null); // Referência para o vídeo local
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null); // Referência para o vídeo remoto
  const currentCall = useRef<MediaConnection | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Função para abrir o modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsOpen(false);
    endCall(); // Fechar a chamada ao fechar o modal
  };

  // Função para monitorar o fluxo de mídia
  const monitorMicrophone = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.muted = volume > 10;
      }
      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  };

  useEffect(() => {
    const peer = new Peer(uuidv4());
    peerRef.current = peer;
    peer.on("open", (id) => setPeerId(id)); // Aqui você recebe o id do peer

    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        monitorMicrophone(stream); // Monitora o áudio
        if (videoRef.current) videoRef.current.srcObject = stream;
        call.answer(stream);
        setCallActive(true);
        currentCall.current = call;

        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        });

        call.on("close", () => endCall()); // Fechar quando a chamada for encerrada
      });
    });

    return () => peer.destroy(); // Limpar peer quando o componente desmontar
  }, []);

  const callPeer = () => {
    setMsg('Transcrevendo Chamada...');
    if (!remoteId || !peerRef.current) return;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false
      }
    }).then((stream) => {
      // Exibe o vídeo local
      if (videoRef.current) videoRef.current.srcObject = stream;

      const call = peerRef.current?.call(remoteId, stream);
      call?.on("stream", (remoteStream) => {
        // Exibe o vídeo remoto
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      });
    });
  };

  const endCall = () => {
    setMsg('');
    if (currentCall.current) {
      currentCall.current.close();
    }
    setCallActive(false);
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={openModal}
      >
        <FaVideo className="mr-2" /> Iniciar Chamada
      </button>

      {isOpen && (
        <div className="absolute w-[1662px] h-[98vh] left-20 top-0 bg-slate-100 rounded-[10px]">
          <Image src={chamado} alt='camera do chamado' width={1662} height={100}/>

          {/* Caixa para o vídeo local */}
          <div className="absolute w-[314px] h-[213px] left-[91.7px] top-[680px] bg-red-400">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted // Muta o vídeo local para não feedback de áudio
              className="w-full h-full rounded-lg shadow-lg border-4 border-indigo-500"
            />
          </div>

          {/* Caixa para o vídeo remoto */}
          <div className="absolute w-[314px] h-[213px] left-[91.7px] top-[49px]">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full rounded-lg shadow-lg border-4 border-indigo-500"
            />
          </div>

          {/* Controles de áudio e vídeo */}
          <div className="absolute w-[59.92px] h-[59.92px] left-[219.42px] top-[964.98px]">
            <FaShareAlt size={30} className="text-white cursor-pointer" />
          </div>

          <div className="absolute w-[59.92px] h-[59.92px] left-[111.23px] top-[964.98px]">
            <FaMicrophone size={30} className="text-white cursor-pointer" />
          </div>

          <div className="absolute w-[59.92px] h-[59.92px] left-[327.61px] top-[964.98px]">
            <FaPhoneAlt size={30} className="text-white cursor-pointer" onClick={endCall} />
          </div>

          {/* Transcrição do texto */}
          <div className="absolute w-[258.97px] h-[767.49px] left-[1398.05px] top-[175.04px] text-white text-[12px] font-bold leading-[15px] border border-[#0000001A] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            <p>{msg}</p>
          </div>

          <button
            className="absolute top-4 right-4 text-white bg-red-500 rounded-full px-4 py-2"
            onClick={closeModal}
          >
            <FaTimes size={20} /> Fechar
          </button>
        </div>
      )}
    </>
  );
};

export default ModalMeet;
