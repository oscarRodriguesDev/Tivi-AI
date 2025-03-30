
'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { FaMoneyBillWave  } from "react-icons/fa";
import HeadPage from "../components/headPage";



const Financeiro = () => {
  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto



  return (
    <>
 <HeadPage title='Financeiro' icon ={<FaMoneyBillWave size ={20}/>}/>

      {role === 'PSYCHOLOGIST' ? (
        <div>Meus Atendimentos</div>
      ) : (
        <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
      )}
    </>

  )

}
export default Financeiro;