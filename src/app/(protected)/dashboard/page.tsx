
'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto

const Dashboard = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
return(
  <>
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