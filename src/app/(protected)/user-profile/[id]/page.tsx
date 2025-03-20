'use client'

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import tiviai from "../../../../../public/patern_capa/tivia.jpg";
import profilePhoto from "../../../../../public/profile_pictures_ps/img_perfil.jpg";

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
    description?: string;
    senha?: string;
}

const Perfil = () => {
    const { id } = useParams<{ id: string }>();
    const [psicologo, setPsicologo] = useState<Psicologo | null>(null);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState<Psicologo | null>(null);
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    // Função para buscar os dados reais do banco
    async function fetchUserData(userId: string) {
        try {
            const res = await fetch(`/api/user-profile?id=${userId}`);
            if (!res.ok) {
                throw new Error("Erro ao buscar dados do usuário");
            }
            const data = await res.json();
            console.log("Dados recebidos:", data);
            setPsicologo(data);
            setFormData(data); // Atualiza os dados no formulário também
        } catch (error) {
            console.error("Erro ao buscar dados do psicólogo:", error);
        }
    }


    //chamadno os dados do banco de dados
    useEffect(() => {
        if (id) {
            fetchUserData(id);
        }
    }, [id]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!formData) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setPsicologo(formData);
        await handleUpdate()
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


    //função para edição

    const handleUpdate = async () => {
        if (!formData) return;
    
        try {
            const res = await fetch(`/api/user-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: psicologo?.id,
                    ...formData,
                }),
            });
    
            if (!res.ok) {
                throw new Error("Erro ao atualizar perfil");
            }
    
            const updatedUser = await res.json();
            setPsicologo(updatedUser); // Atualiza o estado com os novos dados
            setEditando(false); // Sai do modo de edição
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Falha ao atualizar perfil. Tente novamente.");
        }
    };
    

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
            {/* Banner */}
            <div className="w-full h-60 bg-gray-800">
                <Image src={tiviai} width={800} alt="Banner" quality={100} className="w-full h-60" />
            </div>

            {/* Perfil */}
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg -mt-16 p-6 flex flex-col items-center">
                <img
                    src={psicologo.foto || profilePhoto.src}
                    alt="Foto de perfil"
                    className="w-32 h-32 rounded-full border-4 border-white"
                />
                <h1 className="text-2xl font-bold text-gray-800 mt-4">{psicologo.name}</h1>
                <p className="text-gray-600">{psicologo.email}</p>
               
                <button onClick={() => setEditando(!editando)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                    {editando ? "Cancelar" : "Editar Perfil"}
                </button>
                {editando && (
                    <button onClick={handleSave} className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
                        Salvar
                    </button>
                )}
            </div>

            {/* Informações Profissionais */}
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Informações Profissionais</h2>
                {editando ? (
                    <>
                    <textarea
                        name="descricao"
                        value={formData.description||'sem descrição'}
                        onChange={handleChange}
                        className="w-full border p-2 mt-2"
                    />
                        
                        <input type="text" name="registro" value={formData.description || 'Descrição do Psicologo'} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Descrição" />
                        <input type="text" name="registro" value={formData.registro || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Registro" />
                        <input type="text" name="crp" value={formData.crp || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="CRP" />
                        <input type="text" name="cfp" value={formData.cfp || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="CFP" />
                        <input type="text" name="celular" value={formData.celular || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Celular" />
                        <input type="text" name="telefone" value={formData.telefone || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Telefone" />
                        <input type="text" name="cidade" value={formData.cidade || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Cidade" />
                        <input type="text" name="uf" value={formData.uf || ''} onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Estado" />
                    </>
                ) : (
                    <>
                        <p className="text-gray-500 mt-2 text-center">{psicologo.descritpion||'descrição de psicologo'}</p>
                        <p><strong>Registro:</strong> {psicologo.registro || "Não informado"}</p>
                        <p><strong>CRP:</strong> {psicologo.crp || "Não informado"}</p>
                        <p><strong>CFP:</strong> {psicologo.cfp || "Não informado"}</p>
                        <p><strong>Idade:</strong> {psicologo.idade || "Não informado"}</p>
                        <p><strong>Celular:</strong> {psicologo.celular || "Não informado"}</p>
                        <p><strong>Telefone:</strong> {psicologo.telefone || "Não informado"}</p>
                        <p><strong>Cidade:</strong> {psicologo.cidade || "Não informado"}, {psicologo.uf || "Não informado"}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Perfil;
