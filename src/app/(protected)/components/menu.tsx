"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react"; // Importe o hook useSession e signOut




const Menu = () => {
  const [agendamentoOpen, setAgendamentoOpen] = useState(false);
  const [transcricoesOpen, setTranscricoesOpen] = useState(false);

  const { data: session, status } = useSession(); // Obtém os dados da sessão



  // Função de Logout usando o signOut do NextAuth
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // Redireciona para /login após sair
  };

  return (
    <>

<div className="w-full bg-gray-800 bg-opacity-60 text-white shadow-md backdrop-blur-lg">
  <nav className="flex justify-end items-center py-4 px-8 space-x-2">

    {/* Logo ou Nome */}
    <div className="text-2xl font-bold mr-10">
      <Link href="/">Logo</Link>
    </div>

    {/* Agendamento Dropdown */}
    <div className="relative group">
      <button
        onClick={() => setAgendamentoOpen(!agendamentoOpen)}
        className="px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-gray-600 focus:outline-none"
      >
        Agendamento
      </button>
      {agendamentoOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-gray-700 text-white rounded-md shadow-lg transition duration-300 ease-in-out transform group-hover:scale-100 scale-95 opacity-0 group-hover:opacity-100">
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
    <div className="relative group">
      <button
        onClick={() => setTranscricoesOpen(!transcricoesOpen)}
        className="px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-gray-600 focus:outline-none"
      >
        Transcrições
      </button>
      {transcricoesOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-gray-700 text-white rounded-md shadow-lg transition duration-300 ease-in-out transform group-hover:scale-100 scale-95 opacity-0 group-hover:opacity-100">
          <Link href="/transcricoes/pendentes" className="block px-4 py-2 hover:bg-gray-600">
            Pendentes
          </Link>
          <Link href="/transcricoes/arquivadas" className="block px-4 py-2 hover:bg-gray-600">
            Arquivadas
          </Link>
        </div>
      )}
    </div>

    {/* Reunião Link */}
    <Link href="/reuniao" className="hover:bg-gray-600 px-4 py-2 rounded-md transition duration-300 ease-in-out">
      Reunião
    </Link>

    {/* Meu Perfil Link */}
    <Link href="/perfil" className="hover:bg-gray-600 px-4 py-2 rounded-md transition duration-300 ease-in-out">
      Meu Perfil
    </Link>

    {/* Status de Usuário */}
    {status === "authenticated" ? (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-300">
          Olá {session.user?.role} {session.user?.name}
        </span>
        <button
          onClick={handleLogout}
          className="hover:bg-gray-600 px-4 py-2 rounded-md transition duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>
    ) : (
      <Link href="/login" className="hover:bg-gray-600 px-4 py-2 rounded-md transition duration-300 ease-in-out">
        Login
      </Link>
    )}
  </nav>
</div>



    </>
  );
};
export default Menu;
