'use client'
import { useState, useEffect } from "react";
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { Psicologo } from "../../../../types/psicologos";
import HeadPage from "@/app/protected-components/headPage";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc"; //connect
import { VscDebugDisconnect } from "react-icons/vsc"; //disonect
import { PiPlugsConnectedFill } from "react-icons/pi"; //connect





const ListaPsicologos = () => {


  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto

  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);  // Estado para armazenar psicólogos
  const [loading, setLoading] = useState<boolean>(true);  // Estado de carregamento
  const [error, setError] = useState<string | null>(null);  // Estado para armazenar erros
  const [habilitado, setHabilitado] = useState<boolean>(false);

  // Função que vai buscar os psicólogos na API
  useEffect(() => {
    const fetchPsicologos = async () => {
      try {

        const response = await fetch("/api/analize_psco"); // Rota GET para buscar psicólogos

        if (!response.ok) {
          throw new Error("Erro ao buscar psicólogos.");
        }

        const data = await response.json();


        // Verificando se os dados retornados são um array e atualizando o estado
        if (Array.isArray(data.data)) {
          setPsicologos(data.data);
          //setHabilitado(data.data.first_acess); // Armazenando os psicólogos no estado

        } else {
          setError("Erro: Dados recebidos não são válidos.");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro desconhecido.");
      } finally {
        setLoading(false);  // Após a requisição, setar o carregamento como false
      }
    };

    fetchPsicologos();
  }, []);  // A dependência vazia garante que a requisição seja feita uma vez na montagem do componente


  //habilitando o psicologo
  const habilitarPsicologo = async (cpf: string) => {
    try {
      console.log(`Habilitar psicólogo com CPF: ${cpf}`);

      // Envia uma requisição PUT para a API, passando o CPF no corpo da requisição
      const response = await fetch('/api/analize_psco', {
        method: 'PUT', // Método de requisição PUT
        headers: {
          'Content-Type': 'application/json', // Definir o tipo de conteúdo como JSON
        },
        body: JSON.stringify({ cpf }), // Envia o CPF como parte do corpo da requisição
      });

      // Verifica se a resposta da requisição foi bem-sucedida

      if (response.ok) {
        const data = await response.json(); // A resposta será convertida para JSON
        console.log('Psicólogo habilitado com sucesso', data);

        alert(data.message || 'Psicólogo habilitado com sucesso');
      } else {
        const errorData = await response.json();
        console.error('Erro ao habilitar psicólogo:', errorData);
        alert(errorData.error || 'Erro ao habilitar psicólogo');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao conectar com o servidor');
    }
  };


  // Função para "Rejeitar Cadastro" (exemplo de implementação)
  const rejeitarCadastro = (id: string) => {
    alert(`Rejeitar cadastro do psicólogo com ID: ${id}`);
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

                        <button onClick={() => setHabilitado(!habilitado)}>
                          {habilitado ? (
                            <PiPlugsConnectedFill color="green" size={25} />

                          ) : (
                            <VscDebugDisconnect color="red" size={25} />
                          )}
                        </button>
                        <button
                          onClick={() => habilitarPsicologo(psicologo.cpf || '')}
                          disabled={!habilitado}
                          className={`px-3 py-0 text-[12px]  rounded text-white font-semibold transition-all duration-200 ${habilitado
                              ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                              : 'bg-gray-300 cursor-not-allowed opacity-60'
                            }`}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => habilitarPsicologo(psicologo.cpf || '')}
                          disabled={!habilitado}
                          className={`px-3 py-0 text-[12px] rounded text-white font-semibold transition-all duration-200 ${habilitado
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
