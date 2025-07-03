'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { GiMaterialsScience } from "react-icons/gi"
import HeadPage from "@/app/(private-access)/components/headPage"
import { FaUpload, FaFileAlt, FaRobot } from "react-icons/fa"
import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { FiInfo } from "react-icons/fi"

interface Docs {
  id: string
  name: string
  url: string
  psicologoId: string
}

const BaseCientifica = () => {
  const { id } = useParams()
  const { role } = useAccessControl()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [docName, setDocName] = useState("")
  const [customPrompt, setCustomPrompt] = useState('')
  const [savingPrompt, setSavingPrompt] = useState(false)
  const [modelos, setModelos] = useState<Docs[]>([])
  const [docs, setDocs] = useState<Docs[]>([])
  

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return alert("Selecione um arquivo.")
    if (!docName.trim()) return alert("Digite um nome para o documento.")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", docName.trim())
    formData.append("psicologoId", String(id))

    setUploading(true)
    try {
      const response = await fetch(`/api/uploads/doc-model?path=docs-tiviai`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        alert("Erro ao enviar o arquivo.")
        console.error(result)
        return
      }

      setModelos(prev => [
        ...prev,
        {
          id: result.id,
          name: result.name,
          url: result.url,
          psicologoId: result.psicologoId
        }
      ])
      alert("Arquivo enviado com sucesso!")
      setDocName("")
    } catch (err) {
      console.error(err)
      alert("Erro inesperado.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }


  //get modelos
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(`/api/uploads/my-models?psicologoId=${id}`)
        const data = await response.json()
        setModelos(data)
      } catch (err) {
        console.error("Erro ao buscar modelos:", err)
      }
    }
    if (id) {
      fetchMaterials()
    }
  }, [id])

  return (
    <>
      <HeadPage title="Base Científica" icon={<GiMaterialsScience size={20} />} />
      {role !== 'PSYCHOLOGIST' ? (
        <div className="flex justify-center items-center h-screen text-red-500 text-lg">
          Essa página é acessível apenas para psicólogos
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <div className="bg-blue-100 p-4 rounded-xl flex items-center gap-4">
            <FaRobot className="text-blue-500 text-3xl" />
            <div>
              <p className="font-semibold text-blue-800">
                GPT está utilizando esses materiais para gerar insights.
              </p>
              <p className="text-sm text-blue-700">
                Você pode adicionar novos arquivos para enriquecer a base.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Seu Prompt Personalizado</h3>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Descreva seu prompt..."
              className="w-full border rounded p-3 min-h-[120px] text-sm text-gray-700"
            />
            <button
              onClick={() => alert("salvar prompt ainda não implementado")}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Salvar Prompt
            </button>
          </div>



          {/* base de conhecimento */}
          <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Base de Conhecimento</h3>
            <ul className="space-y-2">
              {docs.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <a href={file.url} target="_blank" className="text-xs text-blue-600 underline">Visualizar</a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>


          <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
             Adcionar novo arquivo à base
              <FiInfo
                title="Você pode subir arquivos que você estuda artigos científicos,livros ou outros!"
                className="text-blue-500 cursor-help"
                size={18}
              />
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Nome do documento"
                className="border p-2 rounded w-full"
              />
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="border p-2 rounded w-full"
                />
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                >
                  <FaUpload /> {uploading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </div>
          </div>


      {/*     //meus modelos: */}
  
          {/* modelos */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Modelos cadastrados</h3>
            <ul className="space-y-2">
              {modelos.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <a href={file.url} target="_blank" className="text-xs text-blue-600 underline">Visualizar</a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
              Adicionar novo modelo
              <FiInfo
                title="Você pode colocar aqui os modelos de documentos que você deseja gerar automaticante nas suas sessões"
                className="text-blue-500 cursor-help"
                size={18}
              />
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Nome do documento"
                className="border p-2 rounded w-full"
              />
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="border p-2 rounded w-full"
                />
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                >
                  <FaUpload /> {uploading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </div>
          </div>





        </div>
      )}
    </>
  )
}

export default BaseCientifica
