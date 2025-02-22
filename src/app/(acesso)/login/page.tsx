"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-600 to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm p-10 bg-white rounded-3xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">Login</h1>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <button
            onClick={() => signIn("credentials", { email, password, callbackUrl: "/dating" })}/* no futuro vai mandar para a agenda para marcar as reuniões */
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Entrar
          </button>

          <button
            onClick={() => router.push('/cadastro')}
            className="w-full py-3 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Cadastre-se
          </button>
        </div>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-green-600 hover:text-green-700">
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
    </>

    
  );
}
