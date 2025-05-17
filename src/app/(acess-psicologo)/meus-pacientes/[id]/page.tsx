'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { FaList, FaFileAlt, FaThumbsUp, FaThumbsDown, FaTrash, FaEdit } from "react-icons/fa"//icones de like e dislike
import HeadPage from "@/app/protected-components/headPage"
import { useEffect, useState } from "react"
import { redirect, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { FaCirclePlus } from "react-icons/fa6";
import { showErrorMessage, showSuccessMessage } from "@/app/util/messages"
import { ModalPacientes } from "./components/modal-pacientes"
import { Paciente } from "../../../../../types/paciente"

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
      return (<FaThumbsUp />)
    case "stoped":
      return (<FaThumbsDown />)
    default:
      return (<FaThumbsUp />)
  }
}




//alterar depois meus atendimentos para meus pacientes
const MeusAtendimentos = () => {
  const { role } = useAccessControl()
  const [pacientes, setPacientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { id } = useParams()




  //controle de edição de pacientes:
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any | null>(null)

  const abrirModal = (paciente: any) => {

    setPacienteSelecionado(paciente)
    console.log(paciente)
    setIsModalOpen(true)

  }

  const fecharModal = () => {
    setIsModalOpen(false)
    setPacienteSelecionado(null)
  }

  const { data: session, status } = useSession(); // Obtém os dados da sessão
  const name_psico = session?.user.name



  const handleDeletePaciente = async (pacienteId: string) => {
    try {
      const response = await fetch('/api/internal/register_pacientes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: pacienteId }),
      });

      if (response.ok) {
        // Atualiza a lista de pacientes após a deleção
        setPacientes(pacientes.filter(paciente => paciente.id !== pacienteId));
        showSuccessMessage('Paciente deletado com sucesso!');
      } else {
        const data: Paciente = await response.json();
        showErrorMessage(`Erro ao deletar paciente: ${data}`);
      }
    } catch (error) {
      showErrorMessage('Erro ao deletar paciente. Tente novamente mais tarde.');
    }
  };


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(`/api/internal/register_pacientes?psicoloId=${id}`)
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
        title={'Meus Pacientes'}
        icon={<FaList size={20} />}
      />

      <div className="overflow-x-auto p-4">
        <div className=" h-full px-5 py-3 flex justify-end">
          <FaCirclePlus size={30} className="text-green-800"
            onClick={() => { redirect(`/cadastro-pacientes/${id}`) }}
            title='Adcionar novo paciente'
          />
        </div>
        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              {/*  <th className="px-4 py-2 text-left">ID</th> */}
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Idade</th>
              <th className="px-4 py-2 text-left">Telefone</th>
              <th className="px-4 py-2 text-left">Cidade</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Convenio</th>
              <th className="px-4 py-2 text-left">Prontuario</th>
              <th className="px-4 py-2 text-left">Action</th>
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
                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        onClick={() => handleDeletePaciente(item.id)}
                        title="Deletar paciente"
                      >
                        <FaTrash />
                        Deletar
                      </button>

                      <button
                        className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-900 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        onClick={() => abrirModal(item)}
                        title="Editar paciente"
                      >
                        <FaEdit />
                        Editar
                      </button>
                    </div>
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

      {isModalOpen && (
        <ModalPacientes
          isOpen={isModalOpen}
          onClose={fecharModal}
          paciente={pacienteSelecionado}
        />
      )}


    </>
  )
}

export default MeusAtendimentos
//caveman method skincare
