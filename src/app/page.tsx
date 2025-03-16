'use client'
import { useEffect, useState } from "react"; // Importando useEffect
import { signIn } from "next-auth/react"; 
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
    const [isClient, setIsClient] = useState(false); // Controlar a renderização do cliente
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true); // Marca que a renderização do lado do cliente começou
    }, []);

    if (!isClient) {
        return null; // Retorna nada ou algum conteúdo de loading até que o cliente seja renderizado
    }

    return (
      
            <div className="min-h-screen bg-gradient-to-r from-blue-400 to-green-300 flex flex-col items-center text-center">
                {/* Hero Section */}
                <header className="w-full max-w-5xl py-20 text-white">
                    <h1 className="text-5xl font-extrabold tracking-wide">
                        Ti Vi AI: A Revolução no Atendimento Psicológico com Inteligência Artificial
                    </h1>
                    <p className="text-xl mt-4">
                        Transforme seu atendimento com videochamadas, transcrição automática e insights baseados em IA, ajudando psicólogos a melhorar diagnósticos e prescrições.
                    </p>
                    <div className="mt-14 p-5">
                        <Link href="/pre_cadastro" className="inline-block px-6 py-3 bg-blue-500 text-white font-bold rounded-full transform transition duration-300 hover:scale-105 hover:bg-blue-600 animate-pulse">
                            Entrar como Psicologo
                        </Link>
                    </div>
                </header>

                {/* Seção de Benefícios */}
                <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-blue-600">Videochamadas com Psicólogos</h2>
                        <p className="text-gray-700 mt-3">Conecte-se com pacientes através de videochamadas de alta qualidade, seguras e práticas.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-blue-600">Transcrição Automática</h2>
                        <p className="text-gray-700 mt-3">Toda consulta é transcrita em tempo real, permitindo um acompanhamento mais eficiente.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-blue-600">Insights Inteligentes</h2>
                        <p className="text-gray-700 mt-3">Use IA treinada para gerar insights valiosos sobre as consultas e melhorar suas recomendações.</p>
                    </div>
                </section>

                {/* Seção de Como Funciona */}
                <section className="w-full max-w-4xl mt-16">
                    <h2 className="text-2xl font-bold text-gray-800">Como Funciona?</h2>
                    <p className="text-lg text-gray-600 mt-4">Descubra como a Ti Vi AI pode transformar a maneira como você atende seus pacientes, com ferramentas que facilitam diagnósticos e prescrições mais precisos.</p>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-100 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-blue-600">1. Atenda Seus Pacientes</h3>
                            <p className="text-gray-700 mt-4">Com videochamadas seguras, você pode atender pacientes de qualquer lugar, com qualidade e confiança.</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-blue-600">2. Transcrição em Tempo Real</h3>
                            <p className="text-gray-700 mt-4">Toda consulta será transcrita automaticamente, permitindo uma melhor análise posterior.</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-blue-600">3. Insights da IA</h3>
                            <p className="text-gray-700 mt-4">Com insights baseados em IA, você pode obter recomendações sobre diagnóstico e tratamento.</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-blue-600">4. Diagnóstico e Prescrição Inteligente</h3>
                            <p className="text-gray-700 mt-4">A plataforma ajuda a melhorar a precisão do diagnóstico e a prescrição de medicamentos, com menos margem de erro.</p>
                        </div>
                    </div>
                </section>

                {/* Seção de Login para Usuários Existentes */}
                <section className="w-full max-w-4xl mt-16 bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Já é um Usuário da Ti Vi AI?</h2>
                    <p className="text-gray-600 mb-6">Faça login para acessar sua conta e utilizar todos os recursos poderosos da nossa plataforma.</p>

                    <Link
                        href="/login"
                        className="inline-block px-6 py-3 bg-blue-500 text-white font-bold rounded-full transform transition duration-300 hover:scale-105 hover:bg-blue-600 animate-pulse"
                    >
                        Fazer Login
                    </Link>
                </section>

                {/* Rodapé */}
                <footer className="w-full max-w-5xl py-6 mt-16 border-t text-gray-500">
                    © 2025 Ti Vi AI - Todos os direitos reservados.
                </footer>
            </div>
     
    );
}
