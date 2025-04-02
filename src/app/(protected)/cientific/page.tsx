'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { useRouter } from "next/navigation"; // Para redirecionamento
import { FaCalendarAlt } from "react-icons/fa";
import { GiMaterialsScience } from "react-icons/gi";
import HeadPage from "../components/headPage";


const BaseCientifica = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
  const router = useRouter();

  return (
    <>
      <HeadPage
        title="Base Científica"
        icon={<GiMaterialsScience size={20} />}
      />

      {role === 'PSYCHOLOGIST' ? (
        <div>BAse cientifica</div>
      ) : (
        <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
      )}
    </>

  )

}
export default BaseCientifica;