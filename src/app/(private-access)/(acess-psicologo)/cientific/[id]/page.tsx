'use client'

import { useAccessControl } from "@/app/context/AcessControl"
import { GiMaterialsScience } from "react-icons/gi"
import HeadPage from "@/app/(private-access)/components/headPage"
import { FaRobot } from "react-icons/fa"
import { use, useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { HiDocumentCheck } from "react-icons/hi2";
import Image from "next/image"
import book_ansiedade from '@../../../public/books/book-ansiedade.png'
import book_bournout from '@../../../public/books/book-bournout.png'
import book_autoconheciemto from '@../../../public/books/bookautoconhecimanto.png'
import book_tdah from '@../../../public/books/booktdah.png'



import mammoth from "mammoth"


interface base_cientific {
  id: string;
  name: string;
  url_capa: string;
  resumo: string;
}
interface Docs {
  id: string
  name: string
  psicologoId: string
  prompt: string
}


const livros =[
  {
    "id": "1a2b3c",
    "name": "Um book sobre ansiedade",
    "url_capa": book_ansiedade,
    "resumo": "Este artigo explora como o cérebro se adapta a novos estímulos e ambientes, com foco nos efeitos da aprendizagem ao longo da vida."
  },
  {
    "id": "4d5e6f",
    "name": "Bournout compreensão e manejo",
    "url_capa": book_bournout,
    "resumo": "Um estudo sobre a integração de estratégias da psicologia positiva em intervenções cognitivas para aumento do bem-estar."
  },
  {
    "id": "7g8h9i",
    "name": "Procrastinação nunca mais",
    "url_capa": book_autoconheciemto,
    "resumo": "Análise dos mecanismos de regulação emocional durante a adolescência e seu impacto no desenvolvimento afetivo-social."
  },
  {
    "id": "0j1k2l",
    "name": "Um ebook sobre TDAH",
    "url_capa": book_tdah,
    "resumo": "Revisão científica sobre a relação entre qualidade do sono e transtornos mentais como ansiedade e depressão."
  }
]







const BaseCientifica = () => {
  const { id } = useParams()
  const { role } = useAccessControl()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [docName, setDocName] = useState("")
  const [customPrompt, setCustomPrompt] = useState('')
  const [savingPrompt, setSavingPrompt] = useState(false)
  const [docs, setDocs] = useState<Docs[]>([])

  const handleFileChange = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()

    let text = ""

    try {
      if (ext === 'pdf') {

        alert("⚠️ Aviso: pdf-lib não extrai texto nativamente. Prefira arquivos .txt ou .docx para melhor resultado.")
      } else if (ext === 'txt') {
        text = await file.text()
      } else if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      } else {
        alert("Formato não suportado. Use PDF, TXT ou DOCX.")
        return
      }

      setCustomPrompt(text)
    } catch (err) {
      console.error("Erro ao ler arquivo:", err)
      alert("Erro ao ler o conteúdo do arquivo.")
    }
  }

  const handleSavePrompt = async () => {
    if (!docName.trim()) return alert("Dê um nome ao documento.")
    if (!customPrompt.trim()) return alert("O conteúdo do prompt está vazio.")
    if (!id) return alert("ID do psicólogo não encontrado.")

    setSavingPrompt(true)
    try {
      const response = await fetch('/api/uploads/doc-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: docName.trim(),
          psicologoId: id,
          prompt: customPrompt.trim()
        })
      })

      if (!response.ok) throw new Error("Erro ao salvar documento")
      alert("Documento salvo com sucesso!")
      setDocName("")
      setCustomPrompt("")
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar documento.")
    } finally {
      setSavingPrompt(false)
    }
  }



  //busca dos documetnos
  const docSeek = async (): Promise<Docs[]> => {
    if (!id) {
      alert("ID do psicólogo não encontrado.");
      return [];
    }

    try {
      const response = await fetch(`/api/uploads/doc-model?psicologoId=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar documentos");
      }

      const documents: Docs[] = await response.json();
      console.log("Documentos encontrados:", documents);
      return documents; // ✅ RETORNA DIRETAMENTE
    } catch (err) {
      console.error("Erro ao buscar documentos:", err);
      alert("Erro ao buscar documentos.");
      return []; // fallback vazio
    }
  };

  useEffect(() => {
    async function fetchDocs() {
      const docs = await docSeek();
      setDocs(docs || []);
    }

    fetchDocs();
  }, []);


  //create a handleDelete
  const handleDelete = async (docId: string) => {
    if (!confirm("Tem certeza que deseja deletar este documento?")) {
      return;
    }

    try {
      const response = await fetch(`/api/uploads/doc-model?docId=${docId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar documento");
      }

      alert("Documento deletado com sucesso!");

      // Atualiza a lista de documentos removendo o deletado
      setDocs(prevDocs => prevDocs.filter(doc => doc.id !== docId));
    } catch (err) {
      console.error("Erro ao deletar documento:", err);
      alert("Erro ao deletar documento.");
    }
  };


  const colorClasses = [
    "bg-red-100 text-red-800 hover:bg-red-200",
    "bg-green-100 text-green-800 hover:bg-green-200",
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "bg-purple-100 text-purple-800 hover:bg-purple-200",
    "bg-pink-100 text-pink-800 hover:bg-pink-200",
    "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    "bg-amber-100 text-amber-800 hover:bg-amber-200"
  ]



  return (
    <>
      <HeadPage title="Base Científica" icon={<GiMaterialsScience size={20} />} />
      {role !== 'PSYCHOLOGIST' ? (
        <div className="flex justify-center items-center h-screen text-red-500 text-lg">
          Essa página é acessível apenas para psicólogos
        </div>
      ) : (
        <>

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


            {/* modleos de base*/}
            <div className="w-full border border-cyan-950 p-4 flex flex-wrap gap-4">
              {livros.map((livro) => (
                <div key={livro.id} className="flex flex-col items-center w-32 text-center">
                  <Image
                    src={livro.url_capa}
                    alt={livro.name}
                    width={40}
                    height={20}
                    className="object-contain"
                  />
                  <span className="mt-2 text-sm font-medium text-gray-800">{livro.name}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-700">Adicionar novo Livro ou Artigo</h3>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Nome do documento"
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Titulo"
                className="border p-2 rounded w-full"
              />

              <input type="file"
                accept="jpg,png"
              />
              <br />

              <button
                onClick={handleSavePrompt}
                disabled={savingPrompt}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {savingPrompt ? "Salvando..." : "Salvar documento"}
              </button>
            </div>


            {/* modleos de documenos */}
            <div className="w-full border border-cyan-950 p-4 flex flex-wrap gap-2">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-center gap-2 ${[
                    "bg-red-100 text-red-800 hover:bg-red-200",
                    "bg-green-100 text-green-800 hover:bg-green-200",
                    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
                    "bg-purple-100 text-purple-800 hover:bg-purple-200",
                    "bg-pink-100 text-pink-800 hover:bg-pink-200",
                    "bg-blue-100 text-blue-800 hover:bg-blue-200",
                    "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
                    "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  ][Math.floor(Math.random() * 8)]
                    } text-sm font-medium px-3 py-2 rounded-lg shadow-sm transition`}
                >
                  <HiDocumentCheck size={18} className="text-inherit" />
                  <span>{doc.name}</span>
                  <span
                    onClick={() => { handleDelete(doc.id) }}
                    className="ml-2 cursor-pointer text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-full px-2 py-1 text-xs font-semibold transition"
                  >
                    x
                  </span>

                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-700">Adicionar novo Modelo de Documento</h3>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Nome do documento"
                className="border p-2 rounded w-full"
              />
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Conteúdo extraído do documento..."
                className="w-full border rounded p-3 min-h-[200px] text-sm text-gray-700"
              />
              <button
                onClick={handleSavePrompt}
                disabled={savingPrompt}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {savingPrompt ? "Salvando..." : "Salvar documento"}
              </button>
            </div>
          </div>
        </>

      )}
    </>
  )
}

export default BaseCientifica
