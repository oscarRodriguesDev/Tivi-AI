'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { FaList, FaFileAlt } from "react-icons/fa"
import HeadPage from "../components/headPage"

const mockAtendimentos = [
  {
    id: '000001',
    nome: "Oscar Rodrigues Neto",
    idade: 40,
    telefone: "(27) 99999-9999",
    cidade: "Serra",
    estado: "Espírito Santo",
    operadora: "Unimed",
    status: "ATIVO"
  },
  {
    id: '000002',
    nome: "Tatiane Pontes",
    idade: 33,
    telefone: "(27) 98888-8888",
    cidade: "Serra",
    estado: "Espírito Santo",
    operadora: "Unimed",
    status: "PARADO"
  },
  {
    id: '000003',
    nome: "Cássio Jordan Almeida Alves",
    idade: 32,
    telefone: "(27) 99777-7777",
    cidade: "Serra",
    estado: "Espírito Santo",
    operadora: "Unimed",
    status: "ATIVO"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "ATIVO":
      return "bg-blue-100 text-blue-700"
    case "PARADO":
      return "bg-red-100 text-red-700"
    case "PENDENTE":
      return "bg-yellow-100 text-yellow-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const MeusAtendimentos = () => {
  const { role } = useAccessControl()

 /*  if (role !== 'PSYCHOLOGIST') {
    return (
      <div className="flex justify-center items-center h-screen text-center text-lg text-red-500">
        Essa página é acessível apenas para psicólogos.
      </div>
    )
  } */

  return (
    <>
      <HeadPage
        title="Meus Atendimentos"
        icon={<FaList size={20} />}
      />

      <div className="overflow-x-auto p-4">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Idade</th>
              <th className="px-4 py-2 text-left">Telefone</th>
              <th className="px-4 py-2 text-left">Cidade</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Operadora</th>
              <th className="px-4 py-2 text-left">Documento</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockAtendimentos.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 text-sm">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.nome}</td>
                <td className="px-4 py-2">{item.idade}</td>
                <td className="px-4 py-2">{item.telefone}</td>
                <td className="px-4 py-2">{item.cidade}</td>
                <td className="px-4 py-2">{item.estado}</td>
                <td className="px-4 py-2">{item.operadora}</td>
                <td className="px-4 py-2">
                  <FaFileAlt className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default MeusAtendimentos
