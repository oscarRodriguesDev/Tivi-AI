"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
import { useSession, signOut } from "next-auth/react"; // Importe o hook useSession e signOut





const CardUser = () => {
  const [agendamentoOpen, setAgendamentoOpen] = useState(false);
  const [transcricoesOpen, setTranscricoesOpen] = useState(false);
  const [id,setId]=useState<string|null>('')
  


  const { data: session, status } = useSession(); // Obtém os dados da sessão

  useEffect(() => {
    if (session?.user?.id) {
      setId(session?.user?.id);
    
    }
  }, [session]); // Atualiza o ID sempre que a sessão mudar

const urlPerfil= `/user-profile/${id}`


  // Função de Logout usando o signOut do NextAuth
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // Redireciona para /login após sair
  };

  return (
    <>
      <div className="w-auto ml-ml-perc-6 text-black">
        {/* Meu Perfil Link, devo criar a forma de pegar o id do usuario para que ele possa visualizer o perfil dele*/}
        <Link href= {urlPerfil} className="hover:bg-gray-600 px-4 py-2 rounded-md transition duration-300 ease-in-out">
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

      </div>



    </>
  );
};
export default CardUser;
