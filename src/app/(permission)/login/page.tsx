"use client";



/**
 * Importações utilizadas para autenticação, gerenciamento de estado e interface do usuário:
 * 
 * - `signIn`, `useSession` (next-auth/react):
 *    Funções e hooks para autenticação e gerenciamento de sessão.
 * 
 * - `useState`, `useEffect` (react):
 *    Hooks do React para gerenciamento de estado local e efeitos colaterais.
 * 
 * - `redirect`, `useRouter` (next/navigation):
 *    Funções e hooks para navegação programática e redirecionamento.
 * 
 * - `FaEye`, `FaEyeSlash` (react-icons/fa):
 *    Componentes de ícones para mostrar/ocultar senha.
 * 
 * - `Image` (next/image):
 *    Componente otimizado para renderização de imagens.
 * 
 * - `Logo`:
 *    Importação do arquivo de logo da aplicação.
 * 
 * - `Link` (next/link):
 *    Componente para navegação declarativa.
 * 
 * - `KeyboardEvent` (react):
 *    Tipo para eventos de teclado.
 */


import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import Logo from '../../../../public/marca/logo.png'
import Link from "next/link";
import { KeyboardEvent } from 'react';
import { showErrorMessage } from "@/app/util/messages";



 /**
  * Esta pagina serve para permitir login do usuaio utilizando emaile senha
  *  */ 
export default function LoginPage() {
  /**
   * Estados do componente de login:
   * 
   * @param {string} email - Estado para armazenar o email do usuário durante o login
   * @param {string} password - Estado para armazenar a senha do usuário durante o login
   * @param {boolean} showPassword - Estado para controlar a visibilidade da senha no campo de input
   * @param {string} aviso - Estado para armazenar mensagens de erro ou avisos durante o processo de login
   * 
   * @example
   * // Exemplo de uso dos estados
   * setEmail("usuario@exemplo.com");
   * setPassword("senha123");
   * setShowPassword(true);
   * setAviso("Credenciais inválidas");
   */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const session = useSession()
  const [showPassword, setShowPassword] = useState(false);
  const [aviso, setAviso] = useState('')

 


  /**
   * Função assíncrona que gerencia o processo de login do usuário.
   * 
   * Esta função utiliza o método `signIn` do NextAuth para autenticar o usuário
   * com as credenciais fornecidas (email e senha). Em caso de sucesso, o usuário
   * é redirecionado para a página comum. Em caso de falha, uma mensagem de erro
   * é exibida e o campo de senha é limpo.
   * 
   * @async
   * @function handleLogin
   * @throws {Error} Lança um erro se as credenciais forem inválidas
   * @example
   * // Exemplo de uso
   * await handleLogin();
   * 
   * @returns {Promise<void>} Uma Promise que resolve quando o processo de login é concluído
   */
  const handleLogin = async () => {
    

    try {
      const result = await signIn("credentials", { email, password, callbackUrl: `/common-page`, redirect: true });
    

      if (result?.error) {

        //experimental
        showErrorMessage(result?.error);
        setPassword('')
        setEmail("");
        console.log('erro na pagina de login')
        throw new Error(result.error);
      
      }

      // Se não houver erro, o usuário será redirecionado automaticamente pelo NextAuth
    } catch (error) {
      setAviso('Usuário ou senha incorretos')
      setPassword(""); // Limpa a senha, mantendo o email
    }
  };


  
  /**
   * Efeito que gerencia o redirecionamento do usuário com base no status da sessão.
   * 
   * Este efeito monitora o status da sessão do usuário e:
   * - Se o usuário estiver autenticado, redireciona para a página comum
   * - Se o usuário não estiver autenticado, permanece na página de login
   * 
   * @effect
   * @param {string} session.status - Status atual da sessão do usuário
   * @example
   * // Exemplo de comportamento
   * // Se session.status === 'authenticated' -> redireciona para /common-page
   * // Se session.status === 'unauthenticated' -> permanece na página
   * 
   * @returns {void} Não retorna valor, apenas executa o redirecionamento quando necessário
   */

  
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      return
    } else {
      redirect('/common-page')
    }
  }, [session]);

  //se eu clicar em enter, vai chamar o handleLogin
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  /**
   * Renderiza o formulário de login com campos para email e senha.
   * 
   * O componente inclui:
   * - Logo da aplicação
   * - Campo de email com validação
   * - Campo de senha com toggle de visibilidade
   * - Mensagem de erro quando aplicável
   * - Botão de submit para autenticação
   * 
   * @returns {JSX.Element} Formulário de login estilizado com Tailwind CSS
   */
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-600 to-gray-100 flex items-center justify-center">
        <div className="w-full max-w-sm p-10 bg-white rounded-3xl shadow-lg border border-gray-100">
          <h1
            className="flex items-center justify-center text-3xl font-semibold text-center text-green-600 mb-6">
            <span>
              <Image src={Logo}
                alt='imagem logo'
                quality={100}
                className="w-10 h-10 mr-8" />
            </span>Login</h1>
          <div className="space-y-6">
            <input
              type="text"
              required
              placeholder="E-mail"
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                name="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                onKeyDown={handleKeyDown}
              />
              <p className="absolute -mt-2 text-xs text-red-600 p-2 text-center">
                {aviso}
              </p>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <FaEyeSlash size={11} /> : <FaEye size={12} />}
              </button>
            </div>
            <input
              type='button'
              onClick={() => { handleLogin() }}/* no futuro vai mandar para a agenda para marcar as reuniões */
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              value='Acessar'
            />
            <button
              onClick={() => router.push('/pre-cadastro')}
              className="w-full py-3 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Cadastre-se
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/recupera" className="text-sm text-green-600 hover:text-green-700">
              Esqueceu a senha?
            </Link>
            <Link href="/" className="text-sm ml-2 text-green-600 hover:text-green-700">
              Voltar
            </Link>
          </div>
        </div>
      </div>
    </>


  );
}

