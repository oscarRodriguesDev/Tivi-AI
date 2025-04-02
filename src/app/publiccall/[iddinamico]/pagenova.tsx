'use client';

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from '../../components/transcriptPAC'

export default function PublicCallPage() {

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
  const [transcription, setTranscription] = useState<string>("fazendo um teste");



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

  return (
    <div className="flex flex-row  items-center justify-center min-h-screen bg-white text-white ">
      <div className="flex flex-row items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300 text-white">
        <div className="w-full relative">

          <div className="absolute top-0 w-[92vw] h-[92vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-indigo-500">

            <div className="absolute flex flex-col items-center w-full p-6">
              <h1 className="text-indigo-700 mb-2 text-4xl font-extrabold drop-shadow-lg">Consulta Agendada</h1>
              <p className="text-lg text-center text-indigo-600 mb-2">ID da Sala: {iddinamico}</p>
              <p className="text-lg text-center text-indigo-600 mb-8">Sua conexão ID: {peerId}</p>
            </div>

            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-6 left-2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md">Você (Paciente)</div>

            <div className="absolute bottom-8 left-2 w-64 h-40 rounded-lg overflow-hidden border-2 border-indigo-400 shadow-lg">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md font-semibold text-sm">Psicólogo (Host)</div>
            </div>

            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
              {callActive && (
                <button
                  onClick={endCall}
                  className="py-3 px-8 text-white bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-lg hover:from-red-700 hover:to-red-500 focus:outline-none focus:ring-4 focus:ring-red-500 transition-transform transform hover:scale-105 duration-300"
                >
                  Sair
                </button>
              )}
            </div>

          </div>

        </div>
      </div>





      {/* Transcrição unificada */}
      {/*  <div>
        <LiveTranscription
          usuario={'Paciente'}
          mensagem={transcription} // A transcrição agora é unificada   
                
        />
      </div> */}
    </div>
  );
}
