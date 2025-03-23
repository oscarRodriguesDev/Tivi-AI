'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { useRouter } from "next/navigation"; // Para redirecionamento


const Creditos = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
  const router = useRouter();




return(
    <>
    {role === 'PSYCHOLOGIST' ? (
      <div>pagina de Creditos</div>
    ) : (
      <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
    )}
  </>
  
)
 
}
export default Creditos;