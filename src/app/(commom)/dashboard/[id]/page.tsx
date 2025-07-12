'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { MdOutlineDashboard } from "react-icons/md"
import HeadPage from "@/app/protected-components/headPage"
import { FaUsers, FaCalendarAlt, FaChartPie } from "react-icons/fa"

const Dashboard = () => {
  const { role } = useAccessControl()

  const Card = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) => (
    <div className={`flex items-center gap-4 p-4 rounded-xl shadow bg-${color}-100 text-${color}-800 w-full`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  )

  const psychologistDashboard = (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card 
        title="Atendimentos realizados" 
        value="32" 
        icon={<FaCalendarAlt />} 
        color="blue" 
      />
      <Card 
        title="Pacientes ativos" 
        value="14" 
        icon={<FaUsers />} 
        color="green" 
      />
      <Card 
        title="Média por semana" 
        value="6.5" 
        icon={<FaChartPie />} 
        color="purple" 
      />
    </div>
  )

  const adminDashboard = (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card 
        title="Psicólogos cadastrados" 
        value="56" 
        icon={<FaUsers />} 
        color="blue" 
      />
      <Card 
        title="Atendimentos no sistema" 
        value="1.204" 
        icon={<FaCalendarAlt />} 
        color="red" 
      />
      <Card 
        title="Taxa de atividade" 
        value="87%" 
        icon={<FaChartPie />} 
        color="yellow" 
      />
    </div>
  )

  return (
    <>
     

      {role === 'PSYCHOLOGIST'  ? (
        <>
         <HeadPage title="Dashboards Psicologo" icon={<MdOutlineDashboard size={20} />} />
   {psychologistDashboard}

        </>
        
      ) : role === 'ADMIN' ? (
        <>
         <HeadPage title="Dashboards Admin" icon={<MdOutlineDashboard size={20} />} />
        { adminDashboard}

        </>
      ) : (
        <div className="flex justify-center items-center h-screen text-red-500 text-lg">
          Acesso não autorizado
        </div>
      )}
    </>
  )
}

export default Dashboard
