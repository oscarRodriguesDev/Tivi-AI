'use client'

import { showErrorMessage, showInfoMessage } from "@/app/util/messages";
import { ReactEventHandler, useState } from "react";

const RecuperarSenha = () => {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

// Função para enviar a solicitação de recuperação de acesso
async function solicitarAcesso(email: string) {
  try {
    // Verificar se o e-mail não está vazio
    if (!email) {
      showErrorMessage("Por favor, forneça um e-mail válido.");
      return;
    }

    // Fazer a requisição para a rota de recuperação de senha
    const response = await fetch('/api/recupera-senha', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    // Verificar se a resposta foi bem-sucedida
    if (response.ok) {
      // Sucesso: exibir uma mensagem ao usuário
      showInfoMessage('Se o e-mail for válido, você receberá uma nova senha em breve.');
    } else {
      // Se o email não for encontrado, nada será mostrado
      // Então não informamos nada ao usuário (comportamento esperado)
    }
  } catch (error) {
   
    showErrorMessage("Ocorreu um erro ao tentar recuperar sua senha. Tente novamente mais tarde.");
  }
}



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  await solicitarAcesso(email);
  setLoading(false);
};

  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
            Recuperação de Senha
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Digite o seu e-mail do tiviai e você irá receber o uma senha provisória para acessar a plataforma.
          </p>
  
          <form onSubmit={handleSubmit} method={'PUT'}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu e-mail"
                required
              />
            </div>
  
            <button
              type="submit"
              
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            >
              Enviar acesso provisório
            </button>
          </form>
  
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Lembrou sua senha?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Voltar para o login
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default RecuperarSenha;
  