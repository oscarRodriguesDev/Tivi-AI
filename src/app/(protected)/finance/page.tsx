'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { FaMoneyBillWave, FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa"
import HeadPage from "../components/headPage"

type StatusPagamento = "Pago" | "Pendente" | "Atrasado"

const pagamentos: { paciente: string; data: string; valor: string; status: StatusPagamento }[] = [
  { paciente: "Maria Silva", data: "02/04/2025", valor: "R$ 200,00", status: "Pago" },
  { paciente: "João Souza", data: "04/04/2025", valor: "R$ 180,00", status: "Pendente" },
  { paciente: "Ana Costa", data: "01/04/2025", valor: "R$ 220,00", status: "Atrasado" },
]

const statusColor: Record<StatusPagamento, string> = {
  "Pago": "text-green-600",
  "Pendente": "text-yellow-600",
  "Atrasado": "text-red-600",
}

const statusIcon: Record<StatusPagamento, React.ReactNode> = {
  "Pago": <FaCheckCircle />,
  "Pendente": <FaClock />,
  "Atrasado": <FaExclamationTriangle />,
}

const Financeiro = () => {
  const { role } = useAccessControl()

  return (
    <>
      <HeadPage title="Financeiro" icon={<FaMoneyBillWave size={20} />} />

      {role !== "PSYCHOLOGIST" ? (
        <div className="bg-white shadow-lg rounded-2xl p-6 m-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Histórico de Pagamentos</h2>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-600 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">Paciente</th>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">Valor</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((item, idx) => (
                <tr key={idx} className="bg-white border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{item.paciente}</td>
                  <td className="px-6 py-4">{item.data}</td>
                  <td className="px-6 py-4">{item.valor}</td>
                  <td className={`px-6 py-4 flex items-center gap-2 ${statusColor[item.status]}`}>
                    {statusIcon[item.status]} {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen text-gray-600">
          Essa página é acessível apenas para psicólogos.
        </div>
      )}
    </>
  )
}

export default Financeiro
