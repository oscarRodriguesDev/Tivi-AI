'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { GiMaterialsScience } from "react-icons/gi"
import HeadPage from "@/app/protected-components/headPage"
import { FaUpload, FaFileAlt, FaRobot } from "react-icons/fa"

const BaseCientifica = () => {
  const { role } = useAccessControl()

  const materials = [
    { title: "Manual de Terapia Cognitivo-Comportamental", size: "1.2MB", type: "PDF" },
    { title: "Abordagens para Depressão em Adolescentes", size: "890KB", type: "PDF" },
    { title: "Estudos sobre Ansiedade Generalizada", size: "740KB", type: "PDF" },
  ]

  const renderList = () => (
    <div className="p-6 space-y-6">
      <div className="bg-blue-100 p-4 rounded-xl flex items-center gap-4">
        <FaRobot className="text-blue-500 text-3xl" />
        <div>
          <p className="font-semibold text-blue-800">GPT está utilizando esses materiais para gerar insights nos atendimentos.</p>
          <p className="text-sm text-blue-700">Você pode atualizar ou adicionar novos arquivos para enriquecer a base de conhecimento.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Materiais cadastrados</h3>
        <ul className="space-y-2">
          {materials.map((file, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded">
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">{file.title}</p>
                  <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
                </div>
              </div>
              <button className="text-sm text-red-500 hover:underline">Remover</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Adicionar novo material</h3>
        <div className="flex items-center gap-4">
          <input type="file" className="border p-2 rounded w-full" />
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            <FaUpload /> Enviar
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <HeadPage
        title="Base Científica"
        icon={<GiMaterialsScience size={20} />}
      />

      {role === 'PSYCHOLOGIST' ? (
        renderList()
      ) : (
        <div className="flex justify-center items-center h-screen text-red-500 text-lg">
          Essa página é acessível apenas para psicólogos
        </div>
      )}
    </>
  )
}

export default BaseCientifica
