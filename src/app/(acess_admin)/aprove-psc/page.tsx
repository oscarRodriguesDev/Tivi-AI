'use client'
import { useState, useEffect } from "react";
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { Psicologo } from "../../../../types/psicologos";
import HeadPage from "@/app/protected-components/headPage";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc"; //connect
import { VscDebugDisconnect } from "react-icons/vsc"; //disonect
import { PiPlugsConnectedFill } from "react-icons/pi"; //connect
import { showErrorMessage, showInfoMessage, showSuccessMessage } from "@/app/util/messages";





const ListaPsicologos = () => {


  const { role, hasRole } = useAccessControl(); 
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);
  const [isAtivo, setAtivo] = useState<boolean>(false);






  /**
 * Busca a lista de psicólogos disponíveis no endpoint interno.
 * Define os estados de loading, error e psicólogos.
 * 
 * @returns {Promise<void>} - Função assíncrona sem retorno direto.
 */
  const fetchPsychologists = async () => {
    try {
      const response = await fetch("/api/internal/analize_psco");

      if (!response.ok) {
        throw new Error("Erro ao buscar psicólogos.");
      }

      const { data } = await response.json();

      if (Array.isArray(data)) {
        setPsicologos(data);
      } else {
        setError("Erro: dados recebidos estão em formato inválido.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  /**
   * useEffect busca os cadastros no banco de dados
   */
  useEffect(() => {
    fetchPsychologists();
  }, []);
  


 /**
  * Ativa o psicologo no sistema
  * @param cpf
  */
  const ativarPsicologo = async (cpf: string) => {
    try {
      const response = await fetch('/api/internal/analize_psco', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf }),
      });
  
      if (response.ok) {
        const data = await response.json();
        showSuccessMessage(data.message || 'Psicólogo habilitado com sucesso');
      } else {
        const errorData = await response.json();
        showErrorMessage(errorData.error || 'Erro ao habilitar psicólogo');
      }
    } catch (error) {
      showErrorMessage('Erro ao conectar com o servidor');
    }
  };
  


   
  const rejeitarPisicologo = (id: string) => {
    showInfoMessage(`um email informando a rejeição e informando o que deve ser feito: ${id}`);
   
  };

  return (
    <>

      <HeadPage title='Novas Solicitações' icon={<VscGitPullRequestGoToChanges size={20} />} />

      {role === 'ADMIN' ? (
        <div className="container">
          <h1 className="text-2xl font-bold">Lista de Psicólogos Cadastrados</h1>

          {loading && <p>Carregando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && psicologos.length === 0 && (
            <p>Nenhum psicólogo encontrado.</p>
          )}

          {/* Tabela de psicólogos */}
          {!loading && !error && psicologos.length > 0 && (
            <table className="table-auto w-full mt-4 border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b font-semibold">Nome</th>
                  <th className="py-3 px-6 border-b font-semibold">Sobrenome</th>
                  <th className="py-3 px-6 border-b font-semibold">CPF</th>
                  <th className="py-3 px-6 border-b font-semibold">CRP</th>
                  <th className="py-3 px-6 border-b font-semibold text-center">Ações</th>
                </tr>

              </thead>
              <tbody>
                {psicologos.map((psicologo) => (
                  <tr key={psicologo.id}>
                    <td className="border p-0 text-center leading-none whitespace-nowrap">{psicologo.nome}</td>
                    <td className="border p-0 text-center leading-none whitespace-nowrap">{psicologo.lastname}</td>
                    <td className="border p-0 text-center leading-none whitespace-nowrap">{psicologo.cpf}</td>
                    <td className="border p-0 text-center leading-none whitespace-nowrap">{psicologo.crp}</td>

                    <td className="border p-2 flex ">
                      <td className=" p-0 flex  w-full justify-between">

                        <button onClick={() => setAtivo(!isAtivo)}>
                          {isAtivo ? (
                            <PiPlugsConnectedFill color="green" size={25} />

                          ) : (
                            <VscDebugDisconnect color="red" size={25} />
                          )}
                        </button>
                        <button
                          onClick={() => ativarPsicologo(psicologo.cpf || '')}
                          disabled={!isAtivo}
                          className={`px-3 py-0 text-[12px]  rounded text-white font-semibold transition-all duration-200 ${isAtivo
                              ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                              : 'bg-gray-300 cursor-not-allowed opacity-60'
                            }`}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => ativarPsicologo(psicologo.cpf || '')}
                          disabled={!isAtivo}
                          className={`px-3 py-0 text-[12px] rounded text-white font-semibold transition-all duration-200 ${isAtivo
                              ?  'bg-gray-300 cursor-not-allowed opacity-60 '
                              : 'bg-red-500 hover:bg-red-600  cursor-pointer'
                            }`}
                        >
                          No Enable
                        </button>


                      </td>


                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      ) : (
        <div className="flex justify-center items-center h-screen">Essa pagina é acessivel apenas para administradores</div>
      )}


    </>

  );
};

export default ListaPsicologos;
