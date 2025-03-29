'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { FaCalendarAlt } from 'react-icons/fa';
import Modal from '../components/modalAgendamentos';
import HeadPage from '../components/headPage';


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


          {/* Filtro */}
          <div className="flex space-x-4 mb-0">
            {["Dia", "Semana", "Mês", "Ano"].map((filtro) => (
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
                          <span>Link: <a href={`/publiccall/${ag.id}`} className="underline">
                            /publiccall/{ag.id}
                          </a></span>
                        )}
                      </p>
                      {/*  {error && <p className="text-red-500">{error}</p>} */}
                    </li>
                  ))}
                </ul>

              </div>

          }
          
          {/* agendamentos por semana */}

          {periodo=='Semana'&&
          <div className="bg-gray-200 text-black p-4 max-h-[480px] overflow-y-auto rounded-xl shadow-2xl">
            <h2>Deve mostrar os agendamenos por semana</h2>
          </div>
          }

          {/* Agendamentos por mes */}
          {periodo=='Mês'&&
          <div className="bg-gray-200 text-black p-4 max-h-[480px] overflow-y-auto rounded-xl shadow-2xl">
            <h2>Deve mostrar os agendamenos por Mes</h2>
          </div>
          }

          {/* Agendamentos por ano */}
          {periodo=='Ano'&&
          <div className="bg-gray-200 text-black p-4 max-h-[480px] overflow-y-auto rounded-xl shadow-2xl">
            <h2>Deve mostrar os agendamenos por Ano</h2>
          </div>
          }


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
