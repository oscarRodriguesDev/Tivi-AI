'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';

interface Agendamento {
  id: string;
  nome: string;
  horario: string;
  descricao: string;
}

//definir as variaveis de url
export default function AgendamentoPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
    { id: uuidv4(), nome: 'João Silva', horario: '10:00', descricao: 'Sessão inicial' },
    { id: uuidv4(), nome: 'Maria Souza', horario: '14:00', descricao: 'Terapia semanal' },
  ]);
  const [novoAgendamento, setNovoAgendamento] = useState<Omit<Agendamento, 'id'>>({
    nome: '',
    descricao: '',
    horario: '',
  });
  const [peerIds, setPeerIds] = useState<{ [key: string]: string }>({}); // Armazena o peerId por agendamento
  const [idUser,setIdUser] =  useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);     // Para controle de loading
  const hoje = format(new Date(), 'dd/MM/yyyy');
  const [error, setError] = useState<string | null>(null);     // Para mostrar erros

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovoAgendamento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (novoAgendamento.nome && novoAgendamento.horario) {
      const novo: Agendamento = { ...novoAgendamento, id: uuidv4() };
      setAgendamentos([...agendamentos, novo]);
      setNovoAgendamento({ nome: '', descricao: '', horario: '' });
    }
  };

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
    <div className="flex min-h-screen p-8 bg-gray-900 text-white">
      {/* Lista de Agendamentos */}
      <div className="w-1/2 p-6 bg-gray-800 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Reuniões de Hoje - {hoje}</h2>
        <ul>
          {agendamentos.map((ag) => (
            <li key={ag.id} className="p-3 bg-gray-700 rounded-lg mb-3">
              <p className="text-lg font-bold">{ag.nome}</p>
              <p className="text-sm">Horário: {ag.horario}</p>
              <p className="text-sm">{ag.descricao}</p>
              <p className="text-sm text-blue-400">
                {loading ? (
                  <span>Carregando...</span>
                ) : peerIds[ag.id] ? (
                  <button
                    onClick={() => redirect(`/call/${idUser}`)}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded p-2"
                  >
                    Iniciar Reunião com {ag.nome}
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

      {/* Formulário de Agendamento */}
      <div className="w-1/2 p-6 bg-gray-800 ml-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Agendar Nova Reunião</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nome"
            value={novoAgendamento.nome}
            onChange={handleChange}
            placeholder="Nome do Paciente"
            className="p-3 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="time"
            name="horario"
            value={novoAgendamento.horario}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 text-white"
            required
          />
          <textarea
            name="descricao"
            value={novoAgendamento.descricao}
            onChange={handleChange}
            placeholder="Descrição da reunião"
            className="p-3 rounded bg-gray-700 text-white"
          ></textarea>
          <button type="submit" className="p-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold">
            Agendar
          </button>
        </form>
      </div>
    </div>
  );
}
