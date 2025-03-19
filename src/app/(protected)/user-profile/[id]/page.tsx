'use client'

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";
import tiviai from "../../../../../public/patern_capa/tivia.jpg"
import profilePhoto from "../../../../../public/profile_pictures_ps/img_perfil.jpg"

interface Psicologo {
    id: string;
    name: string;
    email: string;
    registro?: string;
    cfp?: string;
    crp?: string;
    celular?: string;
    telefone?: string;
    cpf?: string;
    idade?: string;
    cidade?: string;
    uf?: string;
    foto?: string;
    descricao?: string;
    senha: string;
}

const Perfil = () => {
    const { id } = useParams();
    const [psicologo, setPsicologo] = useState<Psicologo | null>(null);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState<Psicologo | null>(null);
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    useEffect(() => {
        // Simulação de busca de dados do psicólogo (substituir por requisição real)
        const dadosMock = {
            id: id as string,
            name: "Dra. Mariana Silva",
            email: "mariana.silva@tiviai.com.br",
            email_confirm: 'mariana@gmail.com',
            senha: "",
            role:'psicologo',
            created:'10/01/2025',
            update:'11/01/2025',
            registro: "12345-SP", //crp
            cpf: "000.000.000-00",
            celular: "(11) 99999-9999",
            telefone: "(11) 3456-7890",
            rg:'12313',
            cfp: '12345678',
            idade: "40",
            creditos:'10',
            cartao:'000',
            bandeira:'visa',
            cvc:'123',
            cep:'444444',
            cidade: "São Paulo",
            uf: "SP",
            descricao: "Profissional com mais de 10 anos de experiência em psicoterapia e saúde mental.",
            banner:'',
            photprofile:profilePhoto.src,
            linkedin:'teste.linkedin',
            instagram: 'link instagram0',
            facebook:'link do face',
            whatsapp:'000000',
            psicologoid:'teste'

        };
        setPsicologo(dadosMock);
        setFormData(dadosMock);
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!formData) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setPsicologo(formData);
        setEditando(false);
    };

    const handleSenhaChange = () => {
        if (novaSenha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }
        setPsicologo((prev) => prev ? { ...prev, senha: novaSenha } : null);
        setNovaSenha("");
        setConfirmarSenha("");
        alert("Senha alterada com sucesso!");
    };

    if (!psicologo || !formData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="w-full h-60 bg-gray-800"> 
                <Image src={tiviai} width={800} alt='' quality={100} className="w-full h-60"/>
            </div>

            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg -mt-16 p-6 flex flex-col items-center">
                <img src={psicologo.foto} alt='profile picture' className="w-32 h-32 rounded-full border-4 border-white" />
                <h1 className="text-2xl font-bold text-gray-800 mt-4">{psicologo.name}</h1>
                <p className="text-gray-600">{psicologo.email}</p>
                {editando ? (
                    <textarea name="descricao" value={formData.descricao || ''} onChange={handleChange} className="w-full border p-2 mt-2" />
                ) : (
                    <p className="text-gray-500 mt-2 text-center">{psicologo.descricao}</p>
                )}
                <button onClick={() => setEditando(!editando)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                    {editando ? "Cancelar" : "Editar Perfil"}
                </button>
                {editando && (
                    <button onClick={handleSave} className="mt-2 px-4 py-2 bg-green-600 text-white rounded">Salvar</button>
                )}
            </div>

            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Informações Profissionais</h2>
                {editando ? (
                    <>
                        <input type="text" name="registro" value={formData.registro || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Registro" />
                        <input type="text" name="CRP" value={formData.crp || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="CRP" />
                        <input type="text" name="CFP" value={formData.cfp || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="CFP" />
                        <input type="text" name="celular" value={formData.celular || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Celular" />
                        <input type="text" name="Telefone" value={formData.telefone || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="telefone" />
                        <input type="text" name="cidade" value={formData.cidade || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Cidade" />
                        <input type="text" name="Estado" value={formData.uf || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Cidade" />
                        <input type="text" name="Idade" value={formData.idade || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Idade" />
                        <input type="text" name="Email" value={formData.email || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Email" />
                        <input type="text" name="Email" value={formData.email || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Email" />

                        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6 ">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Alterar Senha</h2>
                            <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className="w-full border p-2 mb-2" placeholder="Nova Senha" />
                            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="w-full border p-2 mb-2" placeholder="Confirmar Senha" />
                            <button onClick={handleSenhaChange} className="px-4 py-2 bg-red-600 text-white rounded">Alterar Senha</button>
                        </div>
                    </>
                ) : (
                    <>
                    <p><strong>Registro:</strong> {psicologo.registro || "Não informado"}</p>
                    <p><strong>CRP:</strong> {psicologo.crp || "Não informado"}</p>
                    <p><strong>CFP:</strong> {psicologo.cfp || "Não informado"}</p>
                    <p><strong>Idade:</strong> {psicologo.idade || "Não informado"}</p>
                    <p><strong>Celular:</strong> {psicologo.celular || "Não informado"}</p>
                    <p><strong>Telefone:</strong> {psicologo.telefone || "Não informado"}</p>
                    <p><strong>Cidade:</strong> {psicologo.cidade || "Não informado"}, {psicologo.uf || "Não informado"}</p>
                    <p><strong>Estado:</strong> {psicologo.uf || "Não informado"}</p>
                </>
                )}
            </div>

        </div>
    );
};

export default Perfil
    