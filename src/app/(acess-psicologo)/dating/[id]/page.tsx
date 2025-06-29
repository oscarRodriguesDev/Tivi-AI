'use client';
import { useState, useEffect, use, useRef } from 'react';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { FaCalendarAlt } from 'react-icons/fa';
import Modal from '@/app/protected-components/modalAgendamentos';
import HeadPage from '@/app/protected-components/headPage';
import ViewMes from '@/app/protected-components/viewMes';
import ViewSemanal from '@/app/protected-components/viewSemana';
import { FaTrash, FaEdit, FaWhatsapp } from 'react-icons/fa';
import { Agendamento } from '../../../../../types/agendamentos';
import ModalMeetEdit from '@/app/protected-components/modal-meet-edit';
import { useParams } from 'next/navigation';
import Notiflix from 'notiflix';
import { showErrorMessage, showInfoMessage, showPersistentLoadingMessage, showSuccessMessage, updateToastMessage } from '@/app/util/messages';
import ViewDay from '@/app/protected-components/viewmeet';


export default function AgendamentoPage() {

  const psicologo = useParams().id
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [isModalMeet, setIsModalMeet] = useState(false);
  const handleOpenModalMeet = () => setIsModalMeet(true);
  const handleCloseModalMeet = () => setIsModalMeet(false);
  const { role, hasRole } = useAccessControl();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [novoAgendamento, setNovoAgendamento] = useState<Omit<Agendamento, 'id'>>({
    psicologoId: '',
    fantasy_name: '',
    name: '',
    titulo: '',
    data: '',
    hora: '',
    tipo_consulta: '',
    observacao: '',
    recorrencia: '',
    duracao: '',
    code: '',
  });
  const [peerIds, setPeerIds] = useState<{ [key: string]: string }>({});
  const [idUser, setIdUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const hoje = format(new Date(), 'dd/MM/yyyy');
  const [error, setError] = useState<string | null>(null);
  const [copiedLinks, setCopiedLinks] = useState<{ [key: string]: boolean }>({});
  const [periodo, setPeriodo] = useState<string>('Dia');
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [online, setOnline] = useState<boolean>(false);
  const [buscando, setBuscando] = useState<boolean>(true);
  const [agendamentosDoDia, setAgendamentosDoDia] = useState<Agendamento[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const emProcesso = useRef<Set<string>>(new Set());


  //edição de reuniões
  const handleEditar = (agendamento: any) => {
    if (agendamento.id === 'fake-id') {
      showErrorMessage("impossivel editar demonstração");
    } else {
      setAgendamentoSelecionado(agendamento);
      setModalAberto(true);
    }
    if (!modalAberto) {
      setBuscando(true)
      buscarAgendamentos()
    }
  };


  //buscar os agendamentos
  const buscarAgendamentos = async () => {
    try {
      const response = await fetch(`/api/internal/gen-meet/?id=${psicologo}`);
      if (response.ok) {
        const data = await response.json();
        setBuscando(false)
        setAgendamentos(data);
        setLoading(false)

      } else {
        showErrorMessage("Erro ao buscar agendamentos");
      }
    } catch (error) {
      showErrorMessage("Erro de conexão" + error);
    }
  };



  //buscar quando inciar a tela
  useEffect(() => {
    if (buscando === true) {
      //definir tempo de atualização dos agendamentos
      const intervalId = setInterval(() => {
        buscarAgendamentos();
      }, 3000);
      //limpar o intervalo ao desmontar o componente
      return () => clearInterval(intervalId);
    } else {
      return
    }
  }, [buscando]);



  //buscando o id de conexão para a reunião
  const fetchPeerId = async (id: string, meet: Agendamento) => {
    if (emProcesso.current.has(id)) return;
    emProcesso.current.add(id);
    try {
      const toastId = showPersistentLoadingMessage(`Verificando se ${meet.name} está na sala...`);
      if (id === 'fake-id') {
        updateToastMessage(toastId, `Usuario demonstrativo, não avaliado para consultas`, 'error');
        return
      }
      const response = await fetch(`/api/save_peer?iddinamico=${id}`);
      if (response.ok) {
        updateToastMessage(toastId, `${meet.name} já está na sala de reunião, você ja pode iniciar a sessão!`, 'success');
        setOnline(false)
        const data = await response.json();
        if (data.peerId) {
          setPeerIds((prev) => ({ ...prev, [id]: data.peerId }));
          setIdUser(data.peerId);
          setError(null);
        }
      } else {
        updateToastMessage(toastId, `${meet.name} ainda não está na sala!`, 'error');
        setOnline(false)
        throw new Error("ID não encontrado");
      }
    } catch (err: any) {
      setError("Erro ao buscar o ID");
      updateToastMessage(err, 'Algo não funcionou como esperado!', 'error');

    } finally {
      setLoading(false);
      emProcesso.current.delete(id);
      updateToastMessage('', 'Obrigado por utilizar nossos serviços');
    }
  };



  //quando o usuario clica no dia do mes
  const handleDayClick = (dia: number) => {
    showInfoMessage(`Abrindo consultas para o dia ${dia}`);
    // Filtrar agendamentos do dia selecionado
    const filtrados = agendamentos.filter((agendamento) => {
      const dataAgendamento = new Date(agendamento.data); // Ajuste conforme formato da data
      return dataAgendamento.getDate() === dia;
    });
    setAgendamentosDoDia(filtrados);
    setModalAberto(true);
  };

  //permite copiar o link da reunião
  const handleCopy = (id: string) => {
    if (id === "fake-id") {
      showErrorMessage("O link de demonstração não pode ser copiado!");
    } else {
      const link = `${window.location.origin}/publiccall/${id}/${psicologo}`;
      navigator.clipboard.writeText(link).then(() => {
        setCopiedLinks((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
          setCopiedLinks((prev) => ({ ...prev, [id]: false }));
        }, 1500);
      });
    }
  };


  //copiar o link e mandar pelo whatsapp
  const copiarLinkParaWhatsApp = (idReuniao: string, data: string, hora: string) => {
    if (idReuniao === "fake-id") {
      showErrorMessage("O link de demonstração não pode ser copiado!");
    } else {
      const linkReuniao = `/publiccall/${idReuniao}/${psicologo}`;
      const mensagem = `Olá! Aqui está o link para acessar sua reunião agendada:
      Data: ${data}
      Hora: ${hora}
      Clique no link para acessar a reunião: ${window.location.origin}${linkReuniao}`;
      navigator.clipboard.writeText(mensagem).then(() => {
        showInfoMessage('Mensagem copiada! Agora, abra o WhatsApp e cole a mensagem.');
        const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
      }).catch(err => {
        showErrorMessage('Erro ao copiar a mensagem: ', err);
      });
    }
  };


  //deletar reunião
  const handleDeletar = async (id: string) => {
    Notiflix.Confirm.show(
      'Título',
      'Deseja mesmo deletar essa reunião?',
      'Sim',
      'Não',
      async () => {
        if (id === "fake-id") {
          showErrorMessage('Impossível deletar a demonstração');
        } else {
          try {
            const response = await fetch(`/api/internal/gen-meet`, {
              method: 'DELETE',
              body: JSON.stringify({ id }),
            });
            if (response.ok) {
              showSuccessMessage("Agendamento deletado com sucesso");
              buscarAgendamentos();
            } else {
              showErrorMessage("Erro ao deletar agendamento");
            }
          } catch (error) {
            showErrorMessage("Erro de conexão com o servidor");
          }
        }
      },
      () => {
        showInfoMessage("Nenhuma alteração realizada!");
      }
    );
  };



  //verifica se ha agendamento
  const verifica = (ag: Agendamento) => {
    const agora = new Date().getTime();

    // Cria a data completa com hora no formato ISO, considerando o fuso -03:00 (Brasil)
    const dataHoraStr = `${ag.data}T${ag.hora}:00-03:00`;
    const agendamentoTimestamp = new Date(dataHoraStr).getTime();

    if (isNaN(agendamentoTimestamp)) {
      showErrorMessage(`Data/hora inválida no agendamento ${ag.id}: ${ag.data} ${ag.hora}`);
      return false;
    }

    // Converte a duração (em minutos) para milissegundos e soma ao timestamp do início da reunião
    const duracaoMs = (Number(ag.duracao) || 1) * 60 * 1000; // default: 60 min se não houver valor
    const fimAgendamento = agendamentoTimestamp + duracaoMs;

    // Verifica se o momento atual já ultrapassou o fim da reunião
    if (fimAgendamento <= agora && ag.id !== 'fake-id') {
      return true;
    } else {
      return false;
    }
  };


  //formatar data:
  function formatLocalDate(date: Date | string) {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }


  function formatDate(date: Date | string) {
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }



  return (
    <>
      {/* componente cabeçalho das paginas */}
      <HeadPage
        title='Agendamentos'
        icon={<FaCalendarAlt />}
      />

      {/* Essa regra de acesso é para essa pagina na verdade deve ser role===psicologo*/}
      {role === 'PSYCHOLOGIST' ? (
        <div className="flex-col h-[80vh]  p-8 text-white">
          <Modal isOpen={isModalOpen} onClose={() => {
            handleCloseModal()
           buscarAgendamentos()
          }} />

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
                  {agendamentos
                    .filter((meet) => {
                      const hoje = formatLocalDate(new Date()); // usa horário local, sem UTC
                      const dataAgendamento =meet.data;
                      console.log(hoje, '\\',dataAgendamento)
                      return dataAgendamento === hoje;
                    })


                    .map((meet) => (
                      <li key={meet.id} className="p-3 bg-white rounded-lg mb-3 shadow-md">
                        <div className="text-xl w-full font-semibold text-white text-center bg-slate-600">
                          Consulta Online com: {meet.name}
                        </div>
                        <div className="text-lg font-medium text-blue-800">
                          Nick name: {meet.fantasy_name}
                        </div>
                        <div className="text-base text-blue-800">
                          Data da reunião: <span className="font-medium">{formatDate(meet.data)} | duração: {meet.duracao} minutos</span>
                        </div>
                        <div className="text-sm text-blue-700">Horário: {meet.hora}</div>
                        <div className="text-sm text-blue-600">{meet.observacao}</div>
                        <div className="text-sm text-blue-400">
                          {peerIds[meet.id] ? (
                            <button
                              onClick={() => redirect(`/call/${meet.id}/?iddinamico=${idUser}`)}
                              className="bg-blue-600 hover:bg-blue-500 text-white rounded p-2"
                            >
                              Iniciar Reunião com {meet.name}
                            </button>
                          ) : (
                            <div>
                              {verifica(meet) ? (
                                <div className="text-red-600 text-sm">Reunião vencida</div>
                              ) : (
                                <div className="text-red-600 text-sm">
                                  Link:
                                  <div
                                    className="text-black cursor-pointer w-full"
                                    onClick={() => {
                                      handleCopy(meet.id);
                                    }}
                                  >
                                    /publiccall/{meet.id}
                                  </div>
                                </div>
                              )}
                              {copiedLinks[meet.id] && (
                                <span className="text-green-500 text-sm">Link copiado!</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 pt-5">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEditar(meet)}
                          >
                            <FaEdit size={20} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeletar(meet.id)}
                          >
                            <FaTrash size={20} />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-400"
                            onClick={() => {
                              copiarLinkParaWhatsApp(meet.id, meet.data, meet.hora);
                            }}
                          >
                            {!verifica(meet) && <FaWhatsapp size={20} />}
                          </button>
                          <button
                            className="px-4 py-2 rounded-2xl bg-green-100 text-green-700 font-medium hover:bg-green-200 hover:text-green-800 transition-colors duration-200 shadow-sm border border-green-300"
                            onClick={() => {
                              fetchPeerId(meet.id, meet);
                            }}
                          >
                            Status do paciente
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>

            }

            {/* agendamentos por semana */}
            {periodo == 'Semana' &&
              <ViewSemanal
                agendamentos={agendamentos}
                onDelete={handleDeletar}
                onEdit={handleEditar}
              />
            }

            {/* Agendamentos por Mês */}
            {periodo === "Mês" && (


              <ViewMes
                agendamentos={agendamentos}
                onDayClick={handleDayClick}
              />


            )}

            <ViewDay
              isOpen={modalAberto}
              onClose={() => setModalAberto(false)}
              agendamentos={agendamentos}
              onEdit={(agendamentos) => { handleDeletar(agendamentos.id) }}
              onDelete={(agendamentos) => { handleEditar(agendamentos.id) }}
            />


            <div className="w-full h-auto mt-5 flex justify-around items-end">

              <button
                onClick={() => {
                  handleOpenModal()


                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Agendar
              </button>

            </div>


          </div>
          {/* Modal para edição */}
          {agendamentoSelecionado && (
            <ModalMeetEdit
              isOpen={modalAberto}
              onClose={() => setModalAberto(false)}
              meet={agendamentoSelecionado}
            />
          )}

        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
      )}

    </>
  );
}