'use client'

import { useAccessControl } from "@/app/context/AcessControl";
import { showInfoMessage } from "@/app/util/messages";
import { useState, ChangeEvent } from "react";
import { CgProfile } from "react-icons/cg";
import HeadPage from "@/app/protected-components/headPage";
import { useParams } from "next/navigation";
import { Paciente } from "../../../../../types/paciente";

interface Props {
  paciente?: Paciente;
}

const pacienteMock: Paciente = {
  id: "1a2b3c4d",
  nome: "Maria Silva",
  cpf: "123.456.789-00",
  fantasy_name: "Maria Psicóloga",
  idade: "35",
  sintomas: "Ansiedade, insônia",
  telefone: "(11) 99999-9999",
  convenio: "Unimed",
  sexo: "Feminino",
  cep: "01234-567",
  cidade: "São Paulo",
  bairro: "Centro",
  rua: "Rua das Flores",
  numero: "123",
  pais: "Brasil",
  complemento: "Apto 45",
  estado: "SP",
  email: "maria.silva@email.com",
  rg: "12.345.678-9",
  psicologoId: '',
};

const labels: Record<keyof Paciente, string> = {
  id: "ID",
  nome: "Nome",
  cpf: "CPF",
  fantasy_name: "Nome Fantasia",
  idade: "Idade",
  sintomas: "Sintomas",
  telefone: "Telefone",
  convenio: "Convênio",
  sexo: "Sexo",
  cep: "CEP",
  cidade: "Cidade",
  bairro: "Bairro",
  rua: "Rua",
  numero: "Número",
  pais: "País",
  complemento: "Complemento",
  estado: "Estado",
  email: "Email",
  rg: "RG",
  psicologoId: "ID Psicólogo",
};

export default function PerfilPaciente({ paciente }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Paciente>(paciente ?? pacienteMock);

  const params = useParams();
  const id = params.id as string | undefined;

  const { role } = useAccessControl();

  const dadosPessoaisFields: (keyof Paciente)[] = [
    "nome",
    "cpf",
    "rg",
    "sexo",
    "idade",
    "fantasy_name",
    "psicologoId", // corrigido aqui
    "convenio",
    "sintomas",
  ];

  const contatoFields: (keyof Paciente)[] = ["telefone", "email"];

  const enderecoFields: (keyof Paciente)[] = [
    "cep",
    "cidade",
    "bairro",
    "rua",
    "numero",
    "pais",
    "complemento",
    "estado",
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    showInfoMessage("Dados salvos!");
    setEditMode(false);
    // aqui você pode incluir chamada para API salvar os dados no backend
  };

  const handleCancel = () => {
    setFormData(paciente ?? pacienteMock);
    setEditMode(false);
  };

  return (
    <>
      <HeadPage title={formData.nome ?? "Paciente"} icon={<CgProfile size={20} />} />
      <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Perfil do Paciente</h2>

          {/* Dados Pessoais */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dadosPessoaisFields.map((field) => (
                <div key={field} className="flex flex-col">
                  <label
                    htmlFor={field}
                    className="text-sm font-medium text-gray-700 capitalize"
                  >
                    {labels[field]}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field] ?? ""}
                    onChange={handleChange}
                    readOnly={!editMode || field === "cpf" || field === "id"}
                    className={`mt-1 p-2 border rounded-md ${
                      editMode && field !== "cpf" && field !== "id"
                        ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-100 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Contato */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contatoFields.map((field) => (
                <div key={field} className="flex flex-col">
                  <label
                    htmlFor={field}
                    className="text-sm font-medium text-gray-700 capitalize"
                  >
                    {labels[field]}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field] ?? ""}
                    onChange={handleChange}
                    readOnly={!editMode}
                    className={`mt-1 p-2 border rounded-md ${
                      editMode
                        ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-100 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Endereço */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {enderecoFields.map((field) => (
                <div key={field} className="flex flex-col">
                  <label
                    htmlFor={field}
                    className="text-sm font-medium text-gray-700 capitalize"
                  >
                    {labels[field]}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field] ?? ""}
                    onChange={handleChange}
                    readOnly={!editMode}
                    className={`mt-1 p-2 border rounded-md ${
                      editMode
                        ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-100 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-center gap-6">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
