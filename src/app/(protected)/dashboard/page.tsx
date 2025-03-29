
'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { FaCalendarAlt } from "react-icons/fa";

const Dashboard = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
  return (
    <>
      <div className=" relative w-full max-w-screen-xl h-auto bg-white p-5">
        {/* Header */}
        <div className="w-full h-16 bg-[#F9FAFC] border border-[#D9D9D9] rounded-lg flex items-center px-6 mb-8">
          <FaCalendarAlt className="text-black text-2xl mr-4" />
          <h1 className="text-black font-extrabold text-2xl">DashBoard</h1>
        </div>
      </div>
      {role === 'PSYCHOLOGIST' ? (
        <div className="flex justify-center items-center h-screen">
          Pagina dashboard para psicólogos
        </div>
      ) : role === 'ADMIN' ? (
        <div className="flex justify-center items-center h-screen">
          Pagina dashboard para Admins
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          Acesso não autorizado
        </div>
      )}
    </>


  )

}
export default Dashboard;