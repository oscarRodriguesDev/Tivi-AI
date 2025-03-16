"use client";
import { useState } from "react";

export default function CadastroPaciente() {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    telefone: "",
    cpf: "",
    sintomas: "",
    fantasy_name: "",
    psicoloId: "",
    convenio: ""
  });

  const [loading, setLoading] = useState(false);

  // Função para capturar os valores dos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar os dados para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Convertendo idade para número
    const idadeNumber = parseInt(formData.idade, 10);
    if (isNaN(idadeNumber) || idadeNumber <= 0) {
      alert("Idade inválida.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register_pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          idade: idadeNumber, // Convertido para número
          telefone: formData.telefone,
          sintomas: formData.sintomas,
          fantasy_name: formData.fantasy_name,
          psicoloId: formData.psicoloId,
          convenio: formData.convenio
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Paciente cadastrado com sucesso!");
        setFormData({
          nome: "",
          idade: "",
          telefone: "",
          cpf: "",
          sintomas: "",
          fantasy_name: "",
          psicoloId: "",
          convenio: ""
        });
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert("Erro ao cadastrar paciente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Cadastro de Paciente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleChange}
          className="input-style"
          required
        />
        <input
          type="number"
          name="idade"
          placeholder="Idade"
          value={formData.idade}
          onChange={handleChange}
          className="input-style"
          required
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={formData.telefone}
          onChange={handleChange}
          className="input-style"
          required
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={formData.cpf}
          onChange={handleChange}
          className="input-style"
          required
        />

        <input
          type="text"
          name="fantasy_name"
          placeholder="Fantasy Name"
          value={formData.fantasy_name}
          onChange={handleChange}
          className="input-style"
          required
        />

        <input
          type="text"
          name="psicoloId"
          placeholder="Medico Psicologo"
          value={formData.psicoloId} //esse id não vai pegar por campo de texto e sim pelo perfil de quem esta cadastrando
          onChange={handleChange}
          className="input-style"
          required
        />

        <input
          type="text"
          name="convenio"
          placeholder="Convenio"
          value={formData.convenio}
          onChange={handleChange}
          className="input-style"
          required
        />




        <textarea
          name="sintomas"
          placeholder="Sintomas"
          value={formData.sintomas}
          onChange={handleChange}
          className="input-style"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar Paciente"}
        </button>
      </form>
    </div>
  );
}
