'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const [name, setName] = useState(""); // Para armazenar o nome
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState(""); // Para confirmar o email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Para confirmar a senha
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Para mostrar/ocultar senha
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Para mostrar/ocultar confirmação de senha
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    if (email !== confirmEmail) {
      setError("Os emails não coincidem!");
      return;
    }

    const response = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ name, email, password,confirmPassword }), // Inclui o nome no body
     
    });

    if (response.ok) {
      setSuccess(true);
      
      //setTimeout(() => router.push("/login"), 2000); // Redireciona para login após sucesso
      alert('logado com sucesso!')
      setName('')
      setPassword('')
      setEmail("")
      setConfirmEmail("")
      setConfirmPassword("")
    } else {
      const data = await response.json();
      setError(data.message || "Erro ao cadastrar usuário.");

    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex justify-center mb-6">
           <img src="/logo.png" alt="Logo" className="h-12" /> 
          </div>
          <h1 className="text-3xl font-semibold text-center text-white mb-4">Cadastro</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo para o nome */}
            <div>
              <label className="block text-lg font-medium text-gray-300 mb-2" htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Campo para o email */}
            <div>
              <label className="block text-lg font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu email"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Campo para confirmar o email */}
            <div>
              <label className="block text-lg font-medium text-gray-300 mb-2" htmlFor="confirmEmail">Confirmar Email</label>
              <input
                id="confirmEmail"
                type="email"
                placeholder="Confirme seu email"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
              />
            </div>

            {/* Campo para a senha */}
            <div>
              <label className="block text-lg font-medium text-gray-300 mb-2" htmlFor="password">Senha</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {/* Campo para confirmar a senha */}
            <div>
              <label className="block text-lg font-medium text-gray-300 mb-2" htmlFor="confirmPassword">Confirmar Senha</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {/* Mensagem de erro ou sucesso */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">Usuário cadastrado com sucesso!</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Cadastrar
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-400">
            Já tem uma conta? <a href="/login" className="text-blue-500 hover:underline">Faça login</a>
          </p>
        </div>
      </div>
    </>
  );
}
