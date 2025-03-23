'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { useRouter } from "next/navigation"; // Para redirecionamento
import { FaCalendarAlt, FaInfoCircle, FaHome, FaPhone, FaExclamationTriangle } from 'react-icons/fa';
import { ChangeEvent, useState } from "react";
import { useParams } from "next/navigation";
import { Paciente } from "../../../../../types/paciente";


const Pacientes = () => {
  const {psc} = useParams()
  const[userId,setUserId]=useState<string>(String(psc))
  const[nome,setNome]=useState<string>('')
  const[cpf,setCpf]=useState<string>('')
  const[nick,setNick]=useState<string>('')
  const[idade,setIdade]=useState<string>('')
  const[sintomas,setSinomas]=useState<string>('')
  const[telefone,setTelefone]=useState<string>('')
  const[convenio,setConvenio]=useState<string>('')

  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
  const router = useRouter();
  




return(
    <>
    {/*role === 'PSYCHOLOGIST'  é a avaliação correta */}
    {role !== 'PSYCHOLOGIST' ? ( 
        <div className="relative w-full max-w-screen-xl h-auto bg-white p-5">
              {/* Header */}
              <div className="w-full h-16 bg-[#F9FAFC] border border-[#D9D9D9] rounded-lg flex items-center px-4 mb-8">
                  <FaCalendarAlt className="text-black text-2xl mr-4" />
                  <h1 className="text-black font-extrabold text-2xl">Novo Paciente</h1>
              </div>
          
              {/* Informações Section */}
              <div className="mb-8">
                  <div className="flex items-center mb-4">
                      <FaInfoCircle className="text-black text-xl mr-4" />
                      <h2 className="text-black font-semibold text-lg">Informações</h2>
                  </div>
                  <hr className="border-t border-[#0b0404] mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                          <label className="block text-black text-sm mb-1">Psicologo:</label>
                          <input
                           type="text" 
                           value={userId} className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" 
                            disabled={true}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
                             readOnly />
                      </div>
          
                      <div>
                          <label className="block text-black text-sm mb-1">CPF:</label>
                          <input
                           type="text"
                            className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1"
                            value={cpf}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)}
                            required
                            />
                      </div>
          
                      <div>
                          <label className="block text-black text-sm mb-1">Sexo:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
          
                      <div className="col-span-2 lg:col-span-3">
                          <label className="block text-black text-sm mb-1">Nome:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
          
                      <div>
                          <label className="block text-black text-sm mb-1">RG:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
          
                      <div>
                          <label className="block text-black text-sm mb-1">Data de Nascimento:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
          
                      <div>
                          <label className="block text-black text-sm mb-1">Naturalidade:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
                  </div>
              </div>
          
              {/* Endereço Section */}
              <div className="mb-8">
                  <div className="flex items-center mb-4">
                      <FaHome className="text-black text-xl mr-4" />
                      <h2 className="text-black font-semibold text-lg">Endereço</h2>
                  </div>
                  <hr className="border-t border-[#D9D9D9] mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                          <label className="block text-black text-sm mb-1">CEP:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
          
                      <div className="col-span-2">
                          <label className="block text-black text-sm mb-1">Rua:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
          
                      <div>
                          <label className="block text-black text-sm mb-1">Estado:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
          
                      <div>
                          <label className="block text-black text-sm mb-1">Cidade:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
          
                      <div>
                          <label className="block text-black text-sm mb-1">Número:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
          
                      <div className="col-span-2">
                          <label className="block text-black text-sm mb-1">Complemento:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
                  </div>
              </div>
          
              {/* Contato Section */}
              <div>
                  <div className="flex items-center mb-4">
                      <FaPhone className="text-black text-xl mr-4" />
                      <h2 className="text-black font-semibold text-lg">Contato</h2>
                  </div>
                  <hr className="border-t border-[#D9D9D9] mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="col-span-3">
                          <label className="block text-black text-sm mb-1">Email:</label>
                          <input type="text" className="w-full h-[30px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-1" />
                      </div>
                  </div>
              </div>
      
              {/*Section de botoes salvar e cancelar */}
      
              <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-2 bg-gray-300 text-black font-semibold rounded-lg border border-[#D9D9D9] hover:bg-gray-400">
              Cancelar
          </button>
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg border border-[#D9D9D9] hover:bg-blue-600">
              Salvar
          </button>
      </div>
      
          </div>
    ) : (
      <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para psicologos</div>
    )}
  </>
  
)
 
}
export default Pacientes;