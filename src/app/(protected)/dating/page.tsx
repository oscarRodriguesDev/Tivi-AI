'use client';


/**
 * Importações necessárias para o componente de agendamento e controle de acesso.
 *
 * @module AgendamentoPage
 *
 * @requires useState - Hook do React para gerenciar o estado local do componente.
 * @requires useEffect - Hook do React para lidar com efeitos colaterais, como requisições ou sincronizações.
 * @requires format - Função da biblioteca `date-fns` usada para formatar datas de forma flexível.
 * @requires redirect - Função do Next.js usada para redirecionar o usuário para outra rota programaticamente.
 * @requires useAccessControl - Hook personalizado que fornece informações de controle de acesso do usuário, como permissões e roles.
 *
 * @requires FaCalendarAlt - Ícone de calendário da biblioteca `react-icons`, usado para representar ações ou seções relacionadas a datas.
 * @requires Modal - Componente de modal personalizado utilizado para exibir e manipular agendamentos.
 * @requires HeadPage - Componente responsável pelo cabeçalho da página, incluindo título e navegação contextual.
 * @requires ViewMes - Componente que renderiza a visualização do mês atual no calendário ou agendamentos.
 *
 * @requires FaTrash - Ícone de lixeira usado para ações de exclusão.
 * @requires FaEdit - Ícone de lápis usado para ações de edição.
 * @requires FaWhatsapp - Ícone do WhatsApp, normalmente usado para ações de compartilhamento ou comunicação via app.
 */

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { FaCalendarAlt } from 'react-icons/fa';
import Modal from '../components/modalAgendamentos';
import HeadPage from '../components/headPage';
import ViewMes from '../components/viewMes';
import { FaTrash, FaEdit, FaWhatsapp } from 'react-icons/fa';
import { Agendamento } from '../../../../types/agendamentos';
import ModalMeetEdit from '../components/modal-meet-edit';



/**
 * @file AgendamentoPage.tsx
 * @description Página de agendamentos voltada para usuários com papel de psicólogo no sistema.
 * 
 * Esta página permite a visualização, criação e gerenciamento de consultas psicológicas,
 * com suporte a exibição por dia, semana ou mês. Também permite a geração de links de chamada,
 * compartilhamento via WhatsApp, e integração com sistema P2P para chamadas em tempo real.
 *
 * ### Principais Funcionalidades:
 * - Verifica o papel do usuário com `useAccessControl`, permitindo acesso apenas a psicólogos.
 * - Busca agendamentos na API (`/api/gen-meet`) e armazena-os no estado local.
 * - Organiza a exibição dos agendamentos por período: Dia, Semana ou Mês.
 * - Inicia reuniões via integração com PeerJS e gera links de acesso.
 * - Copia links da reunião para a área de transferência ou WhatsApp.
 * - Oferece modal para criação de novos agendamentos.
 * - Monitora continuamente o status dos `peerIds` dos agendamentos a cada 20 segundos.
 *
 * ### Estados Utilizados:
 * - `agendamentos`: lista de agendamentos obtidos da API.
 * - `novoAgendamento`: estrutura usada para criação de novos agendamentos.
 * - `peerIds`: controle de peerId de cada agendamento (chamadas P2P).
 * - `loading`, `error`: estados auxiliares para controle de carregamento e erros.
 * - `periodo`: filtro de visualização (Dia, Semana, Mês).
 * - `copiedLinks`: controle visual de links copiados para feedback do usuário.
 *
 * ### Restrições:
 * - Apenas usuários com o papel `PSYCHOLOGIST` podem visualizar e interagir com a página.
 *
 * @component
 * @returns {JSX.Element} A interface de gerenciamento de agendamentos para psicólogos.
 */

