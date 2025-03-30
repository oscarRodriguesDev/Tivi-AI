'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { useRouter } from "next/navigation"; // Para redirecionamento
import { FaRegCreditCard  } from "react-icons/fa";
import HeadPage from "../components/headPage";


const Creditos = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
  const router = useRouter();

  return (
    <>

   <HeadPage title='Creditos' icon={<FaRegCreditCard  size={20}/>}/>
      {role === 'PSYCHOLOGIST' ? (
        <div>pagina de Creditos</div>
      ) : (
        <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
      )}
    </>

  )

}
export default Creditos;