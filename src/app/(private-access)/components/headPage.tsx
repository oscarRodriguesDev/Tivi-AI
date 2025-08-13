// components/PageHeader.tsx
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  icon: ReactNode; // Permite passar qualquer ícone
}

const HeadPage: React.FC<PageHeaderProps> = ({ title, icon }) => {
  return (
   <div className="relative w-full bg-white p-5">
  {/* Header */}
  <div className="w-full min-h-16 bg-[#F9FAFC] border border-[#D9D9D9] rounded-lg flex flex-wrap items-center px-6 mb-8 gap-4">
    <div className="flex-shrink-0">{icon}</div> {/* Ícone */}
    <h1 className="text-black font-extrabold text-2xl flex-1 min-w-[200px] sm:min-w-[250px]">
      {title}
    </h1>
    {/* Espaço para outros elementos no futuro */}
    {/* <div className='flex-1 flex justify-end'><CardUser/></div> */}
  </div>
</div>

  );
};

export default HeadPage;

