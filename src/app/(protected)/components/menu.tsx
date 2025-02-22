// components/Menu.tsx
import Link from 'next/link';
import { useState } from 'react';

const Menu = () => {
  const [agendamentoOpen, setAgendamentoOpen] = useState(false);
  const [transcricoesOpen, setTranscricoesOpen] = useState(false);

  // Função de Logout (exemplo simples)
  const handleLogout = () => {
    // Limpar a sessão ou token, se necessário
    // Por exemplo, com cookies ou localStorage:
    localStorage.removeItem('authToken'); // Exemplo
    // Redirecionar para a página de login ou home
    window.location.href = '/login'; // ou '/';
  };

  return (
    <div className="w-full bg-gray-800 text-white">
      <nav className="flex justify-center space-x-4 py-4">
        
        {/* Agendamento Dropdown */}
        <div className="relative">
          <button
            onClick={() => setAgendamentoOpen(!agendamentoOpen)}
            className="px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Agendamento
          </button>
          {agendamentoOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-gray-700 text-white rounded-md shadow-lg">
              <Link href="/agendamento/novo" className="block px-4 py-2 hover:bg-gray-600">
                Novo Agendamento
              </Link>
              <Link href="/agendamento/lista" className="block px-4 py-2 hover:bg-gray-600">
                Lista de Agendamentos
              </Link>
            </div>
          )}
        </div>

        {/* Transcrições Dropdown */}
        <div className="relative">
          <button
            onClick={() => setTranscricoesOpen(!transcricoesOpen)}
            className="px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Transcrições
          </button>
          {transcricoesOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-gray-700 text-white rounded-md shadow-lg">
              <Link href="/transcricoes/pendentes" className="block px-4 py-2 hover:bg-gray-600">
                Pendentes
              </Link>
              <Link href="/transcricoes/arquivadas" className="block px-4 py-2 hover:bg-gray-600">
                Arquivadas
              </Link>
            </div>
          )}
        </div>

        {/* Reunião */}
        <Link href="/reuniao" className="hover:bg-gray-600 px-4 py-2 rounded-md">
          Reunião
        </Link>

        {/* Meu Perfil */}
        <Link href="/perfil" className="hover:bg-gray-600 px-4 py-2 rounded-md">
          Meu Perfil
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="hover:bg-gray-600 px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Menu;
