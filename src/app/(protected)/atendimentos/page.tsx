
'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { FaCalendarAlt } from "react-icons/fa";



const MeusAtendimentos = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto



  return (
    <>
      <div className=" relative w-full max-w-screen-xl h-auto bg-white p-5">
        {/* Header */}
        <div className="w-full h-16 bg-[#F9FAFC] border border-[#D9D9D9] rounded-lg flex items-center px-6 mb-8">
          <FaCalendarAlt className="text-black text-2xl mr-4" />
          <h1 className="text-black font-extrabold text-2xl">Meus Atendimentos</h1>
        </div>
      </div>

      {role === 'PSYCHOLOGIST' ? (
        <div>Meus Atendimentos</div>
      ) : (
        <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
      )}
    </>

  )

}
export default MeusAtendimentos;
