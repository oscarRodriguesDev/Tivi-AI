'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { FaCalendarAlt } from 'react-icons/fa';
import Modal from '../components/modalAgendamentos';
import HeadPage from '../components/headPage';
import ViewMes from '../components/viewMes';
import { FaTrash, FaEdit, FaWhatsapp } from 'react-icons/fa';
import ModalMeet from '../components/[id-paciente]/modalmeet';


interface Agendamento {
  id: string;
  psicologoId: string;
  fantasy_name: string;
  name: string;
  titulo: string;
  data: string;
  hora: string;
  tipo_consulta: string;
  observacao: string;
  recorrencia: string;
}

//definir as variaveis de url
export default function AgendamentoPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const[isModalMeet,setIsModalMeet] = useState(false);
  const handleOpenModalMeet = () => setIsModalMeet(true);
  const handleCloseModalMeet = () => setIsModalMeet(false);


  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([


  ]);

  const [novoAgendamento, setNovoAgendamento] = useState<Omit<Agendamento, 'id'>>({
    psicologoId: '', // Certifique-se de incluir todos os campos necessários
    fantasy_name: '', // como os campos psicologoId, fantasy_name, etc.
    name: '',
    titulo: '', // Título da reunião
    data: '', // Data da reunião
    hora: '',
    tipo_consulta: '', // Tipo da consulta (presencial, online, etc.)
    observacao: '',
    recorrencia: '', // Recorrência da consulta (diária, semanal, mensal, etc.)
  });


  const [peerIds, setPeerIds] = useState<{ [key: string]: string }>({}); // Armazena o peerId por agendamento
  const [idUser, setIdUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);     // Para controle de loading
  const hoje = format(new Date(), 'dd/MM/yyyy');
  const [error, setError] = useState<string | null>(null);     // Para mostrar erros

  const [copied, setCopied] = useState(false);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovoAgendamento((prev) => ({ ...prev, [name]: value }));
  };
  const [periodo, setPeriodo] = useState<string>('Dia')


  //essa função vai continuar gerando o usuauario para mim

  /**
   * @deprecated Esta função será removida em breve. 
   * Utilize o modal para manipular o envio de agendamentos.
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.warn("⚠️ handleSubmit está depreciada. Use handleNewSubmit.");

    if (novoAgendamento.name && novoAgendamento.hora) {
      const novo: Agendamento = { ...novoAgendamento, id: uuidv4() };
      setAgendamentos([...agendamentos, novo]);
      setNovoAgendamento({
        psicologoId: '',
        fantasy_name: '',
        name: '',
        titulo: '',
        data: '',
        hora: '',
        tipo_consulta: '',
        observacao: '',
        recorrencia: ''
      });
    }
  };


  //função para buscar os agendamentos no banco de dados
  const buscarAgendamentos = async () => {

    try {
      const response = await fetch("/api/gen-meet");
      if (response.ok) {
        const data = await response.json();
        console.log("Dados recebidos:", data); // Verifique os dados aqui
        setAgendamentos(data);

      } else {
        console.error("Erro ao buscar agendamentos");
      }
    } catch (error) {
      console.error("Erro de conexão", error);
    }
  };

  // Executa a função de buscar os dados quando o componente for montado
  useEffect(() => {
    buscarAgendamentos();
  }, []);


  //monitora se o paciente ja esta em reunião
  useEffect(() => {
    const fetchPeerId = async (id: string) => {
      try {
        setLoading(true);
        const response = await fetch(`/api/save_peer?iddinamico=${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.peerId) {
            setPeerIds((prev) => ({ ...prev, [id]: data.peerId }));  // Atualiza o peerId para o agendamento específico
            setError(null);  // Limpa qualquer erro
            setIdUser(data.peerId);
          }
        } else {
          throw new Error('ID não encontrado');
        }
      } catch (err) {
        setError('Erro ao buscar o ID');
      } finally {
        setLoading(false);
      }
    };

    // Faz uma requisição a cada 5 segundos (5000ms) até encontrar o peerId
    const intervalId = setInterval(() => {
      agendamentos.forEach((ag) => {
        if (!peerIds[ag.id]) {  // Verifica se ainda não encontrou o peerId para este agendamento
          fetchPeerId(ag.id);
        }
      });
    }, 20000);  // Requisição a cada 5 segundos

    // Limpeza do intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, [agendamentos, peerIds]);


  const handleDayClick = (dia: number) => {
    // Exemplo: você pode usar o console ou redirecionar para uma página com os detalhes desse dia.
    alert(`Abrindo consultas para o dia ${dia}`);

    // Aqui você pode fazer algo como mostrar uma modal, ou redirecionar para uma página com mais detalhes do dia
    // Por exemplo:
    // router.push(`/detalhes-do-dia/${dia}`);
  };

  //função que permite copia
  const handleCopy = (id: string) => {
    const link = `${window.location.origin}/publiccall/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Resetando o estado após 2 segundos
    });
  };

  //função para copiar para whatsapp
  const copiarLinkParaWhatsApp = (idReuniao: string, data: string, hora: string) => {
    const linkReuniao = `/publiccall/${idReuniao}`;
    const mensagem = `Olá! Aqui está o link para acessar sua reunião agendada:
  
  Data: ${data}
  Hora: ${hora}
  
  Clique no link para acessar a reunião: ${window.location.origin}${linkReuniao}`;
  
    // Copiar a mensagem para a área de transferência
    navigator.clipboard.writeText(mensagem).then(() => {
      alert('Mensagem copiada! Agora, abra o WhatsApp e cole a mensagem.');
  
      // Abrir o WhatsApp Web com a mensagem copiada
      const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
      
      // Abrir o WhatsApp Web em uma nova aba
      window.open(url, '_blank');
    }).catch(err => {
      console.error('Erro ao copiar a mensagem: ', err);
    });
  };
  
  


  return (
    <>
    

      {/* componente cabeçalho das paginas */}
      <HeadPage
        title='Agendamentos'
        icon={<FaCalendarAlt />}
      />

      {role !== 'PSYCHOLOGIST' ? (
        <div className="flex-col h-[80vh]  p-8 text-white">
          <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
          <ModalMeet isOpen={isModalMeet} onClose={handleCloseModalMeet} />


          {/* Filtro */}
          <div className="flex space-x-4 mb-0">
            {["Dia", "Semana", "Mês"].map((filtro) => (
              <button
                key={filtro}
                className={`px-4 py-0 rounded-sm transition ${periodo === filtro
                  ? "bg-blue-500 text-white" // Estilo do botão ativo
                  : "bg-white text-black hover:bg-blue-200"
                  }`}
                onClick={() => setPeriodo(filtro)}
              >
                {filtro}
              </button>
            ))}
          </div>


          {/* Lista de Agendamentos */}
          <div className="w-full  p-6  rounded-xl shadow-xl">
            <h2 className="text-2xl text-black font-semibold mb-4">Consultas Agendadas - {hoje}</h2>


            {/* agendamentos por dia */}
            {periodo == 'Dia' &&
              <div className="bg-gray-200 p-4 max-h-[480px] overflow-y-auto rounded-xl shadow-2xl">
                <ul>
                  {agendamentos.map((ag) => (
                    <li key={ag.id} className="p-3 bg-white rounded-lg mb-3 shadow-md">
                      <p className="text-lg font-bold text-blue-950">Consulta OnLine</p>
                      <p className="text-lg font-bold  text-blue-950"> Reunião com {ag.fantasy_name}</p> 
                      <p className="text-sm  text-blue-950">Horário: {ag.hora}</p>
                      <p className="text-sm  text-blue-950">{ag.observacao}</p>
                      <p className="text-sm text-blue-400">
                        {loading ? (
                          <span className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-semibold">
                            Carregando...
                          </span>
                        ) : peerIds[ag.id] ? (
                          <button
                          onClick={() => redirect(`/call/${idUser}`)} 
                         
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded p-2"
                          >
                            Iniciar Reunião com {ag.name}
                          </button>
                        ) : (

                          <span>
                            Link:
                            <p
                              className="text-black cursor-pointer w-full"
                              onClick={()=>{handleCopy(ag.id)}}
                            >
                              /publiccall/{ag.id}
                            </p>
                            {copied && <span className="text-green-500 text-sm">Link copiado!</span>}

                          </span>

                        )}
                      </p>
                      <div className="flex space-x-2 pt-5">
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaEdit size={20} />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <FaTrash size={20} />
                        </button>
                        <button className="text-green-600 hover:text-green-400"
                        onClick={()=>{copiarLinkParaWhatsApp(ag.id,ag.data,ag.hora)}}
                        >
                          <FaWhatsapp size={20} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

              </div>

            }

            {/* agendamentos por semana */}

            {periodo == 'Semana' &&
              <div className="bg-gray-200 text-black p-4 max-h-[480px] overflow-y-auto rounded-xl shadow-2xl">
                <h2 className="text-xl font-semibold mb-4">Agendamentos da Semana</h2>

                <div className="grid grid-cols-7 gap-4">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, index) => (
                    <div key={dia} className="bg-white p-3 rounded-lg shadow">
                      <h3 className="text-lg font-medium">{dia}</h3>

                      {agendamentos
                        .filter((agendamento) => new Date(agendamento.data).getDay() === index)
                        .map((agendamento) => (
                          <div key={agendamento.id} className="mt-2 p-2 bg-blue-100 rounded-lg">
                            <p className="font-semibold">{agendamento.name}</p>
                            <p>{agendamento.hora}</p>

                          </div>
                        ))}

                      {agendamentos.filter((a) => new Date(a.data).getDay() === index).length === 0 && (
                        <p className="text-sm text-gray-500">Sem agendamentos</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            }

            {/* Agendamentos por Mês */}
            {periodo === "Mês" && (


              <ViewMes
                agendamentos={agendamentos}
                onDayClick={handleDayClick}
              />


            )}





            <div className="w-full h-auto mt-5 flex justify-end items-end">
              <button
                onClick={handleOpenModal}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Agendar
              </button>
            </div>


          </div>


        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
      )}




    </>

    //envio para produção

  );
}
