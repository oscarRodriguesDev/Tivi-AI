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
        const response = await fetch(`/api/internal/uploads/profile/?userId=${userId}`);
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
<div className="relative">
  {/* Cabeçalho do card */}
  <div
    onClick={() => setCardOpen(!cardOpen)}
    className="flex items-center gap-3 cursor-pointer px-4 py-2 rounded-2xl shadow-md
    transition-all duration-300 bg-white border border-gray-200 hover:border-green-600"
   
  >
    {status === "authenticated" ? (
      <>
        <Image
          src={fotoPerfil || userDefault}
          alt="Foto de perfil"
          width={40}
          height={40}
          quality={100}
          className="rounded-full border border-green-600/30"
        />
        <span className="text-sm font-semibold text-gray-800 truncate max-w-[130px]">
          {session.user?.name}
        </span>
      </>
    ) : (
      <span className="text-sm text-gray-500">Usuário não autenticado</span>
    )}
  </div>

  {/* Dropdown do card */}
  {cardOpen && status === "authenticated" && (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fadeIn">
      <Link
        href={urlPerfil}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
      >
        Meu perfil
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
      >
        Sair
      </button>
    </div>
  )}
</div>



  );
};

export default CardUser;
