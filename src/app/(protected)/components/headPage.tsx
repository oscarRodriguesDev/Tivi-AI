// components/PageHeader.tsx
import { ReactNode } from 'react';
import CardUser from './cardUser';

interface PageHeaderProps {
  title: string;
  icon: ReactNode; // Permite passar qualquer ícone
}

const HeadPage: React.FC<PageHeaderProps> = ({ title, icon }) => {
  return (
    <div className="relative w-full bg-white p-5">
      {/* Header */}
      <div className="w-full h-16 bg-[#F9FAFC] border border-[#D9D9D9] rounded-lg flex items-center px-6 mb-8">
        <div className="mr-4">{icon}</div> {/* Exibe o ícone passado */}
        <h1 className="text-black font-extrabold text-2xl">{title}</h1>
        <div className='w-full  flex-row items-center justify-end'><CardUser/></div>
      </div>
    </div>
  );
};

export default HeadPage;

