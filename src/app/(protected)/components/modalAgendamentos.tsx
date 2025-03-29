import React, { useState, FormEvent, ChangeEvent } from "react";
import { FaCalendar, FaCalendarAlt, FaClock, FaPhoneAlt, FaPen, FaUserFriends } from "react-icons/fa";
import { MdNotes } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

interface Agendamento {
  id: string;
  psicologoId: string;
  fantasy_name: string;
  name: string;
  data: string;
  hora: string;
  tipo_consulta: string;
  observacao: string;
  recorrencia: string;
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [novoAgendamento, setNovoAgendamento] = useState<Agendamento>({
    id: '',
    psicologoId: '',
    fantasy_name: '',
    name: '',
    data: '',
    hora: '',
    tipo_consulta: '',
    observacao: '',
    recorrencia: ''
  });

 

  // Função para atualizar o estado do Agendamento conforme os inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovoAgendamento((prev) => ({ ...prev, [name]: value }));
  };

  // Função para enviar os dados do agendamento para a API
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verifica se todos os campos obrigatórios estão preenchidos
    if ( novoAgendamento.data && novoAgendamento.hora && novoAgendamento.name && novoAgendamento.fantasy_name) {
      const novo: Agendamento = { ...novoAgendamento, id: uuidv4() };

      try {
        // Fazendo a requisição para a API (ajuste a URL da sua API)
        const response = await fetch("/api/gen-meet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novo), // Envia os dados como JSON
        });

        if (response.ok) {
          alert("Agendamento salvo com sucesso!");
          setNovoAgendamento({
            id: '',
            psicologoId: '',
            fantasy_name: '',
            name: '',
            data: '',
            hora: '',
            tipo_consulta: '',
            observacao: '',
            recorrencia: ''
          });
          onClose(); // Fecha o modal após salvar
        } else {
          alert("Erro ao salvar o agendamento. Tente novamente.");
        }
      } catch (error) {
        alert("Erro de conexão. Tente novamente.");
      }
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg w-[787px] h-[852px] p-6">
        {/* Header */}
        <div className="flex items-center justify-start gap-3 mb-5">
          <FaCalendar size={40} />
          <h2 className="font-bold text-2xl text-black">Novo Agendamento</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
          

            {/* Apelido para o paciente: vira do banco de dados, da escolha do paciente */} 
            <div className="flex-col justify-between gap-4">
              <label className="block text-sm font-medium text-gray-800">Precisamos de um nick name para seu paciente</label>
              <div className="flex items-center gap-3">
                <FaPen size={20} className="text-gray-600" />
                <input
                  type="text"
                  name="fantasy_name"
                  value={novoAgendamento.fantasy_name}
                  onChange={handleChange}
                  placeholder="Digite o apelido do seu paciente"
                  className="border border-gray-300 text-black rounded-md px-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Nome do Paciente vai ser um select dos valores do banco de dados*/}
            <div className="flex-col justify-between gap-4">
              <label className="block text-sm font-medium text-gray-800">Nome real do Paciente</label>
              <div className="flex items-center gap-3">
                <FaUserFriends size={20} className="text-gray-600" />
                <input 
                  type='text'
                  name="name"
                  value={novoAgendamento.name}
                  onChange={handleChange}
                  className="border text-black border-gray-300 rounded-md px-4 py-2 w-full"
                />
                 
              </div>
            </div>

            {/* Data da Reunião */}
            <div className="flex-col justify-between gap-4">
              <label className="block text-sm font-medium text-gray-800">Data da Reunião</label>
              <div className="flex items-center gap-3">
                <FaCalendarAlt size={20} className="text-gray-600" />
                <input
                  type="date"
                  name="data"
                  value={novoAgendamento.data}
                  onChange={handleChange}
                  className="border border-gray-300 text-black rounded-md px-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Hora da Reunião */}
            <div className="flex-col justify-between gap-4">
              <label className="block text-sm font-medium text-gray-800">Hora da Reunião</label>
              <div className="flex items-center gap-3">
                <FaClock size={20} className="text-gray-600" />
                <input
                  type="time"
                  name="hora"
                  value={novoAgendamento.hora}
                  onChange={handleChange}
                  className="border border-gray-300 text-black rounded-md px-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Tipo de Consulta */}
            <div className="flex-col justify-between gap-4">
              <label className="block text-sm font-medium text-gray-800">Tipo de Consulta</label>
              <div className="flex items-center gap-3">
                <FaPhoneAlt size={20} className="text-gray-600" />
                <select
                  name="tipo_consulta"
                  value={novoAgendamento.tipo_consulta}
                  onChange={handleChange}
                  className="border text-black border-gray-300 rounded-md px-4 py-2 w-full"
                >
                  <option value="">Selecione o tipo de consulta</option>
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                </select>
              </div>
            </div>

            {/* Recorrência */}
            <div className="flex-col justify-between gap-4">
              <label className="block text-sm font-medium text-gray-800">Recorrência</label>
              <div className="flex items-center gap-3">
                <FaCalendarAlt size={20} className="text-gray-600" />
                <select
                  name="recorrencia"
                  value={novoAgendamento.recorrencia}
                  onChange={handleChange}
                  className="border text-black border-gray-300 rounded-md px-4 py-2 w-full"
                >
                  <option value="">Selecione a recorrência</option>
                  <option value="diaria">Diária</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            </div>

            {/* Observações */}
            <div className="flex-col justify-between gap-4">
              <label className="block text-sm font-medium text-gray-800">Observações</label>
              <div className="flex items-center gap-3">
                <MdNotes size={20} className="text-gray-600" />
                <textarea
                  name="observacao"
                  value={novoAgendamento.observacao}
                  onChange={handleChange}
                  placeholder="Digite as observações"
                  className="border border-gray-300 text-black rounded-md px-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="mt-6 flex justify-end gap-4">
              <button type="button" onClick={onClose} className="text-gray-500">Cancelar</button>
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">Salvar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
