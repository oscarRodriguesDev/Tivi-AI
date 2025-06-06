"use client";
import { useState } from "react";
import HeadPage from "@/app/protected-components/headPage";
import { FaUserCheck } from "react-icons/fa";
import { useAccessControl } from "@/app/context/AcessControl";
import { showErrorMessage, showSuccessMessage } from "@/app/util/messages";

export default function CadastroAdmin() {

  /**
   * useState para definição do perfil que esta sendo criado
   */
  const [formData, setFormData] = useState({
    name: "", 
    email: "",
    password: "", 
    confirmPassword: "", 
    role: "ADMIN", 
  });

  const [loading, setLoading] = useState(false);
  const { role, hasRole } = useAccessControl(); 


/**
 * captura os valores dos campos de texto
 */
const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = event.target;

  if (!name) {
    console.warn('Input sem atributo "name" ignorado.');
    return;
  }
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

/**
 * apenas limpa os campos para um novo cadastro
 */
const resetForm = () => {
  setFormData({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ADMIN", // padrão
  });
};




/**
 * função envia os dados para o backend
 * @param event
 * @return promise void
 */
const handleSubmit = async (event: React.FormEvent): Promise<void> => {
  event.preventDefault();
  setLoading(true);
  const payload = { ...formData };
  try {
    const response = await fetch("/api/internal/register_admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.ok) {
      showSuccessMessage("Usuário cadastrado com sucesso!");
      resetForm(); // função separada para reset
    } else {
      showErrorMessage(data.message || "Erro ao cadastrar usuário.");
    }
  } catch (error) {
    showErrorMessage("Erro ao conectar com o servidor.");
  } finally {
    setLoading(false);
  }
};




  return (
    <>
      <HeadPage title="Novo Administrador" icon={<FaUserCheck size={20} />} />
      {role === 'ADMIN' ? (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Cadastro de Usuário</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={formData.name}
              onChange={handleChange}
              className="input-style"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="input-style"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              className="input-style"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-style"
              required
            />

            {/* Campo de seleção para o tipo de usuário */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-style"
              required
            >
              <option value="ADMIN">Administrador</option>
              <option value="PSYCHOLOGIST">Psicólogo</option>
              <option value="COMMON">Comum</option>
            </select>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded w-full"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar Usuário"}
            </button>
          </form>
        </div>
      ) : (

        <div>
          <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md ">
            <h3>Acesso apenas para Admins</h3>
          </div>
        </div>

      )}

    </>
  );
}
