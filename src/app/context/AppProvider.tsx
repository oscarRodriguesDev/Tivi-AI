'use client';

import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { MdMenu, MdClose, MdSpaceDashboard } from 'react-icons/md';
import { LuCalendarDays, LuLibraryBig } from 'react-icons/lu';
import { BsCreditCard2BackFill, BsCalendarCheckFill } from 'react-icons/bs';
import { PiUserCheckFill } from 'react-icons/pi';
import { FaSadTear } from 'react-icons/fa';
import { GrUserAdmin } from 'react-icons/gr';
import { FaHourglassHalf } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CardUser from '../(private-access)/components/cardUser';
import { useSession } from 'next-auth/react';

type AppProviderProps = {
  children: React.ReactNode;
};

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const router = useRouter();


  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);



  const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => (
    <div
      className="
        flex items-center py-3 px-4 space-x-3
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
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );

  return (

     <main
      className="
        bg-gray-100 
       flex-1 ml-[250px] 
       mt-[10px]
       h-auto
       min-h-[calc(100vh-3px)]
        "
    >
      {children}
    </main>
  
  );
};

export default AppProvider;
