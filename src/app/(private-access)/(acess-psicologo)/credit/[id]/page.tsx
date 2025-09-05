'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { useRouter, useParams } from "next/navigation"
import { FaRegCreditCard, FaCoins, FaArrowUp, FaArrowDown } from "react-icons/fa"
import HeadPage from "@/app/(private-access)/components/headPage"
import PaymentModal from "./components/modal-recharg"
import { useEffect, useState } from "react"
import Error from "next/error"


const Creditos = () => {
  const { role } = useAccessControl()

  const router = useRouter()

  //determinando  o usuarios
  const params = useParams()
  const id = params.id as string


  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)
  const [loadingProdutos, setLoadingProdutos] = useState<boolean>(true)
  const [erroProdutos, setErroProdutos] = useState<string | null>(null)
  const [produtosList, setProdutosList] = useState<Produto[]>([])
  const [credito, setCredito] = useState<string>('0')
  const [recarga, setRecarga] = useState<string>('0')
  const [gastos, setGastos] = useState<string>('R$ 0,00')
  // State para armazenar a lista de ordens de compra do usuário
  const [compras, setCompras] = useState<Compra[]>([]);


  //representa meu produto
  interface Produto {
    codigo: string
    titulo: string
    descricao: string
    preco: number
    quantidade: number
  }

/* primeria parte do fluxo, buscar as ordens salvas no banco */

//represetna minha compra salva no banco de dados
  interface Compra {
    id: string;
    userId: string;
    user: string;
    paymentId: string;
    status: string;
    qtdCreditos: string;
  }

  interface ComprasResponse {
    compras: Compra[];
  }




  // Função para buscar as ordens no banco e atribuir ao objeto ordens
  async function fetchOrdens(userId: string) {
    try {
      const res = await fetch(`/api/internal/payments/savepay?userId=${userId}`);
      if (!res.ok) {
        
        return
      }

      // data é o objeto que contém a propriedade 'compras'
      const data: ComprasResponse = await res.json();

      // setando somente o array de compras no state
      setCompras(data.compras);
     
      //como peegar os objetos, tem que percorrer as ordens
      console.log(data.compras[0].id); // aqui você verá o array completo
    } catch (error) {
      console.error("Erro ao buscar ordens:", error);
    }
  }



  // Buscar as ordens do usuário quando a página carregar ou quando o id mudar
  useEffect(() => {
    if (id) {
      fetchOrdens(id);
    }
  }, [id]);


// Função para chamar a API e entregar créditos ao usuário
async function entregarCreditos(qtdCreditos: string, compraId:string) {
  try {
    // Supondo que o id do usuário está disponível como 'id'
    const response = await fetch("/api/internal/payments/conclusion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: id,
        creditos: Number(qtdCreditos),
        compraId: compraId
      }),
    });

    const data = await response.json();

    if (!response.ok) {
    
      return;
    }

    console.log("Créditos entregues com sucesso:", data);
    // Aqui você pode atualizar o estado do usuário, mostrar mensagem, etc.
  } catch (error) {
    console.error("Erro ao entregar créditos:", error);
    return
  }
}



  

