import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineSick } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { RiCustomerServiceFill } from "react-icons/ri";
import { LuLibraryBig } from "react-icons/lu";
import { IoBarChart } from "react-icons/io5";
import { BsCreditCard2BackFill } from "react-icons/bs";







type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
};

const Menu: React.FC = () => {
  return (
    <div className="absolute w-[244px] h-[1076px] bg-white p-5">
      {/* Logo ou Header */}
      <div className="w-[187px] h-[78px] bg-gray-800 mb-5"></div>
      
      {/* Itens do menu */}
      <nav className="space-y-5">
        <MenuItem icon={<MdSpaceDashboard size={25}/>} label="Dashboard" />
        <MenuItem icon={<MdOutlineSick size={25}/>} label="Pacientes" />
        <MenuItem icon={<LuCalendarDays size={25}/>} label="Agendamentos" />
        <MenuItem icon={<RiCustomerServiceFill size={25}/>} label="Atendimentos" />
        <MenuItem icon={<LuLibraryBig size={25}/>} label="Base Científica" />
        <MenuItem icon={<IoBarChart size={25}/>} label="Financeiro" />
        <MenuItem icon={<BsCreditCard2BackFill size={25}/>} label="Créditos" />
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-black text-sm font-medium">{label}</span>
    </div>
  );
};

export default Menu;
