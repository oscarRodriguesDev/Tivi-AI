
'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { FaCalendarAlt, FaList } from "react-icons/fa";
import HeadPage from "../components/headPage";



const MeusAtendimentos = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto



  return (
    <>
      <HeadPage 
      title="Atendimentos"
      icon={<FaList size={20}/>}
      />

      {role === 'PSYCHOLOGIST' ? (
        <div>Meus Atendimentos</div>
      ) : (
        <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
      )}
    </>

  )

}
export default MeusAtendimentos;
