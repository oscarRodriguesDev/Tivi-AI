"use client";
import { useState } from "react";

export default function CadastroPsicologo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
  });

  const [loading, setLoading] = useState(false);

  // Captura os valores dos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar os dados para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Verifica se as senhas coincidem antes de enviar
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register_psicologos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Psicólogo cadastrado com sucesso!");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          specialty: "",
          licenseNumber: "",
        });
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (error) {
      alert("Erro ao cadastrar psicólogo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Cadastro de Psicólogo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} className="input-style" required />
        <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} className="input-style" required />
        <input type="password" name="password" placeholder="Senha" value={formData.password} onChange={handleChange} className="input-style" required />
        <input type="password" name="confirmPassword" placeholder="Confirmar Senha" value={formData.confirmPassword} onChange={handleChange} className="input-style" required />
        <input type="text" name="phone" placeholder="Telefone" value={formData.phone} onChange={handleChange} className="input-style" required />
        <input type="text" name="specialty" placeholder="Especialização" value={formData.specialty} onChange={handleChange} className="input-style" required />
        <input type="text" name="licenseNumber" placeholder="Registro Profissional" value={formData.licenseNumber} onChange={handleChange} className="input-style" required />

        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded w-full" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Psicólogo"}
        </button>
      </form>
    </div>
  );
}
