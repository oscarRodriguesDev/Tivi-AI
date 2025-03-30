'use client'
import { useState, useEffect } from "react";
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { Psicologo } from "../../../../types/psicologos";
import HeadPage from "../components/headPage";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";




const ListaPsicologos = () => {

  const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto

  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);  // Estado para armazenar psicólogos
  const [loading, setLoading] = useState<boolean>(true);  // Estado de carregamento
  const [error, setError] = useState<string | null>(null);  // Estado para armazenar erros

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
          setPsicologos(data.data);  // Armazenando os psicólogos no estado
      
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
        console.log('Psicólogo habilitado com sucesso',data);
        
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
    console.log(`Rejeitar cadastro do psicólogo com ID: ${id}`);
  };

  return (
    <>

    <HeadPage title='Novas Solicitações' icon={<VscGitPullRequestGoToChanges size={20}/>}/>

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
                <tr>
                  <th className="border p-2">Nome</th>
                  <th className="border p-2">CPF</th>
                  <th className="border p-2">CFP</th>
                  <th className="border p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {psicologos.map((psicologo) => (
                  <tr key={psicologo.id}>
                    <td className="border p-2">{psicologo.name}</td>
                    <td className="border p-2">{psicologo.cfp}</td>
                    <td className="border p-2">{psicologo.cfp}</td>
                    <td className="border p-2">{psicologo.first_acess}</td>
                    <td className="border p-2 flex space-x-2">
                      <button
                        onClick={() => habilitarPsicologo(psicologo.cfp||'')}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Habilitar Psicólogo
                      </button>
                      <button
                        onClick={() => rejeitarCadastro(psicologo.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Rejeitar Cadastro
                      </button>
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
