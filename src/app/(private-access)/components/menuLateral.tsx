'use client'
import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { LuLibraryBig } from "react-icons/lu";
import { BsCreditCard2BackFill } from "react-icons/bs";
import { PiUserCheckFill } from "react-icons/pi";
import { FaSadTear } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { BsCalendarCheckFill } from "react-icons/bs";
import { FaHourglassHalf } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Logomarca from '../../../../public/marca/marca-tiviai.png'
import Image from "next/image";
import CardUser from "./cardUser";
import { useSession } from "next-auth/react";

// Tipagem do MenuItemProps
type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void; // A função onClick que será chamada no clique
};

const Menu: React.FC = () => {

  const router = useRouter()
  const { data: session, status } = useSession(); // Obtém os dados da sessão

  const id = session?.user.id
  const role = session?.user?.role
  return (
    <div className="absolute w-[244px] min-h-screen bg-white shadow-lg flex flex-col p-5 border-r border-gray-200">


      {/* Logomarca */}
      <div className="w-auto h-[40px] flex items-start justify-start mb-4">
        <Image
          src={Logomarca}
          alt="Logomarca TiviAi"
          className="max-w-[120px] max-h-[40px] object-contain"
        />
      </div>

      {/* Usuário */}
      <div className="mb-6">
        <CardUser />
      </div>

      {/* Itens do menu */}
      <nav className="flex-1 space-y-2">
        {role === 'PSYCHOLOGIST' ? (
          <>
            <MenuItem icon={<MdSpaceDashboard size={22} />} label="Dashboard" onClick={() => router.push(`/dashboard/${id}`)} />
            <MenuItem icon={<LuCalendarDays size={22} />} label="Agendamentos" onClick={() => router.push(`/dating/${id}`)} />
            <MenuItem icon={<BsCalendarCheckFill size={22} />} label="Histórico" onClick={() => router.push(`/historico/${id}`)} />
            <MenuItem icon={<FaSadTear size={22} />} label="Meus Pacientes" onClick={() => router.push(`/meus-pacientes/${id}`)} />
            <MenuItem icon={<LuLibraryBig size={22} />} label="Base Científica" onClick={() => router.push(`/cientific/${id}`)} />
            <MenuItem icon={<BsCreditCard2BackFill size={22} />} label="Créditos" onClick={() => router.push(`/credit/${id}`)} />
            <MenuItem icon={<FaHourglassHalf size={22} />} label="Link Temporário" onClick={() => router.push(`/temp-link/${id}`)} />
          </>
        ) : (
          <>
            <MenuItem icon={<MdSpaceDashboard size={22} />} label="Dashboard" onClick={() => router.push(`/dashboard/${id}`)} />
            <MenuItem icon={<PiUserCheckFill size={22} />} label="Novos Psicólogos" onClick={() => router.push('/aprove-psc')} />
            <MenuItem icon={<GrUserAdmin size={22} />} label="Novo Administrador" onClick={() => router.push('/novo_admin')} />
          </>
        )}
      </nav>

      {/* Rodapé opcional */}
      <div className="mt-auto text-xs text-gray-400 text-center pt-4 border-t border-gray-100">
        © 2025 TiviAi
      </div>
    </div>

  );
};



// Componente MenuItem agora recebe e utiliza o onClick
const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => {
  return (
    <>
      <div
        className="
      flex items-center mt-auto mb-auto py-3 px-4 space-x-3
      border-b border-gray-300
      rounded-md
      text-gray-700
      hover:text-cyan-700 hover:bg-cyan-100
      active:scale-95 active:bg-cyan-200
      transition
      duration-200
      cursor-pointer
      select-none
      focus:outline-none focus:ring-2 focus:ring-cyan-400
    "
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        }}
      >
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>
    </>

  );
};

export default Menu;
//subindo alterações