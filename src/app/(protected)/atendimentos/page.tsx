
'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto



const MeusAtendimentos = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
 


return(
    <>
    {role === 'PSYCHOLOGIST' ? (
      <div>Meus Atendimentos</div>
    ) : (
      <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
    )}
  </>
  
)
 
}
export default MeusAtendimentos;
