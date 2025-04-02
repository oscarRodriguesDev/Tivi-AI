'use client';

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from '../../components/transcriptPAC'
import { Mic, MicOff, Video, VideoOff, LogOut } from "lucide-react";

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

  const [mic, setMic] = useState<boolean>(true);
  const [video, setVideo] = useState<boolean>(true);


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

  return (
    <div className="relative w-screen h-screen bg-gradient-to-r from-blue-400 to-green-300">
      {/* Vídeo do Paciente - Ocupa 100% da tela */}
     {/*  <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" /> */}
     <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-2 left-2 text-blue-800 p-2 font-semibold text-sm">
        Psicologo
      </div>


      {/* Vídeo do Psicólogo - Menor no canto inferior esquerdo */}
      <div className="absolute bottom-4 left-4 w-1/4 h-auto">
        {/* <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto bg-black object-cover border-2 border-indigo-500" /> */}
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto bg-black object-cover border-2 border-indigo-500" />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 font-semibold text-sm">
          você
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
      {/* nessa versão vamos buscar a transcrição do paciente e enviar para o psicólogo, 
      mas estamos trabalhando para conseguir buscar a trasncriçao diretor do auto falante do psicologo */}

      <div className=" absolute  bottom-[40%] right-4 w-auto max-w-[30%]">
        <LiveTranscription
          usuario={'Paciente'}
          mensagem={transcription} // A transcrição agora é unificada         
        />
      </div>

      
      <div className="absolute bottom-6 left-[50%] transform -translate-x-1/2 flex space-x-6 p-4 rounded-xl">

      {/* botão para desativar o microfone */}
        <button
          className="p-3 bg-gray-700 text-white rounded-full shadow-md hover:bg-gray-800 transition"
          onClick={() => {
            setMic(!mic)
            if(mic){
              //LIGAR MICROFONE
            }else{
              //DESLIGAR MICROFONE
            }
          }}
        >
          {mic ? <Mic size={12} /> : <MicOff size={12} />}
        </button>


        <button
    className="p-3 bg-gray-700 text-white rounded-full shadow-md hover:bg-gray-800 transition"
    onClick={() => {setVideo(!video)
      if(video){
       //LIGAR VIDEO
      }else{
        //DESLIGAR VIDEO
      }
    }}
  >
    {video ? <Video size={12} /> : <VideoOff size={12} />}
  </button>

  <button
    className="p-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
    onClick={endCall}
  >
    <LogOut size={12} />
  </button>
      </div>

    </div>



  );
}
