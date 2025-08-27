import { showErrorMessage, showInfoMessage, showSuccessMessage } from "@/app/util/messages";
import { useState } from "react";
import { CreditCardData, Produto } from "../../../../../../../types/paymentsTypes";
import QRCode from "qrcode";
import { useRouter,useParams} from "next/navigation";

interface transctions {
  status:string
  id:string
  qr_code:string
  qr_code_url:string
}

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto

};



type PixData = Record<string, any>; // se quiser campos extras futuramente

export default function PaymentModal({ isOpen, onClose, produto }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");

  //objeto compra por credito
  const [creditData, setCreditData] = useState<CreditCardData>({
    cardNumber: "",
    holderName: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    name: "",
    email: "",
    cpf: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    ddi: "",
    ddd: "",
    telefone: "",
  });

//objeto de compra por pix
  const [pixData, setPixData] = useState<PixData>({
    name: "",
    cpf: "",
    email: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    ddi: "",
    ddd: "",
    telefone: "",

  });

 
  //roteador para abrir a tela do qrcode
  const router = useRouter()


   // Pega o usuário usando o id do param
   const params = useParams();
   const userId = params?.id as string;


   //modal de pagamentos
  if (!isOpen) return null;

  

  //confirmar compra
  const handleSubmit = () => {
    if (paymentMethod === "pix") {
      buyPix()
    } else {

      buyCredit()
    }
  };

  
  // limpar os campos
  function clearFormFields() {
    setPixData({});
    setCreditData({
      cardNumber: "",
      holderName: "",
      expMonth: "",
      expYear: "",
      cvv: "",
      name: "",
      email: "",
      cpf: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      ddi: "",
      ddd: "",
      telefone: "",
    });
    // Se houver outros campos de estado relacionados ao formulário, limpe-os aqui também
  }


/* 
async function criarCompra(userId: string, paymentId: string,stats?:string) {
  alert(stats)

  if(stats=='FAILED'){
    showErrorMessage(`Não foi possivel concluir sua compra!`)
    return
  }

   if(!paymentId || stats=='FAILED'){
    showErrorMessage(`Ocorreu um erro com seu pagamento, tente novamente mais tarde!`);
    return
   }
  const response = await fetch("/api/internal/payments/savepay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, paymentId,stats }),
    
  });

  const data = await response.json();
 
  showSuccessMessage(
    `Seu pedido foi enviado com sucesso e está em processamento. 
  Assim que o pagamento for confirmado, seus créditos serão liberados automaticamente.`
  );
  //talvez tenha que tratar um erro caso o pagamento for realizado mas não salvar no banco
}

 */

/* 
async function criarCompra(userId: string, paymentId: string, stats?: string) {
  try {
    // Sempre envia o status recebido
    const response = await fetch("/api/internal/payments/savepay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, paymentId, stats }),
    });

    const data = await response.json();

    // Mensagem de erro se o pagamento falhou
    if (stats === "FAILED") {
      showErrorMessage(
        `Não foi possível concluir sua compra, mas ela foi registrada com status FAILED.`
      );
      return;
    }

    // Mensagem positiva apenas se o status for PENDING
    if (stats === "PENDING") {
      showSuccessMessage(
        `Seu pedido foi enviado com sucesso e está em processamento. 
        Assim que o pagamento for confirmado, seus créditos serão liberados automaticamente.`
      );
    }

    // Se quiser, pode adicionar outros status aqui (PAID, CANCELED, etc.)
  } catch (err: any) {
    console.error("Erro ao salvar compra:", err);
    showErrorMessage("Ocorreu um erro ao registrar sua compra. Tente novamente mais tarde.");
  }
}
 */


async function criarCompra(userId: string, paymentId: string, stats?: string) {
  try {
    // Normaliza o status antes de enviar para o backend
    const validStatuses = ["PENDING", "FAILED", "PAID"];
    const statusToSend =
      stats && validStatuses.includes(stats.toUpperCase())
        ? stats.toUpperCase()
        : "PENDING";

    // Chama o endpoint de salvar compra
    const response = await fetch("/api/internal/payments/savepay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, paymentId, stats: statusToSend }),
    });

    const data = await response.json();

    if (!data.success) {
      showErrorMessage(
        `Ocorreu um erro ao registrar sua compra. Tente novamente mais tarde.`
      );
      return;
    }

    // Mensagem de erro se o pagamento falhou
    if (statusToSend === "FAILED") {
      showErrorMessage(
        `Não foi possível concluir sua compra, mas ela foi registrada com status FAILED.`
      );
      return;
    }

    // Mensagem positiva apenas se o status for PENDING
    if (statusToSend === "PENDING") {
      showSuccessMessage(
        `Seu pedido foi enviado com sucesso e está em processamento. 
        Assim que o pagamento for confirmado, seus créditos serão liberados automaticamente.`
      );
      return;
    }

    // Opcional: outros status, ex: PAID
    if (statusToSend === "PAID") {
      showSuccessMessage(
        `Pagamento confirmado! Seus créditos já foram liberados.`
      );
    }
  } catch (err: any) {
    console.error("Erro ao salvar compra:", err);
    showErrorMessage(
      "Ocorreu um erro ao registrar sua compra. Tente novamente mais tarde."
    );
  }
}


  //compra por pix
  async function pixPay() {
    try {
      // 1️⃣ Criar a order
      const response = await fetch("/api/internal/payments/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: pixData.name,
            email: pixData.email,
            document: pixData.cpf,
            type: "individual",
            address: {
              street: pixData.rua,
              number: pixData.numero,
              neighborhood: pixData.bairro,
              city: pixData.cidade,
              state: pixData.estado,
              zipCode: pixData.cep,
            },
            phones: [{ countryCode: pixData.ddi, areaCode: pixData.ddd, number: pixData.numero }],
          },
          items: [
            {
              code: produto.codigo,
              title: produto.titulo,
              description: produto.descricao,
              unit_price: 2,//valor
              quantity: 1, //quantidade
            },
          ],
          payments: [
            {
              payment_method: "pix",
              pix: {
                expires_in: 3600, // 1 hora de validade
              },
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("🔹 data:", data);

      if (!data.success) {
        showErrorMessage("❌ Erro ao criar pagamento PIX:", data.error);
        return;
      }

      // 2️⃣ Pegar a primeira charge e a última transação
      const charge = data.order.charges?.[0];
      const lastTransaction:transctions = charge?.last_transaction;

      
      console.log("🔹 charge:", charge);
      console.log("🔹 lastTransaction:", lastTransaction);

      //salva a falha no pagamento
      if (lastTransaction.status==='failed') {
       showErrorMessage("Não foi possivel concluir seu pagamento, tente novamente mais tarde!");
       //não deve salvar esta salvando apenas por causa de testes
        criarCompra(userId, lastTransaction.id,'FAILED');
        return;
      }

      //salva o sucesso no pagamento
      if(lastTransaction.status==='pending'){
     showSuccessMessage("Pagamento enviado com sucesso!");
        criarCompra(userId, lastTransaction.id,'PENDING');
        return
      }

      // 3️⃣ Extrair dados do PIX
      const pixPayload = lastTransaction.qr_code; // BRCode (string copiável)
      const pixQrCodeUrl = lastTransaction.qr_code_url; // URL pronta (imagem no Pagar.me)

      // 4️⃣ (Opcional) Gerar imagem base64 localmente
      const qrCodeBase64 = await QRCode.toDataURL(pixPayload);
      // pixPayload é o BRCode do Pagar.me
      const brcodeBase64 = Buffer.from(pixPayload, "utf-8").toString("base64");

      console.log("✅ Payload PIX:", pixPayload);
      console.log("✅ Base64 do BRCode:", brcodeBase64);

   
      //enviar para pagina de pix
      router.push(`/credit/pix/${brcodeBase64}`);

      return {
        payload: pixPayload, 
        qrCodeUrl: pixQrCodeUrl,
        qrCodeBase64,
      };
    } catch (err: any) {
      showErrorMessage("❌ Erro ao criar pagamento PIX:", err.message || err); 
    
    }
    finally{
     onClose();
    }
  }




//compra poo credito
  async function creditPay() {
    try {
      const response = await fetch("/api/internal/payments/credit-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card_number: creditData.cardNumber,
          card_holder_name: creditData.holderName,
          card_expiration_date: creditData.expMonth + creditData.expYear, // MMYY
          card_cvv: creditData.cvv,
          customer: {
            name: creditData.name,
            email: creditData.email,
            document: creditData.cpf,
            type: "individual",
            address: {
              street: creditData.rua,
              number: creditData.numero,
              neighborhood: creditData.bairro,
              city: creditData.cidade,
              state: creditData.estado,
              zipCode: creditData.cep,
            },
            phones: [
              {
                countryCode: creditData.ddi,
                areaCode: creditData.ddd,
                number: creditData.telefone
              },
            ],
          },
          items: [
            { code: produto.codigo, title: produto.titulo, description: produto.descricao, unit_price: produto.preco, quantity: produto.quantidade },
          ],
        }),

      });

      const data = await response.json();

      if (response.ok) {
        showSuccessMessage("✅ Pagamento realizado com sucesso!");
        console.log("Pagamento aprovado:", data);
        clearFormFields()
        return data;
      } else {
        showErrorMessage("❌ Falha no pagamento: " + (data.message || "Erro desconhecido"));
        console.error("Erro no pagamento:", data);
        return null;
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      showErrorMessage("❌ Ocorreu um erro ao processar o pagamento.");
      return null;
    }
  }


  //pagamento credit cart
  const buyCredit = async () => {
    await creditPay()
    //chamar a api de pagamentos para gerenciar creditos
  }


  //pagamento pix
  const buyPix = async () => {
    await pixPay()
    //chamar a api de pagamentos para gerenciar creditos
  }



  return (
    <>
    
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fadeIn">
        {/* Cabeçalho */}
        <h2 className="text-2xl font-semibold text-black mb-6 text-center">
          💳 Realizar Pagamento
        </h2>

        {/* Seletor */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-black">
            Método de Pagamento
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as "pix" | "credit_card")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#127B42]"
          >
            <option value="pix">PIX</option>
            <option value="credit_card">Cartão de Crédito</option>
          </select>
        </div>

        {/* PIX */}
        {paymentMethod === "pix" && (
          <div className="mb-6 text-center">
            <p className="text-black text-sm">
              O pagamento será realizado via{"Pix"}
              {/* form do pix */}
              <div>
                <h3>Preencha os dados para o pagamento</h3>


                <form className="space-y-3 mt-4">

                  <input type="text"
                    value={pixData.name}
                    onChange={(e) => setPixData({ ...pixData, name: e.target.value })}
                    placeholder="Nome completo"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />

                  <input type="text"
                    value={pixData.cpf}
                    onChange={(e) => setPixData({ ...pixData, cpf: e.target.value })}
                    placeholder="CPF"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />

                  <input type="email"
                    value={pixData.email}
                    onChange={(e) => setPixData({ ...pixData, email: e.target.value })}
                    placeholder="E-mail"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={pixData.ddi}
                      onChange={(e) => setPixData({ ...pixData, ddi: e.target.value })}
                      placeholder="DDI"
                      className="w-20 border border-gray-300 rounded-lg p-3"
                      required
                    />
                    <input
                      type="text"
                      value={pixData.ddd}
                      onChange={(e) => setPixData({ ...pixData, ddd: e.target.value })}
                      placeholder="DDD"
                      className="w-20 border border-gray-300 rounded-lg p-3"
                      required
                    />
                    <input
                      type="text"
                      value={pixData.telefone}
                      onChange={(e) => setPixData({ ...pixData, telefone: e.target.value })}
                      placeholder="Telefone"
                      className="flex-1 border border-gray-300 rounded-lg p-3"
                      required
                    />
                  </div>

                  <input type="text"
                    value={pixData.cep}
                    onChange={(e) => setPixData({ ...pixData, cep: e.target.value })}
                    placeholder="CEP"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />

                  <input
                    type="text"
                    value={pixData.rua}
                    onChange={(e) => setPixData({ ...pixData, rua: e.target.value })}
                    placeholder="Rua"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />
                  <input
                    type="text"
                    value={pixData.numero}
                    onChange={(e) => setPixData({ ...pixData, numero: e.target.value })}
                    placeholder="Número"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />

                  <input
                    type="text"
                    value={pixData.bairro}
                    onChange={(e) => setPixData({ ...pixData, bairro: e.target.value })}
                    placeholder="Bairro"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />


                  <input
                    type="text"
                    value={pixData.cidade}
                    onChange={(e) => setPixData({ ...pixData, cidade: e.target.value })}
                    placeholder="Cidade"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />

                  <input
                    type="text"
                    value={pixData.estado}
                    onChange={(e) => setPixData({ ...pixData, estado: e.target.value })}
                    placeholder="Estado"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />

                </form>

                <div>



                </div>

              </div>

              <span className="font-semibold text-[#127B42]">PIX</span>.
              Após confirmar, um QR Code será gerado para finalização da compra.
            </p>
          </div>
        )}

        {/* Cartão */}
        {paymentMethod === "credit_card" && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium text-black">Dados Pessoais</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={creditData.name}
                onChange={(e) => setCreditData({ ...creditData, name: e.target.value })}
                placeholder="Nome"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <input
                type="text"
                value={creditData.cpf}
                onChange={(e) => setCreditData({ ...creditData, cpf: e.target.value })}
                placeholder="CPF"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <input
                type="text"
                value={creditData.email}
                onChange={(e) => setCreditData({ ...creditData, email: e.target.value })}
                placeholder="email"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              {/* Telefone separado em DDI, DDD e número */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={creditData.ddi}
                  onChange={(e) => setCreditData({ ...creditData, ddi: e.target.value })}
                  placeholder="DDI"
                  className="w-20 border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  value={creditData.ddd}
                  onChange={(e) => setCreditData({ ...creditData, ddd: e.target.value })}
                  placeholder="DDD"
                  className="w-20 border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  value={creditData.telefone}
                  onChange={(e) => setCreditData({ ...creditData, telefone: e.target.value })}
                  placeholder="Telefone"
                  className="flex-1 border border-gray-300 rounded-lg p-3"
                />
              </div>
            </div>

            <h3 className="text-lg font-medium text-black">Dados de Endereço</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={creditData.rua}
                onChange={(e) => setCreditData({ ...creditData, rua: e.target.value })}
                placeholder="Rua"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  value={creditData.numero}
                  onChange={(e) => setCreditData({ ...creditData, numero: e.target.value })}
                  placeholder="Número"
                  className="flex-1 border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  value={creditData.bairro}
                  onChange={(e) => setCreditData({ ...creditData, bairro: e.target.value })}
                  placeholder="Bairro"
                  className="flex-1 border border-gray-300 rounded-lg p-3"
                />
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={creditData.cidade}
                  onChange={(e) => setCreditData({ ...creditData, cidade: e.target.value })}
                  placeholder="Cidade"
                  className="flex-1 border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  value={creditData.estado}
                  onChange={(e) => setCreditData({ ...creditData, estado: e.target.value })}
                  placeholder="Estado"
                  className="w-24 border border-gray-300 rounded-lg p-3"
                />
              </div>

              <input
                type="text"
                value={creditData.cep}
                onChange={(e) => setCreditData({ ...creditData, cep: e.target.value })}
                placeholder="CEP"
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>

            <h3 className="text-lg font-medium text-black">Dados do Cartão</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={creditData.cardNumber}
                onChange={(e) => setCreditData({ ...creditData, cardNumber: e.target.value })}
                placeholder="Número do Cartão"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <input
                type="text"
                value={creditData.holderName}
                onChange={(e) => setCreditData({ ...creditData, holderName: e.target.value })}
                placeholder="Nome do Titular"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  value={creditData.expMonth}
                  onChange={(e) => setCreditData({ ...creditData, expMonth: e.target.value })}
                  placeholder="MM"
                  className="w-20 border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  value={creditData.expYear}
                  onChange={(e) => setCreditData({ ...creditData, expYear: e.target.value })}
                  placeholder="YYYY"
                  className="w-24 border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  value={creditData.cvv}
                  onChange={(e) => setCreditData({ ...creditData, cvv: e.target.value })}
                  placeholder="CVV"
                  className="flex-1 border border-gray-300 rounded-lg p-3"
                />
              </div>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-end gap-3 sticky bottom-0 bg-white pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black font-medium transition"
          >
            Cancelar
          </button>


          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-[#127B42] hover:bg-[#0f6134] text-white font-semibold transition"
          >
            Confirmar Pagamento
          </button>
        </div>
      </div>
    </div>
    </>

  );
}
