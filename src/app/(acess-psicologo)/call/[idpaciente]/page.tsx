'use client';

/**
 * Importações necessárias para a página de videochamada com transcrição ao vivo:
 * 
 * - `useEffect`, `useRef`, `useState`: Hooks do React usados para controlar estado, efeitos colaterais e referências a elementos DOM.
 * - `useParams`, `useSearchParams`: Hooks do Next.js App Router para acessar parâmetros da URL.
 * - `uuidv4`: Geração de IDs únicos, utilizado para criar o ID do peer na rede P2P.
 * - `Peer`, `MediaConnection`: Biblioteca PeerJS para criar e gerenciar conexões WebRTC ponto-a-ponto (P2P).
 * - `LiveTranscription`: Componente customizado para exibir a transcrição ao vivo da conversa.
 * - `HeadPage`: Componente para configurar o cabeçalho da página (título e ícone).
 * - `FaVideo`, `FcVideoCall`, `FcEndCall`: Ícones SVG utilizados nos botões da interface para indicar ações de vídeo.
 */

import { useEffect, useRef, useState } from "react";
import { redirect, useParams, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from "@/app/protected-components/transcriptionPSC";
import HeadPage from "@/app/protected-components/headPage";
import { FaVideo } from "react-icons/fa";
import { FcVideoCall, FcEndCall } from "react-icons/fc";
import { useAccessControl } from "@/app/context/AcessControl";


/**
 * Página principal da sala de reunião com videochamada entre psicólogo e paciente,
 * integrando transcrição em tempo real e controle de fluxo da chamada.
 * 
 * Funcionalidades principais:
 * 
 * - Inicializa uma instância do PeerJS (tecnologia P2P/WebRTC) para permitir conexão entre dois usuários (psicólogo e paciente).
 * - Gerencia chamadas de vídeo com áudio e vídeo via WebRTC, permitindo:
 *    - Iniciar chamada
 *    - Receber chamadas
 *    - Encerrar chamadas
 * - Exibe o vídeo local (psicólogo) e remoto (paciente) em tela.
 * - Monitora o volume do microfone para detectar fala e controlar o áudio remoto (evita eco).
 * - Realiza transcrição de falas, separando entre "psicólogo" e "paciente".
 * - Renderiza transcrição unificada usando o componente `<LiveTranscription />`.
 * 
 * Hooks usados:
 * - `useState`: controla o estado da chamada, transcrição, IDs, etc.
 * - `useEffect`: inicializa o PeerJS e escuta chamadas recebidas.
 * - `useRef`: mantém referências para elementos DOM (vídeos, áudio) e instâncias (PeerJS, MediaConnection).
 * - `useParams` e `useSearchParams`: obtém identificadores da URL, usados para vincular os participantes da reunião.
 * 
 * Layout:
 * - Usa Tailwind CSS para posicionamento e responsividade.
 * - Interface com botões de controle da chamada (iniciar e encerrar).
 * - Vídeo principal para o paciente, miniatura sobreposta para o psicólogo.
 * - Área lateral exibe a transcrição das falas em tempo real.
 * 
 * 🔒 Importante:
 * - Os papéis (psicólogo ou paciente) são determinados pelo parâmetro `iddinamico` da URL.
 * - Toda transcrição gerada é mantida localmente no estado e enviada para backend separadamente (não nesta função).
 */


export default function Home() {

   /**
   * ID gerado automaticamente pelo PeerJS para identificar este cliente (psicólogo ou paciente).
   */
   const [peerId, setPeerId] = useState<string>("");

   /**
    * ID do outro participante da chamada (usado para conectar a outra ponta).
    */
   const [remoteId, setRemoteId] = useState<string>("");
 
   /**
    * Mensagem de status ou transcrição exibida na interface.
    */
   const [msg, setMsg] = useState<string>("Aguardando transcrição");
 
   /**
    * Booleano que indica se uma chamada está atualmente ativa.
    */
   const [callActive, setCallActive] = useState<boolean>(false);
 
   /**
    * Referência à instância do PeerJS utilizada para chamadas WebRTC P2P.
    */
   const peerRef = useRef<Peer | null>(null);
 
   /**
    * Referência ao elemento de vídeo local (psicólogo).
    */
   const videoRef = useRef<HTMLVideoElement | null>(null);
 
   /**
    * Referência ao elemento de vídeo remoto (paciente).
    */
   const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
 
   /**
    * Referência à chamada ativa do tipo `MediaConnection`.
    */
   const currentCall = useRef<MediaConnection | null>(null);
 
   /**
    * Referência ao contexto de áudio Web Audio API, usado para análise de volume/microfone.
    */
   const audioContextRef = useRef<AudioContext | null>(null);
 
   /**
    * Referência ao analisador de frequência, usado para detectar atividade de voz.
    */
   const analyserRef = useRef<AnalyserNode | null>(null);
 
   /**
    * Fonte de áudio vinculada ao microfone do usuário.
    */
   const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
 
   /**
    * Referência a um elemento de áudio que representa o som remoto (usado para mutar dependendo do volume).
    */
   const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
 
   /**
    * Parâmetros dinâmicos da URL obtidos via roteamento do Next.js.
    * Exemplo: /sala/123 → params.idpaciente = "123"
    */
   const params = useParams();
 
   /**
    * Parâmetros de consulta (query string) da URL.
    * Exemplo: /sala?idpaciente=123&iddinamico=abc → idpaciente = "123", iddinamico = "abc"
    */
   const searchParams = useSearchParams();
 
   /**
    * ID dinâmico do paciente extraído da URL (rota dinâmica).
    */
   const iddinamico = params.idpaciente;
 
   /**
    * ID do paciente extraído da query string (?iddinamico=).
    */
   const idpaciente = searchParams.get('iddinamico');
 
   /**
    * Booleano que identifica se o usuário atual é o psicólogo (padrão: true).
    */
   const [isPsychologist, setIsPsychologist] = useState<boolean>(true);
 
   /**
    * Transcrição unificada contendo todas as falas da conversa (psicólogo e paciente).
    */
   const [transcription, setTranscription] = useState<string>("");
 



  /**
 * Inicia a análise em tempo real do volume captado pelo microfone local,
 * utilizando a Web Audio API. O volume é usado para identificar quando
 * o usuário está falando e, se for o paciente, silenciar o áudio remoto
 * para evitar eco durante a transcrição.
 *
 * @param {MediaStream} stream - O fluxo de mídia local contendo o áudio do microfone.
 *
 * - Cria um `AudioContext` se ainda não existir.
 * - Conecta o microfone a um `AnalyserNode` para análise de frequência.
 * - Verifica continuamente o volume e ajusta o `muted` do `remoteAudioRef` se necessário.
 * - Chama `handleTranscription('text', isPsychologist)` em cada frame de análise.
 *
 * ⚠️ Nota: o texto `'text'` passado para `handleTranscription` é fixo neste trecho
 * e pode ser substituído por transcrição real futuramente.
 */
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



/**
 * Efeito responsável por inicializar a instância PeerJS do paciente e escutar chamadas recebidas.
 * 
 * - Cria um novo peer com um UUID gerado aleatoriamente.
 * - Salva a instância do peer em `peerRef`.
 * - Quando o peer estiver pronto (`open`), salva o ID com `setPeerId`.
 * - Escuta por chamadas (`call`) recebidas:
 *    - Solicita permissão para acessar câmera e microfone.
 *    - Monitora o microfone com `monitorMicrophone(stream)`.
 *    - Define o stream local no `videoRef`.
 *    - Responde à chamada com o stream local.
 *    - Ao receber o stream remoto, define no `remoteVideoRef`.
 *    - Escuta evento `close` para encerrar a chamada com `endCall()`.
 * 
 * ⚠️ Importante: este efeito roda apenas uma vez, ao montar o componente, e quando `iddinamico` estiver definido.
 * 
 * 🚮 Ao desmontar o componente, destrói a instância do Peer com `peer.destroy()` para liberar recursos.
 */



/**
 * Efeito responsável por inicializar e configurar uma instância PeerJS ao montar o componente,
 * quando o identificador dinâmico (`iddinamico`) estiver disponível.
 *
 * - Cria um novo peer com um UUID único e armazena em `peerRef`.
 * - Ao abrir a conexão, define o `peerId` local.
 * - Escuta chamadas recebidas (`on("call")`), solicita acesso à câmera e microfone,
 *   configura o vídeo local e remoto, e inicia a monitoria do microfone.
 * - Ao término da chamada (`on("close")`), executa a função `endCall`.
 *
 * 🧼 Limpeza: Ao desmontar o componente, destrói a instância do peer para liberar recursos.
 *
 * @dependency [iddinamico] - O efeito será executado sempre que `iddinamico` for definido ou alterado.
 */
/* 
  useEffect(() => {
    if (!iddinamico){
      console.log('iddinamico',iddinamico)
      return; 
    }  
      
    console.log('iddinamico',iddinamico)
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
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        
          // Se quiser, também pode criar um elemento <audio> separado
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current.play();
          }
          
        });

        call.on("close", () => endCall()); // Listener para quando a chamada for encerrada
      });
    });

    return () => peer.destroy(); // Limpa a instância do Peer ao desmontar
  }, [iddinamico]);
 */


  useEffect(() => {
    if (!iddinamico) {
      console.log('iddinamico', iddinamico);
      return;
    }
  
    console.log('iddinamico', iddinamico);
    const peer = new Peer(uuidv4());
    peerRef.current = peer;
  
    peer.on("open", (id) => setPeerId(id));
  
    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        monitorMicrophone(stream);
  
        if (videoRef.current) videoRef.current.srcObject = stream;
  
        call.answer(stream);
        setCallActive(true);
        currentCall.current = call;
  
        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current.play();
          }
        });
  
        // 🔴 Adiciona o listener para quando a chamada for encerrada
        call.on("close", () => {
          console.warn("Conexão encerrada pelo outro participante.");
          alert("A chamada foi encerrada pelo paciente ou a conexão foi perdida.");
          endCall(); // Finaliza e limpa
        });
  
        // ⚠️ Adiciona o listener para erros na chamada
        call.on("error", (err) => {
          console.error("Erro na chamada:", err);
          alert("Ocorreu um erro na conexão com o paciente.");
          endCall();
        });
      }).catch((err) => {
        console.error("Erro ao acessar câmera/microfone:", err);
        alert("Não foi possível acessar a câmera ou microfone.");
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




/**
 * Encerra a chamada de vídeo ativa e libera os recursos de mídia.
 *
 * - Limpa a mensagem de status da interface.
 * - Fecha a conexão da chamada ativa, se existir.
 * - Interrompe todas as trilhas de mídia (áudio e vídeo) da câmera local e do vídeo remoto.
 * - Remove os objetos de mídia das referências de vídeo (`videoRef` e `remoteVideoRef`).
 * - Atualiza o estado para indicar que a chamada não está mais ativa.
 */

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
    redirect('/common-page')
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
