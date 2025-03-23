
'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto

const Dashboard = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
return(
    <>
    {role === 'PSYCHOLOGIST' ? (
      <div>Pagina de Dashboards</div>
    ) : (
        <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
    )}
  </>
  
)
 
}
export default Dashboard;