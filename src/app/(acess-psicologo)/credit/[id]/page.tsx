'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { useRouter } from "next/navigation"
import { FaRegCreditCard, FaCoins, FaArrowUp, FaArrowDown } from "react-icons/fa"
import HeadPage from "@/app/protected-components/headPage"

const Creditos = () => {
  const { role } = useAccessControl()
  const router = useRouter()

  const creditos = {
    saldo: 120, // em reais
    totalRecarregado: 500,
    totalGasto: 380
  }

  const handleAdicionarCreditos = () => {
    alert("Fluxo de recarga de créditos será implementado futuramente.")
  }

  return (
    <>
      <HeadPage title="Créditos" icon={<FaRegCreditCard size={20} />} />

      {role === 'PSYCHOLOGIST' ? (
        <div className="m-4 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo de Créditos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">

            <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-500">Saldo disponível</p>
                <p className="text-2xl font-bold text-blue-600">R$ {creditos.saldo.toFixed(2)}</p>
              </div>
              <FaCoins size={32} className="text-blue-500" />
            </div>

            <div className="bg-green-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-500">Total recarregado</p>
                <p className="text-2xl font-bold text-green-600">R$ {creditos.totalRecarregado.toFixed(2)}</p>
              </div>
              <FaArrowUp size={32} className="text-green-500" />
            </div>

            <div className="bg-red-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-500">Total gasto</p>
                <p className="text-2xl font-bold text-red-600">R$ {creditos.totalGasto.toFixed(2)}</p>
              </div>
              <FaArrowDown size={32} className="text-red-500" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleAdicionarCreditos}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl shadow-lg transition"
            >
              Adicionar Créditos
            </button>
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
