'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { useRouter } from "next/navigation"
import { FaRegCreditCard, FaCoins, FaArrowUp, FaArrowDown } from "react-icons/fa"
import HeadPage from "@/app/(private-access)/components/headPage"
import { convertToCredits, convertToBRL } from "@/app/util/credits"
import PaymentModal from "./components/modal-recharg"
import { useState } from "react"

const Creditos = () => {
  const { role } = useAccessControl()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)

  const creditos = {
    saldo: 120, // em reais
    totalRecarregado: 500,
    totalGasto: 380
  }

  interface Produto {
    codigo: string
    titulo: string
    descrição: string
    preço: number
    quantidade: number
  }

  const produtos: Produto[] = [
    { codigo: "p1", titulo: `Pacote ${convertToCredits(100)} Créditos`, descrição: "Ideal para consultas rápidas", preço: convertToBRL(100), quantidade: 1 },
    { codigo: "p2", titulo: `Pacote ${convertToCredits(500)} Créditos`, descrição: "Mais econômico", preço: convertToBRL(500), quantidade: 1 },
    { codigo: "p3", titulo: `Pacote ${convertToCredits(1000)} Créditos`, descrição: "Para uso contínuo", preço: convertToBRL(1000), quantidade: 1 },
  ]

  const handleComprar = (produto: Produto) => {
    setSelectedProduto(produto)
    setIsModalOpen(true)
  }

  return (
    <>
      <HeadPage title="Créditos" icon={<FaRegCreditCard size={20} />} />

      {role === 'PSYCHOLOGIST' ? (
        <div className="m-4 bg-white rounded-2xl shadow-lg p-6">
          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo de Créditos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-500">Créditos disponíveis</p>
                <p className="text-2xl font-bold text-blue-600">{creditos.saldo.toFixed(0)} créditos</p>
              </div>
              <FaCoins size={32} className="text-blue-500" />
            </div>

            <div className="bg-green-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-500">Total recarregado</p>
                <p className="text-2xl font-bold text-green-600">
                  {creditos.totalRecarregado.toFixed(0)} créditos
                </p>
              </div>
              <FaArrowUp size={32} className="text-green-500" />
            </div>

            <div className="bg-red-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-500">Total gasto</p>
                <p className="text-2xl font-bold text-red-600">{creditos.totalGasto.toFixed(0)} créditos</p>
              </div>
              <FaArrowDown size={32} className="text-red-500" />
            </div>
          </div>

          {/* LISTA DE PRODUTOS */}
          <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Escolha um pacote de créditos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div
                key={produto.codigo}
                className="border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
              >
                <h4 className="text-md font-bold text-gray-800">{produto.titulo}</h4>
                <p className="text-sm text-gray-600 mb-2">{produto.descrição}</p>
                <p className="text-lg font-semibold text-[#127B42] mb-3">R$ {produto.preço.toFixed(2)}</p>
                <button
                  onClick={() => handleComprar(produto)}
                  className="w-full bg-[#127B42] hover:bg-[#0f6134] text-white font-medium py-2 rounded-lg transition"
                >
                  Comprar
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen text-gray-600">
          Essa página é acessível apenas para psicólogos.
        </div>
      )}
    </>
  )
}

export default Creditos
