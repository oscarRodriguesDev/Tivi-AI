'use client'
import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { RiCustomerServiceFill } from "react-icons/ri";
import { LuLibraryBig } from "react-icons/lu";
import { IoBarChart } from "react-icons/io5";
import { BsCreditCard2BackFill } from "react-icons/bs";
import { PiUserCheckFill } from "react-icons/pi";
import { FaSadTear } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { BsCalendarCheckFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import Logomarca from '../../../public/marca/marca tiviai.png'
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

  const id =  session?.user.id
  return (
    <div className="absolute w-[244px] h-auto bg-white p-5">
       <CardUser/> 

      {/* logomarca */}
      <div className="w-[187px] h-[78px] bg-white  mb-5">
        <Image src={Logomarca} alt="logomarca tiviai" className="w-full h-full object-contain" />
       
      </div>

      {/* Itens do menu */}
      <nav className="space-y-5 border-r-[1px] border-gray-400"> 
        <MenuItem  icon={<MdSpaceDashboard size={25} />} label="Dashboard" onClick={() => router.push(`/dashboard/${id}`)} />
        <MenuItem icon={<RiCustomerServiceFill size={25} />} label="Cadastro de Paciente" onClick={() => router.push(`/cadastro-pacientes/${id}`)} />{/* vai pegar o id do psicolog */}
        <MenuItem icon={<LuCalendarDays size={25} />} label="Agendamentos" onClick={() => router.push(`/dating/${id}`)} />
        <MenuItem icon={<BsCalendarCheckFill size={25} />} label="Meus atendimentos" onClick={() => router.push(`/atendimentos/${id}`)} />
        <MenuItem icon={<FaSadTear size={25} />} label="Meus Pacientes" onClick={() => router.push(`/meus-pacientes/${id}`)} />
        <MenuItem icon={<LuLibraryBig size={25} />} label="Base Científica" onClick={() => router.push(`/cientific/${id}`)} />
        <MenuItem icon={<IoBarChart size={25} />} label="Financeiro" onClick={() => router.push(`/finance/${id}`)} />
        <MenuItem icon={<BsCreditCard2BackFill size={25} />} label="Créditos" onClick={() => router.push(`/credit/${id}`)} />
        <MenuItem icon={<PiUserCheckFill size={25} />} label="Novos psicologos" onClick={() => router.push('/aprove-psc')} />
        <MenuItem icon={<GrUserAdmin size={25} />} label="Novo Administrador" onClick={() => router.push('/novo_admin')} />
    
      </nav>

      
    </div>
  );
};



// Componente MenuItem agora recebe e utiliza o onClick
const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => {
  return (
    <>
    
    <div
      className="flex mt-auto mb-auto py-3 space-x-3 border-b-[1px]  border-gray-400 hover:text-cyan-900 active:scale-95 active:bg-gray-200 transition-transform duration-300 rounded-xs cursor-pointer"
      onClick={onClick} // Utilizando o onClick passado como prop
    >
      {icon}
    <span className="text-black text-sm font-medium hover:text-cyan-900 transition-colors duration-300">{label}</span>
    </div>
    
    </>
  );
};

export default Menu;
//subindo alterações