"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react"; // Importe o hook useSession e signOut





const CardUser = () => {
  const [agendamentoOpen, setAgendamentoOpen] = useState(false);
  const [transcricoesOpen, setTranscricoesOpen] = useState(false);
  const [id, setId] = useState<string | null>('')



  const { data: session, status } = useSession(); // Obtém os dados da sessão

  useEffect(() => {
    if (session?.user?.id) {
      setId(session?.user?.id);

    }
  }, [session]); // Atualiza o ID sempre que a sessão mudar

  const urlPerfil = `/user-profile/${id}`


  // Função de Logout usando o signOut do NextAuth
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" }); // Redireciona para /login após sair
  };

  return (
    <>
      <div className="relative px-2 w-[220px] left-[83%] bg-emerald-800 p-0  text-black z-50 rounded-sm ">
        {/* Meu Perfil Link, devo criar a forma de pegar o id do usuario para que ele possa visualizer o perfil dele*/}

        <Link href={urlPerfil} className="text-white text-xs hover:text-red-400 px-2 py-2 rounded-md transition duration-300 ease-in-out">
         Acessar Perfil
        </Link>

        {/* Status de Usuário */}
        {status === "authenticated" ? (
          <div className="flex items-center space-x-2">
            
            {session.user.role!=='ADMIN' ? ( /* se common user entrar no sistema tem que alterar isso */
            <span className="text-sm text-gray-300">
              Psicologo: {session.user?.name}
            </span>
            ):
            (
              <span className="text-sm text-gray-300">
              Admin: {session.user?.name}
            </span>
            )
            }

            <button
              onClick={handleLogout}
              className=" text-white hover:text-red-400 px-4 py-2 rounded-md transition duration-300 ease-in-out"
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
