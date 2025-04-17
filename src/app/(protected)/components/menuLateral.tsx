'use client'
import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineSick } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { RiCustomerServiceFill } from "react-icons/ri";
import { LuLibraryBig } from "react-icons/lu";
import { IoBarChart } from "react-icons/io5";
import { BsCreditCard2BackFill } from "react-icons/bs";
import { PiUserCheckFill } from "react-icons/pi";
import { useRouter } from "next/navigation";
import Logomarca from '../../../../public/marca/marca tiviai.png'
import Image from "next/image";
import CardUser from "./cardUser";

// Tipagem do MenuItemProps
type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void; // A função onClick que será chamada no clique
};

const Menu: React.FC = () => {

  const router = useRouter()
  return (



    <div className="absolute w-[244px] h-auto bg-white p-5">
       <CardUser/> 

      {/* logomarca */}
      <div className="w-[187px] h-[78px] bg-white  mb-5">
        <Image src={Logomarca} alt="logomarca tiviai" className="w-full h-full object-contain" />
       
      </div>

      {/* Itens do menu */}
      <nav className="space-y-5"> 
        <MenuItem icon={<MdSpaceDashboard size={25} />} label="Dashboard" onClick={() => router.push('/dashboard')} />
        <MenuItem icon={<RiCustomerServiceFill size={25} />} label="Cadastro de Paciente" onClick={() => router.push('/pacientes/123')} />{/* vai pegar o id do psicolog */}
        <MenuItem icon={<LuCalendarDays size={25} />} label="Agendamentos" onClick={() => router.push('/dating')} />
        <MenuItem icon={<MdOutlineSick size={25} />} label="Pacientes" onClick={() => router.push('/atendimentos')} />
        <MenuItem icon={<LuLibraryBig size={25} />} label="Base Científica" onClick={() => router.push('/cientific')} />
        <MenuItem icon={<IoBarChart size={25} />} label="Financeiro" onClick={() => router.push('/finance')} />
        <MenuItem icon={<BsCreditCard2BackFill size={25} />} label="Créditos" onClick={() => router.push('/credit')} />
        <MenuItem icon={<PiUserCheckFill size={25} />} label="Novos psicologos" onClick={() => router.push('/aprove-psc')} />
        <MenuItem icon={<PiUserCheckFill size={25} />} label="Novo Administrador" onClick={() => router.push('/novo_admin')} />
    
      </nav>
    </div>
  );
};



// Componente MenuItem agora recebe e utiliza o onClick
const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => {
  return (
    <>
    
    <div
      className="flex items-center space-x-3 hover:bg-gray-100 active:scale-95 active:bg-gray-200 transition-transform duration-300 rounded-lg cursor-pointer"
      onClick={onClick} // Utilizando o onClick passado como prop
    >
      {icon}
      <span className="text-black text-sm font-medium">{label}</span>
    </div>
    
    </>
  );
};

export default Menu;
