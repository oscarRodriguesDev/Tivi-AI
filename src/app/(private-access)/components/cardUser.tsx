"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import userDefault from '../../../../public/profile_pictures_ps/userdefault.png';
import { showErrorMessage } from "../../util/messages";
import { useAutoLogout } from "@/app/hooks/useAutoLogout";

const CardUser = () => {
  const { data: session, status } = useSession();
  const [cardOpen, setCardOpen] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [id, setId] = useState<string | null>('');

  const userId = session?.user?.id;
  const urlPerfil = `/user-profile/${id}`;

  useEffect(() => {
    if (!userId) return;

    const cacheKey = `fotoPerfil_${userId}`;
    const cachedFoto = localStorage.getItem(cacheKey);

    if (cachedFoto) {
      setFotoPerfil(cachedFoto);
      return;
    }

    const fetchFotoPerfil = async () => {
      try {
        const response = await fetch(`/api/uploads/profile/?userId=${userId}`);
        const data = await response.json();

        if (data?.url) {
          localStorage.setItem(cacheKey, data.url);
          setFotoPerfil(data.url);
        }
      } catch (error) {
        showErrorMessage(`Erro ao buscar dados do usuário: ${error}`);
      }
    };

    fetchFotoPerfil();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      setId(userId);
    }
  }, [userId]);

  const handleLogout = async () => {
    if (userId) {
      localStorage.removeItem(`fotoPerfil_${userId}`);
    }
    await signOut({ callbackUrl: "/login" });
  };

 /*  useAutoLogout(15*60*1000);// 15 minutos de inatividade */

  return (
    <div
      className="absolute top-[4.5%] left-[100%] sm:left-[200%] md:left-[300%] lg:left-[680%] 
      w-[90%] text-black z-50 rounded-sm cursor-pointer bg-white hover:bg-gray-100 transition-colors
      duration-200 shadow-md"
      onClick={() => setCardOpen(!cardOpen)}
    >
      {status === "authenticated" ? (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
            <Image
              src={fotoPerfil || userDefault}
              alt="Foto de perfil"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-sm text-black truncate">
            {session.user?.name}
          </span>
        </div>
      ) : (
        <div>Usuário não autenticado</div>
      )}

      {cardOpen && (
        <div className="absolute top-10 w-[220px] left-0 bg-white shadow-md rounded-md p-2">
          <Link
            href={urlPerfil}
            className="block text-black hover:text-red-400 px-0 py-2 rounded-md transition duration-300 ease-in-out"
          >
            Meu perfil
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left text-black hover:text-red-400 px-0 py-2 rounded-md transition duration-300 ease-in-out"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default CardUser;
