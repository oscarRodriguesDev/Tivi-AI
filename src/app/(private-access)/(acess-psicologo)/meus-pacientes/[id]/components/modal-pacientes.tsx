'use client'
import { useState, useEffect } from 'react'
import { showErrorMessage, showSuccessMessage } from "@/app/util/messages"
import { FaArrowUp } from 'react-icons/fa'
interface ModalPacientesProps {
  isOpen: boolean
  onClose: () => void
  paciente: any
}

export const ModalPacientes = ({ isOpen, onClose, paciente }: ModalPacientesProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    fantasy_name: '',
    idade: '',
    sintomas: '',
    telefone: '',
    convenio: '',
    sexo: '',
    cep: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    pais: '',
    complemento: '',
    estado: '',
    email: '',
    rg: '',
    cpf: ''
  })

  const[evolucao, setEvolucao] = useState<string>('')

  useEffect(() => {
    if (paciente) {
      setFormData({
        nome: paciente.nome || '',
        fantasy_name: paciente.fantasy_name || '',
        idade: paciente.idade || '',
        sintomas: paciente.sintomas || '',
        telefone: paciente.telefone || '',
        convenio: paciente.convenio || '',
        sexo: paciente.sexo || '',
        cep: paciente.cep || '',
        cidade: paciente.cidade || '',
        bairro: paciente.bairro || '',
        rua: paciente.rua || '',
        numero: paciente.numero || '',
        pais: paciente.pais || '',
        complemento: paciente.complemento || '',
        estado: paciente.estado || '',
        email: paciente.email || '',
        rg: paciente.rg || '',
        cpf: paciente.cpf
      })
    }
  }, [paciente])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/internal/register_pacientes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: paciente.id,
          ...formData
        }),
      })

      if (response.ok) {
        showSuccessMessage('Paciente atualizado com sucesso!')
        window.location.reload()
        // onClose()
      } else {
        const data = await response.json()
        showErrorMessage(`Erro ao atualizar paciente: ${data.error}`)
      }
    } catch (error) {
      showErrorMessage('Erro ao atualizar paciente. Tente novamente mais tarde.')
    }
  }


  const handleEvolution = async () => {
  const date = new Date();

  const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
 

  
  try {
    const response = await fetch('/api/internal/prontuario', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pacienteId: paciente.id,
        evolucao: `${formattedDate}: ${evolucao}\n`
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao enviar evolução:', errorData);
      showErrorMessage('Ocorreu um erro ao tentar registrar a evolução. Tente novamente mais tarde.');
      return;
    }

    const data = await response.json();
    console.log('Evolução salva com sucesso:', data);
    showSuccessMessage('Evolução registrada com sucesso!');
    setEvolucao('');

  } catch (error) {
    console.error('Erro inesperado ao enviar evolução:', error);
    showErrorMessage('Erro ao enviar evolução. Tente novamente mais tarde.');
  }
};



  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-[80%] h-[80%] max-w-none max-h-none flex flex-col shadow-lg">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-2xl font-semibold text-gray-800">Editar Paciente</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Fechar modal"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* Formulário com scroll */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto space-y-6 pr-2"
          >
            {/* Grid de inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Primeira seção */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
                <input
                  type="text"
                  name="fantasy_name"
                  value={formData.fantasy_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Continue o padrão para os demais campos */}
              <div>
                <label className="block text-sm font-medium text-gray-700">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">RG</label>
                <input
                  type="text"
                  name="rg"
                  value={formData.rg}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Convênio</label>
                <input
                  type="text"
                  name="convenio"
                  value={formData.convenio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sintomas</label>
                <input
                  type="text"
                  name="sintomas"
                  value={formData.sintomas}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">CEP</label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rua</label>
                <input
                  type="text"
                  name="rua"
                  value={formData.rua}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número</label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">País</label>
                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* evolução do paciente */}
            <div className="relative w-full">
              <textarea
                id="evolucao"
                name="evolucao"
                value={evolucao}
                onChange={(e)=>setEvolucao(e.target.value)}
                placeholder="Digite aqui a evolução observada do paciente..."
                            className="
                  resize-y
                  min-h-[50px]
                  w-full
                  rounded-xl
                  border-2 border-[#117F43]
                  bg-[#fff]
                  p-5 pr-14 pb-14
                  text-[#000]
                  shadow-lg
                  focus:border-[#117F43]
                  focus:ring-2 focus:ring-[#117F43]
                  transition duration-300
                  font-medium
                  placeholder:text-[#117F43]/70
                  sm:text-base
                "
              />

              {/* Botão enviar no canto inferior direito */}
              <button
                type="button"
                className="
                  absolute bottom-4 right-4
                  bg-[#117F43] hover:bg-[#0f6e3c]
                  text-white p-2 rounded-full
                  shadow-md transition duration-300
                  focus:outline-none focus:ring-2 focus:ring-[#117F43]
                "
                title="Enviar"
                onClick={()=>{
                  handleEvolution();
                }}
              >
               Registrar
              </button>
            </div>

            {/* prompt direto */}
            <div className="relative w-full mt-6">
              <textarea
                id="promptDireto"
                name="promptDireto"
                placeholder="Digite aqui o prompt para a IA analisar o prontuário do paciente..."
                className="
                  resize-y
                  min-h-[50px]
                  w-full
                  rounded-xl
                  border-2 border-[#117F43]
                  bg-[#fff]
                  p-5 pr-14 pb-14
                  text-[#000]
                  shadow-lg
                  focus:border-[#117F43]
                  focus:ring-2 focus:ring-[#117F43]
                  transition duration-300
                  font-medium
                  placeholder:text-[#117F43]/70
                  sm:text-base
                "
              />

              {/* Botão enviar no canto inferior direito */}
              <button
                type="submit"
                className="
                  absolute bottom-4 right-4
                  bg-[#117F43] hover:bg-[#0f6e3c]
                  text-white p-2 rounded-full
                  shadow-md transition duration-300
                  focus:outline-none focus:ring-2 focus:ring-[#117F43]
                "
                title="Enviar"
              >
                <FaArrowUp className="text-lg" />
              </button>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </>

  )

}
