'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { useRouter } from "next/navigation"; // Para redirecionamento
import { FaCalendarAlt } from "react-icons/fa";


const BaseCientifica = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
  const router = useRouter();




return(
    <>
<div className=" relative w-full max-w-screen-xl h-auto bg-white p-5">
        {/* Header */}
        <div className="w-full h-16 bg-[#F9FAFC] border border-[#D9D9D9] rounded-lg flex items-center px-6 mb-8">
          <FaCalendarAlt className="text-black text-2xl mr-4" />
          <h1 className="text-black font-extrabold text-2xl">Base Cientifica</h1>
        </div>
      </div>

    {role === 'PSYCHOLOGIST' ? (
      <div>BAse cientifica</div>
    ) : (
      <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
    )}
  </>
  
)
 
}
export default BaseCientifica;