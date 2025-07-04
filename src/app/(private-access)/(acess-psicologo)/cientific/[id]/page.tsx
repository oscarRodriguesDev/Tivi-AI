'use client'

import { useAccessControl } from "@/app/context/AcessControl"
import { GiMaterialsScience } from "react-icons/gi"
import HeadPage from "@/app/(private-access)/components/headPage"
import {  FaRobot } from "react-icons/fa"
import { useRef, useState } from "react"
import { useParams } from "next/navigation"


import mammoth from "mammoth"

interface Docs {
  id: string
  name: string
  psicologoId: string
  prompt: string
}

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

          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Adicionar novo conhecimento</h3>
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
      )}
    </>
  )
}

export default BaseCientifica
