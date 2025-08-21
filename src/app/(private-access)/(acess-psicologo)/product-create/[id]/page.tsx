'use client'
import React, { use, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PlanosTable from "../components/planos";

type Produto = {
    codigo: string;
    titulo: string;
    descricao: string;
    valorUn: number;
    preco: number;
    quantidade: number;
};

const ProductCreatePage: React.FC = () => {
  const [atualizar,setAtualizar]=useState<boolean>(false);

    const [produto, setProduto] = useState<Produto>({
        codigo: "",
        titulo: "",
        descricao: "",
        valorUn: 0.0,
        preco: 0,
        quantidade: 1,
    });

    const [valorCredito, setValorCredito] = useState<number>(2.5); // valor padrão de cada crédito
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduto((prev) => ({
            ...prev,
            [name]: name === "preco" || name === "quantidade" ? Number(value) : value,
        }));
    };

    const handleValorCreditoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValorCredito(Number(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);


        try {
            // Monta os dados do produto com o preço calculado
            const produtoData: Produto = {
                ...produto,
                valorUn: valorCredito,
                preco: produto.quantidade * valorCredito,
            };

            const response = await fetch("/api/internal/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(produtoData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao salvar produto");
            }

            const data = await response.json();
            setMensagem("✅ Produto criado com sucesso!");
            console.log("Produto salvo:", data);

               setAtualizar(true)

        } catch (error: any) {
            setMensagem("❌ " + (error.message || "Erro ao salvar produto"));
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="max-w-7xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Novo Produto de Créditos</h1>
      
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulário */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 space-y-5 bg-gray-50 p-6 rounded-xl shadow-sm"
          >
            <div>
              <label className="block font-semibold mb-1">Código do Produto</label>
              <input
                type="text"
                name="codigo"
                value={produto.codigo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Ex: CRED-001"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Título</label>
              <input
                type="text"
                name="titulo"
                value={produto.titulo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Ex: Pacote de Créditos"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Descrição</label>
              <textarea
                name="descricao"
                value={produto.descricao}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Descreva o produto"
                rows={3}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Quantidade de Créditos</label>
              <input
                type="number"
                name="quantidade"
                value={produto.quantidade}
                onChange={handleChange}
                min={1}
                required
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Ex: 10"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Valor de cada Crédito (R$)</label>
              <input
                type="number"
                step="0.01"
                min={0.01}
                value={valorCredito}
                onChange={handleValorCreditoChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Ex: 2.50"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Preço Total (R$)</label>
              <input
                type="number"
                name="preco"
                value={produto.quantidade * valorCredito}
                readOnly
                className="w-full border border-gray-200 rounded-lg p-3 bg-gray-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#127B42] hover:bg-[#0f6134] text-white font-semibold transition"
            >
              {loading ? "Salvando..." : "Criar Produto"}
            </button>
            {mensagem && (
              <div
                className={`mt-3 text-center font-medium ${
                  mensagem.includes("sucesso") ? "text-green-600" : "text-red-600"
                }`}
              >
                {mensagem}
              </div>
            )}
          </form>
      
          {/* Tabela de Planos Existentes */}
          <div className="flex-1 bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Planos Existentes</h3>
            <PlanosTable
            load={atualizar}
            />
          </div>
        </div>
      </div>
      
    );
};

export default ProductCreatePage;