//esse teste éapenas local
    async function checkPaymentStatus(transactionId: string) {
      try {
        const response = await fetch(`/api/internal/location-verification?orderId=${transactionId}`);
        const data = await response.json();
  
        if (!response.ok) {
          console.error("Erro ao consultar status:", data.error);
          return "error";
        }
  
        const status = data.status;
        console.log("🔎 Status atual:", status);
  
        return status;
        // waiting_payment | paid | failed | canceled
      } catch (err) {
        console.error("Erro ao consultar status:", err);
        return "error";
      }
    }



  useEffect(() => { 

    try{
      const verificarStatusOrdens = async () => {
        let creditosEntregues = false;
        if (compras && compras.length > 0) {
          for (const compra of compras) {
            const status = await checkPaymentStatus(compra.paymentId);
            console.log("Status", status);
            console.log("Ordem", compra.paymentId);
            // fazer a entrega enquanto está em teste
            if (status === 'paid') { //aqui será paid apenas
              await entregarCreditos(compra.qtdCreditos, compra.id);
              creditosEntregues = true;
             
            }
          }
        }
        // Atualiza o saldo de créditos do usuário após entregar créditos
        if (creditosEntregues) {
          await fetchUserCreditos(id);
        }
      };

      verificarStatusOrdens();
  // Se quiser rodar periodicamente, descomente abaixo:
    
    const interval = setInterval(() => {
      //verificarStatusOrdens();
    }, 10000);
    return () => clearInterval(interval);
    

    }catch(error){
      return;
    }


  
  }, [compras]);








    
  //comprar creditos
  const handleComprar = (produto: Produto) => {

    setIsModalOpen(true)
    setSelectedProduto(produto)

  }


  //recupera o credito do usuario
  async function fetchUserCreditos(userId: string): Promise<number | null> {
    try {
      const res = await fetch(`/api/internal/creditos?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setCredito(data.creditos)
      }
      return null;
    } catch (err) {
      console.error("Erro ao buscar créditos:", err);
      return null;
    }
  }

  // Efeito para checar status das ordens a cada minuto





  //buscar os creditos do usuario quando a pagina carregar
  useEffect(() => {
    fetchUserCreditos(id)
  })






  //listar meus produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      setLoadingProdutos(true)
      setErroProdutos(null)
      try {
        const res = await fetch("/api/internal/products/")
        if (!res.ok) {
          return
        }
        const data = await res.json()
        setProdutosList(data)
        console.log(produtosList)
      } catch (err: any) {
        setErroProdutos(err.message || "Erro ao buscar produtos")
      } finally {
        setLoadingProdutos(false)
      }
    }
    fetchProdutos()
  }, [])



  return (
    <>
      <HeadPage title="Créditos" icon={<FaRegCreditCard size={20} />} />

      {role === 'PSYCHOLOGIST' ? (
        <div className="m-4 bg-white rounded-2xl shadow-lg p-6">
          {selectedProduto && (
            <>
            
            <PaymentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              produto={selectedProduto}
            />
            </>
          )}

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo de Créditos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-500">Créditos disponíveis</p>
                <p className="text-2xl font-bold text-blue-600">{credito} créditos</p>
              </div>
              <FaCoins size={32} className="text-blue-500" />
            </div>

            <div className="bg-green-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-500">Total recarregado</p>
                <p className="text-2xl font-bold text-green-600">
                  {recarga} créditos
                </p>
              </div>
              <FaArrowUp size={32} className="text-green-500" />
            </div>

            <div className="bg-red-50 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-500">Total gasto</p>
                <p className="text-2xl font-bold text-red-600">{gastos} créditos</p>
              </div>
              <FaArrowDown size={32} className="text-red-500" />
            </div>
          </div>

          {/* LISTA DE PRODUTOS */}
          <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Escolha um pacote de créditos</h3>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {produtosList.map((produto) => (
              <div
                key={produto.codigo}
                className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer flex flex-col items-center text-center p-6 border border-gray-100"
              >


                {/* Título */}
                <h4 className="text-xl font-extrabold text-gray-900 mb-2">{produto.titulo}</h4>

                {/* Quantidade de créditos */}
                <div className="text-green-600 font-bold text-2xl mb-2">{produto.quantidade} Créditos</div>

                {/* Descrição */}
                <p className="text-gray-500 text-sm mb-4">{produto.descricao}</p>

                {/* Preço */}
                <div className="bg-gray-100 w-full rounded-xl py-3 mb-6">
                  <span className="text-xl font-bold text-gray-800">R$ {produto.preco.toFixed(2)}</span>
                </div>

                {/* Botão Comprar */}
                <button
                  onClick={() => handleComprar(produto)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
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

      {/* Div para apresentar as ordens do usuário */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Minhas Ordens de Compra</h3>
        {/* Aqui você pode mapear e exibir as ordens do usuário */}
        {/* Exemplo estático, troque por dados reais depois */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500">Nenhuma ordem encontrada.</p>

          {/*   {ordens.map((ordem) => (
          <div key={ordem.id} className="border-b py-2 flex justify-between items-center">
            <span className="font-medium">{ordem.produto}</span>
            <span className={`px-2 py-1 rounded text-xs ${ordem.status === 'PAID' ? 'bg-green-100 text-green-700' : ordem.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {ordem.status}
            </span>
            <span className="text-gray-400">{new Date(ordem.createdAt).toLocaleString()}</span>
          </div>
        ))}
         */}
        </div>
      </div>
    </>
  )
}

export default Creditos
