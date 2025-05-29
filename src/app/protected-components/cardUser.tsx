"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react"; // Importe o hook useSession e signOut
import Image from "next/image";
import userDefault from "../../../public/profile_pictures_ps/userdefault.png";


const CardUser = () => {

  const [id, setId] = useState<string | null>('')

  const { data: session, status } = useSession(); // Obtém os dados da sessão
  const [cardOpen, setCardOpen] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);



  useEffect(() => {
    const fetchFotoPerfil = async () => {
      try {
        const response = await fetch(`/api/uploads?userId=${session?.user?.id}`);
        const data = await response.json();
        setFotoPerfil(data.url);
        // Passa apenas a parte relativa para o estado
      } catch (error) {
        console.error("Erro ao buscar foto de perfil:", error);
      }
    };
    fetchFotoPerfil();
  }, [session?.user?.id]);

  

  useEffect(() => {
    if (session?.user?.id) {
      setId(session?.user?.id);

    }
  }, [session]); // Atualiza o ID sempre que a sessão mudar

  const urlPerfil = `/user-profile/${id}`


  // Função de Logout usando o signOut do NextAuth
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
   
  };

  return (
    <>
     <div
className="absolute top-[4.5%] left-[100%] sm:left-[200%] md:left-[300%] lg:left-[440%] 
w-[90%] text-black z-50 rounded-sm cursor-pointer bg-white hover:bg-gray-100 transition-colors
 duration-200 shadow-md"

  onClick={() => setCardOpen(!cardOpen)}
>
  {/* conteúdo aqui */}

        {status === "authenticated" ? (
          <div className="flex items-center space-x-3 "

          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image
                src={fotoPerfil || userDefault}
                alt="Foto de perfil"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-sm text-black truncate">{session.user?.name}</span>
          </div>
        ) : (
          <>
        <div>Usuario não autenticado</div>
          </>
        )}

        {cardOpen && (
          <div className="absolute top-10  w-[220px] left-[0%] bg-white shadow-md rounded-md p-2">

            <Link href={urlPerfil} className="text-black  hover:text-red-400 px-0 py-2 rounded-md transition duration-300 ease-in-out">

              Meu perfil
            </Link>

            <br />


            <button
              onClick={handleLogout}
              className=" text-black hover:text-red-400 px-0 py-2 rounded-md transition duration-300 ease-in-out"
            >
              Sair
            </button>
          </div>
        )}

      </div>



    </>
  );
};
export default CardUser;

