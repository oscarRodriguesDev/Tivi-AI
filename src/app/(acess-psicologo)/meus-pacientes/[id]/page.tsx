'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { FaList, FaFileAlt, FaThumbsUp, FaThumbsDown } from "react-icons/fa"//icones de like e dislike
import HeadPage from "@/app/protected-components/headPage"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { mock } from "node:test"



const mockAtendimentos = [
  {
    id: '000001',
    nome: "Oscar Rodrigues Neto",
    idade: 40,
    telefone: "(27) 99999-9999",
    cidade: "Serra",
    estado: "Espírito Santo",
    operadora: "Unimed",
    status: "ok"
  },
  {
    id: '000002',
    nome: "Tatiane Pontes",
    idade: 33,
    telefone: "(27) 98888-8888",
    cidade: "Serra",
    estado: "Espírito Santo",
    operadora: "Unimed",
    status: "ok"
  },
  {
    id: '000003',
    nome: "Cássio Jordan Almeida Alves",
    idade: 32,
    telefone: "(27) 99777-7777",
    cidade: "Serra",
    estado: "Espírito Santo",
    convenio: "Unimed",
    status: "stoped"
  }
]

const getStatus = (status: string) => {
  switch (status) {
    case "ok":
      return(<FaThumbsUp/>)
    case "stoped":
      return (<FaThumbsDown/>)
    default:
      return (<FaThumbsUp/>)
  }
}



const MeusAtendimentos = () => {
  const { role } = useAccessControl()
  const [pacientes, setPacientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  const { data: session, status } = useSession(); // Obtém os dados da sessão
  const name_psico = session?.user.name


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(`/api/register_pacientes?psicoloId=${id}`)
        if (!response.ok) {
          throw new Error('Erro ao buscar pacientes')
        }
        const data = await response.json()
        setPacientes(data)
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    // se quiser realmente testar a API, descomente:
     fetchPacientes()
  }, [id])

  if (role === 'ADMIN') {
    return (
      <div className="flex justify-center items-center h-screen text-center text-lg text-red-500">
        Essa página é acessível apenas para psicólogos.
      </div>
    )
  }

  return (
    <>
      <HeadPage
        title="Meus Pacientes"
        icon={<FaList size={20} />}
      />

<div className="overflow-x-auto p-4">
  <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow">
    <thead className="bg-gray-100 text-gray-700 text-sm">
      <tr>
       {/*  <th className="px-4 py-2 text-left">ID</th> */}
        <th className="px-4 py-2 text-left">Nome</th>
        <th className="px-4 py-2 text-left">Idade</th>
        <th className="px-4 py-2 text-left">Telefone</th>
        <th className="px-4 py-2 text-left">Cidade</th>
        <th className="px-4 py-2 text-left">Estado</th>
        <th className="px-4 py-2 text-left">Operadora</th>
        <th className="px-4 py-2 text-left">Documentos</th>
        <th className="px-4 py-2 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      {pacientes && pacientes.length > 0 ? (
        pacientes.map((item, index) => (
          <tr key={index} className="border-t border-gray-200 text-sm">
          {/*   <td className="px-4 py-2">{name_psico}</td> */}
            <td className="px-4 py-2">{item.nome}</td>
            <td className="px-4 py-2">{item.idade}</td>
            <td className="px-4 py-2">{item.telefone}</td>
            <td className="px-4 py-2">{item.cidade}</td>
            <td className="px-4 py-2">{item.estado}</td>
            <td className="px-4 py-2">{item.convenio}</td>
            <td className="px-4 py-2">
              <FaFileAlt className="text-blue-500 hover:text-blue-700 cursor-pointer" />
            </td>
            <td className="px-4 py-2">
              <span className="px-2 py-1 rounded-full text-xs font-semibold">
                {getStatus(item.status)}
              </span>
            </td>
          </tr>
        ))
      ) : (
        mockAtendimentos.map((item, index) => (
          <tr key={index} className="border-t border-gray-200 text-sm">
           {/*  <td className="px-4 py-2">{name_psico}</td> */}
            <td className="px-4 py-2">{item.nome}</td>
            <td className="px-4 py-2">{item.idade}</td>
            <td className="px-4 py-2">{item.telefone}</td>
            <td className="px-4 py-2">{item.cidade}</td>
            <td className="px-4 py-2">{item.estado}</td>
            <td className="px-4 py-2">{item.convenio}</td>
            <td className="px-4 py-2">
              <FaFileAlt className="text-blue-500 hover:text-blue-700 cursor-pointer" />
            </td>
            <td className="px-4 py-2">
              <span className="px-2 py-1 rounded-full text-xs font-semibold">
                {getStatus(item.status)}
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

    </>
  )
}

export default MeusAtendimentos
//caveman method skincare
