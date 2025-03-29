
'use client'

import { BsFillFileEarmarkMedicalFill } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { validarCPF } from "../util/validarCPF";
import { validarTelefone } from "../util/validaPhone";

const Cadastro = () => {

    const [cpf, setCPF] = useState<string>('')
    const [cfp, setCFP] = useState<string>('')
    const [rg, setRG] = useState<string>('')
    const [nasc, setNasc] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [telefone, setTelefone] = useState<string>('')
    const [celular, setCelular] = useState<string>('')
    const [nome, setNome] = useState<string>('')
    const [crp, setCRP] = useState<string>('')

    const router = useRouter()

    const defIdade = (data: string) => Math.floor((new Date().getTime() - new Date(data).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const idade = defIdade(nasc)


    const handleSubmit = async (event: React.FormEvent) => {
        if (idade < 18) {
            alert('Você não tem idade para se cadastrar')
            setNasc('')
            return null

        }

        event.preventDefault()

        const dados = {
            cpf: cpf,
            cfp: cfp,
            crp: crp,
            nome: nome,
            rg: rg,
            email: email,
            data_nasc: nasc,
            celular: celular,
            telefone: telefone,
        }

        try {
            const response = await fetch("/api/analize_psco", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados) // Converte para JSON antes de enviar
            });

            const result = await response.json(); // Transforma a resposta em JSON


            if (response.ok) {

                alert("Pré-cadastro realizado com sucesso");
                event.preventDefault()
                clearInputs()

            } else {

                alert('Dados não foram salvos no banco de dados')
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };


    function clearInputs() {
        setCPF('')
        setCFP('')
        setCRP('')
        setRG('')
        setNasc('')
        setEmail('')
        setTelefone('')
        setCelular('')
        setNome('')
    }

    //função para envio dos dados
    function validacpf() {
        const cpf_format = (cpf: string) => cpf.replace(/[0-9.-]/g, '');
        // Exemplo de uso:
        setCPF(cpf_format)
        try {
            const cpfLimpo = validarCPF(cpf);
            setCPF(cpfLimpo)
        } catch (error) {
            if (error) {
                alert('Cpf invalido!')
                setCPF('')
            }
        }
    }


    return (
        <>

            <div className="flex items-center  justify-center mt-48 ">

                <form onSubmit={handleSubmit}>

                    <div className="relative w-[1260px] h-auto bg-white p-5 rounded-lg shadow-md">
                        {/* Header */}
                        <div className="w-[1224px] h-[64px] bg-gray-100 border border-gray-300 rounded-lg flex items-center px-5">
                            <BsFillFileEarmarkMedicalFill size={40} />
                            <h1 className="text-2xl font-extrabold">   Sou psicologo e quero usar todo o poder do Tivi AI</h1>
                        </div>

                        {/* Seção Informações */}
                        <div className="mt-5 border-b border-gray-300 pb-2 flex items-center">
                            <IoIosInformationCircle size={20} />
                            <h2 className="text-lg font-semibold">Informe seus dados de Psicologo abaixo, nossa equipe pode levar até 48h pra analisar seu pedido</h2>
                        </div>

                        {/* Formulário */}
                        <div className="grid grid-cols-2 gap-4 mt-4">


                            <div className="flex flex-col">
                                <label className="text-sm font-medium">  Nome:</label>
                                <input type="text"
                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => setNome(e.target.value)}
                                    value={nome}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium">  CPF:</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => setCPF(e.target.value)}
                                    value={cpf}
                                    onBlur={(e) => { validacpf() }}
                                    required
                                />

                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium">Registro CFP:</label>
                                <input
                                    type="number"
                                    title='Esse numero será verificado no portal do Conselho Federal de Psicologia'
                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => setCFP(e.target.value)}
                                    value={cfp}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium">Registro CRP:</label>
                                <input type="number"
                                    title='Esse numero será verificado no portal do Conselho Regional de Psicologia'
                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => setCRP(e.target.value)}
                                    value={crp}
                                    required
                                />
                            </div>


                            <div className="flex flex-col">
                                <label className="text-sm font-medium">  RG:</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => setRG(e.target.value)}
                                    required
                                    value={rg}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium">  Data de Nascimento:</label>
                                <input type="date"

                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => setNasc(e.target.value)}
                                    value={nasc}
                                    required />
                            </div>
                        </div>




                        <div className="grid grid-cols-3 gap-4 mt-4">

                            <div className="flex flex-col">
                                <label className="text-sm font-medium">  E-mail:</label>
                                <input
                                    type="email"
                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium"> Telefone:</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => {
                                        setTelefone(e.target.value); 
                                    }}
                                    value={telefone}
                                    required
                                />

                            </div>


                            <div className="flex flex-col">
                                <label className="text-sm font-medium">  Celular:</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => setCelular(e.target.value)}
                                    value={celular}
                                    required
                                />
                            </div>



                        </div>

                        <div className="flex flex-row justify-end w-full p-2 mt-12">
                            <input type="submit" className="border border-gray-300 bg-blue-600 rounded-lg w-44 text-white font-bold mx-1" value="Enviar solicitação" />
                            <input
                                type="button"
                                className="border border-gray-300 bg-lime-600 rounded-lg w-44 text-white font-bold mx-1"
                                value="Cancelar"
                                onClick={() => router.push('/')}
                            />
                        </div>


                    </div>
                </form>

            </div>

        </>


    );
};

export default Cadastro;