export default function AgendamentoPage() {

  /**
  * Controla a visibilidade do modal principal.
  */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Abre o modal principal.
   */
  const handleOpenModal = () => setIsModalOpen(true);

  /**
   * Fecha o modal principal.
   */
  const handleCloseModal = () => setIsModalOpen(false);

  /**
   * Controla a visibilidade do modal de reunião.
   */
  const [isModalMeet, setIsModalMeet] = useState(false);

  /**
   * Abre o modal de reunião.
   */
  const handleOpenModalMeet = () => setIsModalMeet(true);

  /**
   * Fecha o modal de reunião.
   */
  const handleCloseModalMeet = () => setIsModalMeet(false);

  /**
   * Obtém o papel do usuário e a função para verificar permissões.
   */
  const { role, hasRole } = useAccessControl();

  /**
   * Lista de agendamentos.
   */
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  /**
   * Estado para armazenar dados do novo agendamento (sem id).
   */
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
    code: '',
  });

  /**
   * Mapeia o ID do agendamento para o peerId (chamada P2P).
   */
  const [peerIds, setPeerIds] = useState<{ [key: string]: string }>({});

  /**
   * ID do usuário atual.
   */
  const [idUser, setIdUser] = useState<string>("");

  /**
   * Estado de carregamento de ações assíncronas.
   */
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Data atual formatada como dd/MM/yyyy.
   */
  const hoje = format(new Date(), 'dd/MM/yyyy');

  /**
   * Armazena mensagens de erro.
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Indica quais links de agendamento já foram copiados.
   */
  const [copiedLinks, setCopiedLinks] = useState<{ [key: string]: boolean }>({});

  /**
   * Define o filtro de período para exibição (ex: Dia, Semana).
   */
  const [periodo, setPeriodo] = useState<string>('Dia');

  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);



  //função para editar o agendamento
  const handleEditar = (agendamento: any) => {
    setAgendamentoSelecionado(agendamento);
    setModalAberto(true);
   
  };



  /**
  * Busca os agendamentos na API e atualiza o estado com os dados recebidos.
  * 
  * Faz uma requisição GET para a rota "/api/gen-meet".
  * Em caso de sucesso, atualiza o estado `agendamentos` com os dados retornados.
  * Em caso de erro, exibe mensagens no console.
  */
  const buscarAgendamentos = async () => {

    try {
      const response = await fetch("/api/gen-meet");
      if (response.ok) {
        const data = await response.json();
        //console.log("Dados recebidos:", data); // Verifique os dados aqui
        setAgendamentos(data);

      } else {
        console.error("Erro ao buscar agendamentos");
      }
    } catch (error) {
      console.error("Erro de conexão", error);
    }
  };

  /**
 * Executa a função `buscarAgendamentos` uma única vez ao montar o componente.
 * 
 * Equivalente ao `componentDidMount`. Garante que os agendamentos sejam carregados ao iniciar.
 */
 useEffect(() => {
  //definir tempo de atualização dos agendamentos
  const intervalId = setInterval(() => {
     buscarAgendamentos();
  }, 1000);

  //limpar o intervalo ao desmontar o componente
  return () => clearInterval(intervalId);
}, [agendamentos]);


  /**
   * Monitora os agendamentos e tenta buscar o `peerId` correspondente para cada um deles.
   * 
   * A cada 20 segundos, faz uma requisição para `/api/save_peer` usando o ID do agendamento.
   * Se encontrar o `peerId`, atualiza o estado correspondente. Para quando o componente desmonta.
   * 
   * Dependências: `agendamentos`, `peerIds`.
   */
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

   
    const intervalId = setInterval(() => {
      agendamentos.forEach((ag) => {
        if (!peerIds[ag.id]) {
          fetchPeerId(ag.id);
        }
      });
    }, 5000);  

    // Limpeza do intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, [agendamentos, peerIds]);


  //função ainda será definida
  const handleDayClick = (dia: number) => {
    // Exemplo: você pode usar o console ou redirecionar para uma página com os detalhes desse dia.
    alert(`Abrindo consultas para o dia ${dia}`);
  };

  /**
 * Copia o link da chamada pública para a área de transferência e atualiza o estado visual de cópia.
 * 
 * @param {string} id - ID do agendamento usado para montar o link da chamada.
 * 
 * Exibe feedback visual por 1 segundo indicando que o link foi copiado com sucesso.
 */
  const handleCopy = (id: string) => {
    const link = `${window.location.origin}/publiccall/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLinks((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedLinks((prev) => ({ ...prev, [id]: false }));
      }, 1000);
    });
  };

  
  const copiarLinkParaWhatsApp = (idReuniao: string, data: string, hora: string) => {
    const linkReuniao = `/publiccall/${idReuniao}`;
    const mensagem = `Olá! Aqui está o link para acessar sua reunião agendada:
  
  Data: ${data}
  Hora: ${hora}
  
  Clique no link para acessar a reunião: ${window.location.origin}${linkReuniao}`;


  
   /**
 * Gera uma mensagem com data, hora e link de reunião, copia para a área de transferência
 * e abre o WhatsApp Web com a mensagem preenchida.
 * 
 * @param {string} idReuniao - ID da reunião para compor o link de acesso.
 * @param {string} data - Data da reunião (formato legível).
 * @param {string} hora - Hora da reunião.
 * 
 * Exibe um alerta informando que a mensagem foi copiada e abre o WhatsApp Web em nova aba.
 */
    navigator.clipboard.writeText(mensagem).then(() => {
      alert('Mensagem copiada! Agora, abra o WhatsApp e cole a mensagem.');
      const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
    }).catch(err => {
      console.error('Erro ao copiar a mensagem: ', err);
    });
  };

  
  const  handleDeletar = async(id: string) => {
    const response = await fetch(`/api/gen-meet`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
    alert("Agendamento deletado com sucesso");
    buscarAgendamentos();
    } else {
    alert("Erro ao deletar agendamento");
  }; 
  }



/**
 * Componente principal da página de Agendamentos.
 * 
 * Renderiza a interface de visualização e controle de consultas agendadas,
 * com filtros por período (Dia, Semana, Mês), além de botões para copiar e
 * compartilhar o link da reunião. Disponível apenas para usuários com o papel de psicólogo.
 * 
 * @returns {JSX.Element} Interface de agendamentos com filtros, botões de ação e visualização por período.
 * 
 * - Role != 'PSYCHOLOGIST': Mostra a interface completa de agendamentos.
 * - Role == 'PSYCHOLOGIST': Mostra aviso de acesso restrito.
 * 
 * Funcionalidades:
 * - Filtragem por Dia, Semana e Mês
 * - Iniciar chamada se `peerId` estiver disponível
 * - Copiar link ou compartilhar via WhatsApp
 * - Abertura de modal para novo agendamento
 */
  return (
    <>
      {/* componente cabeçalho das paginas */}
      <HeadPage
        title='Agendamentos'
        icon={<FaCalendarAlt />}
      />

      {/* Essa regra de acesso é para essa pagina na verdade deve ser role===psicologo*/}
      {role !== 'PSYCHOLOGIST' ? (
        <div className="flex-col h-[80vh]  p-8 text-white">
          <Modal isOpen={isModalOpen} onClose={handleCloseModal} />

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
                  {agendamentos.map((meet) => (
                    /* melhorar esse layout */
                    <li key={meet.id} className="p-3 bg-white rounded-lg mb-3 shadow-md">
                    <p className="text-xl w-full font-semibold text-white text-center bg-slate-600">Consulta Online com {meet.name}</p>
                    <p className="text-lg font-medium text-blue-800">Nick name {meet.fantasy_name}</p>
                    <span className="text-base text-blue-800">Data da reunião: <span className="font-medium">{meet.data}</span></span>
                    <p className="text-sm text-blue-700">Horário: {meet.hora}</p>
                    <p className="text-sm text-blue-600">{meet.observacao}</p>
                      <p className="text-sm text-blue-400">
                        {loading ? (
                          <span className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-semibold">
                            Carregando...
                          </span>
                        ) : peerIds[meet.id] ? (
                          <button
                            onClick={() => redirect(`/call/${meet.id}/?iddinamico=${idUser}`)}

                            className="bg-blue-600 hover:bg-blue-500 text-white rounded p-2"
                          >
                            Iniciar Reunião com {meet.name}
                          </button>
                        ) : (

                          <span>
                            Link:
                            <p
                              className="text-black cursor-pointer w-full"
                              onClick={() => { handleCopy(meet.id) }}
                            >
                              /publiccall/{meet.id}
                            </p>
                            {copiedLinks[meet.id] && <span className="text-green-500 text-sm">Link copiado!</span>}


                          </span>

                        )}
                      </p>
                      <div className="flex space-x-2 pt-5">
                        <button className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditar(meet)}
                        >
                          <FaEdit size={20} />
                        </button>
                        <button className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeletar(meet.id)}
                        >
                          <FaTrash size={20} />
                          
                        </button>
                        <button className="text-green-600 hover:text-green-400"
                          onClick={() => { copiarLinkParaWhatsApp(meet.id, meet.data, meet.hora) }}
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

    //envio para produção

  );
}
