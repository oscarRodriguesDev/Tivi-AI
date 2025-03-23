'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { useRouter } from "next/navigation"; // Para redirecionamento


const BaseCientifica = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
  const router = useRouter();




return(
    <>
    {role === 'PSYCHOLOGIST' ? (
      <div>BAse cientifica</div>
    ) : (
      <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
    )}
  </>
  
)
 
}
export default BaseCientifica;