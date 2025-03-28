import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { FaCalendar, FaCalendarAlt, FaClock, FaPhoneAlt, FaPen,FaUserFriends  } from "react-icons/fa";
import { MdNotes } from "react-icons/md";

interface Agendamento {
    id: string;
    nome: string;
    horario: string;
    descricao: string;
}


type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [novoAgendamento, setNovoAgendamento] = useState<Agendamento>({
        id: '',
        nome: '',
        descricao: '',
        horario: ''
    });


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (novoAgendamento.nome && novoAgendamento.horario) {
            const novo: Agendamento = { ...novoAgendamento, id: uuidv4() };
            setAgendamentos([...agendamentos, novo]);
            setNovoAgendamento({ nome: '', descricao: '', horario: '', id: '' });
            alert(agendamentos)
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
                        <div className="space-y-6">
                            {/* Título da Reunião */}
                            <div className="flex-col justify-between gap-4">
                                <label className="block text-sm font-medium text-gray-800">Título da Reunião</label>
                                <div className="flex items-center gap-3">
                                    <FaPen size={20} className="text-gray-600" />
                                    <input
                                        type="text"
                                        placeholder="Digite o título"
                                        className="border border-gray-300 text-black rounded-md px-4 py-2 w-full"
                                    />
                                </div>
                            </div>

                            {/* Nome do Paciente */}
                            <div className="flex-col justify-between gap-4">
                                <label className="block text-sm font-medium text-gray-800">Nome do Paciente</label>
                                <div className="flex items-center gap-3">
                                    <FaUserFriends size={20} className="text-gray-600" />
                                    <select
                                        className="border text-black border-gray-300 rounded-md px-4 py-2 w-full"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Selecione o nome do paciente</option>
                                        {/* Exemplo de lista de pacientes - substituir com dados reais */}
                                        <option value="paciente1">João da Silva</option>
                                        <option value="paciente2">Maria Oliveira</option>
                                        <option value="paciente3">Carlos Pereira</option>
                                        {/* Aqui você pode mapear os pacientes do psicólogo */}
                                    </select>
                                </div>
                            </div>


                            {/* Data da Reunião */}
                            <div className="flex-col justify-between gap-4">
                                <label className="block text-sm font-medium text-gray-800">Data da Reunião</label>
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt size={20} className="text-gray-600" />
                                    <input
                                        type="date"
                                        className="border border-gray-300 text-black rounded-md px-4 py-2 w-full"
                                    />
                                </div>
                            </div>


                            {/* Recorrência */}
                            <div className="flex-col justify-between gap-4">
                                <label className="block text-sm font-medium text-gray-800">Recorrência</label>
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt size={20} className="text-gray-600" />
                                    <select className="border text-black border-gray-300 rounded-md px-4 py-2 w-full">
                                        <option value="">Selecione a recorrência</option>
                                        <option value="diaria">Diária</option>
                                        <option value="semanal">Semanal</option>
                                        <option value="mensal">Mensal</option>
                                        <option value="anual">Anual</option>
                                    </select>
                                </div>
                            </div>

                            {/* Hora da Reunião */}
                            <div className="flex-col justify-between gap-4">
                                <label className="block text-sm font-medium text-gray-800">Hora da Reunião</label>
                                <div className="flex items-center gap-3">
                                    <FaClock size={20} className="text-gray-600" />
                                    <input
                                        type="time"
                                        className="border text-black border-gray-300 rounded-md px-4 py-2 w-full"
                                    />
                                </div>
                            </div>

                            {/* Tipo de Reunião (presencial/online) */}
                            <div className="flex-col justify-between gap-4">
                                <label className="block text-sm font-medium text-gray-800">Tipo de Reunião</label>
                                <div className="flex items-center gap-3">
                                    <FaPhoneAlt size={20} className="text-gray-600" />
                                    <select className="border border-gray-300  text-black rounded-md px-4 py-2 w-full">
                                        <option value="">Selecione o tipo de reunião</option>
                                        <option value="presencial">Presencial</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                            </div>

                            {/* Observações */}
                            <div className="flex-col justify-between gap-4">
                                <label className="block text-sm font-medium text-gray-800">Observações</label>
                                <div className="flex items-center gap-3">
                                    <MdNotes  size={20} className="text-gray-600" />
                                    <textarea
                                        placeholder="Digite as observações"
                                        className="border border-gray-300  text-black rounded-md px-4 py-2 w-full"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex justify-between gap-4">
                            <button
                                onClick={onSave}
                                className="bg-blue-500 text-white px-6 py-2 rounded-md"
                            >
                                Salvar
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-green-500 text-white px-6 py-2 rounded-md"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default Modal;
