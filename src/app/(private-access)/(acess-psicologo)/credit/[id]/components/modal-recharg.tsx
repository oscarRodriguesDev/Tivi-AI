import { showErrorMessage, showInfoMessage, showSuccessMessage } from "@/app/util/messages";
import { useState } from "react";
import { CreditCardData, Produto } from "../../../../../../../types/paymentsTypes";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto

};



type PixData = Record<string, any>; // se quiser campos extras futuramente

export default function PaymentModal({ isOpen, onClose, produto }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");
  const [pixData, setPixData] = useState<PixData>({});
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



  if (!isOpen) return null;

  const handleSubmit = () => {
    if (paymentMethod === "pix") {
      //handleAdicionarPix()
   
    } else {
    
      handleAdicionarCreditos()
    }
  };


  // Função para limpar todos os campos do formulário e garantir que não haja cache dos dados digitados
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



  //pagamento pix
  async function createPixPayment() {
    try {
      const response = await fetch('/api/internal/payments/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: "João Silva",
            email: "joao@test.com",
            document: "12345678900",
            type: "individual",
            address: {
              street: "Rua A",
              number: "123",
              neighborhood: "Bairro Teste",
              city: "São Paulo",
              state: "SP",
              zipCode: "01001000"
            },
            phones: [
              { countryCode: "55", areaCode: "11", number: "999999999" }
            ]
          },
          items: [
            { code: "001", title: "Produto Teste", description: "Descrição do produto", unit_price: 1000, quantity: 1 }
          ]
        })
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Erro ao criar pagamento PIX:', data.error);
        return;
      }

      const payment = data.order.payments?.[0]; // protege se payments existir
      const pix = payment?.pix; // protege se pix existir

      if (!pix) {
        console.error("Não foi possível obter os dados do PIX da order:", data.order);
        return;
      }

      console.log("QR Code Base64:", pix.qr_code);
      console.log("Payload do PIX:", pix.qr_code_payload);



    } catch (err) {
      console.error('Erro ao chamar API PIX:', err);
    }
  }




  async function createPaymentCreditCard() {
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
  const handleAdicionarCreditos = async () => {
    await createPaymentCreditCard()
    //chamar a api de pagamentos para gerenciar creditos
  }

  //pagamento pix
  const handleAdicionarPix = async () => {
    await createPixPayment()
    //chamar a api de pagamentos para gerenciar creditos
  }



  return (
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
          O pagamento será realizado via{" "}
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

  );
}
