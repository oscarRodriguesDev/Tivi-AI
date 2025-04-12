"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, RedirectType, useRouter } from 'next/navigation';
import { SessionProvider, useSession } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Ícones para mostrar/ocultar senha
import Image from "next/image";
import Logo from '../../../../public/marca/logo.png'
import Link from "next/link";
import { KeyboardEvent } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const session = useSession()
  const [showPassword, setShowPassword] = useState(false);
  const [aviso, setAviso] = useState('')


  const handleLogin = async () => {
    
    try {
      const result = await signIn("credentials", { email, password, callbackUrl: `/dating`, redirect:true });

      if (result?.error) {
     
        throw new Error(result.error);
      }

      // Se não houver erro, o usuário será redirecionado automaticamente pelo NextAuth
    } catch (error) {
      setAviso('Usuário ou senha incorretos')
      alert(aviso)
      setPassword(""); // Limpa a senha, mantendo o email
    }
  };


  useEffect(() => {
    if (session.status === 'unauthenticated') {
      return
    } else {
      redirect('/')
    }
  }, [session]);

  //se eu clicar em enter, vai chamar o handleLogin
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };


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
              type="email"
              required
              placeholder="Email"
              name='email'
              value={email}
              autoComplete="email"  // Adicionado aqui!
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
