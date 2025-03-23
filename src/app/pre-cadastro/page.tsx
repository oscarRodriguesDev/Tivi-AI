
'use client'

import { BsFillFileEarmarkMedicalFill } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";
import { FaHouse } from "react-icons/fa6";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { PiSirenFill } from "react-icons/pi";
import { TbLockSquareRoundedFilled } from "react-icons/tb";
import { useState } from "react";

const Cadastro = () => {

    const [cpf, setCPF] = useState<string>('')
    const [cfp, setCFP] = useState<string>('')
    const [rg, setRG] = useState<string>('')
    const [nasc, setNasc] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [telefone, setTelefone] = useState<string>('')
    const [celular, setCelular] = useState<string>('')
    const [nome, setNome] = useState<string>('')
    const [crp,setCRP]=useState<string>('') 


const handleSubmit = async (event:React.FormEvent) => {
    const dados = {
        cpf: cpf,
        cfp: cfp,
        crp:crp,
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
            console.log("Pré-cadastro realizado com sucesso:", result);
            alert("Pré-cadastro realizado com sucesso");
            event.preventDefault()
            clearInputs()
           
        } else {
            console.error("Erro ao cadastrar:", result.error);
            alert('Dados não foram salvos no banco de dados')
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
};


function clearInputs(){
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






    return (
        <div className="flex items-center ml-ml-perc-2 ">

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
                        <label className="text-sm font-medium">  CPF:</label>
                        <input type="text"  className="border border-gray-300 rounded p-1" onChange={(e)=>setCPF(e.target.value)} value={cpf} />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Registro CFP:</label>
                        <input type="text"  title='Esse numero será verificado no portal do Conselho Federal de Psicologia' className="border border-gray-300 rounded p-1" onChange={(e)=>setCFP(e.target.value)} value={cfp} />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Registro CRP:</label>
                        <input type="text"  title='Esse numero será verificado no portal do Conselho Regional de Psicologia' className="border border-gray-300 rounded p-1" onChange={(e)=>setCRP(e.target.value)} value={crp} />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium">  Nome:</label>
                        <input type="text"  className="border border-gray-300 rounded p-1" onChange={(e)=>setNome(e.target.value)} value={nome}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium">  RG:</label>
                        <input type="text"  className="border border-gray-300 rounded p-1" onChange={(e)=>setRG(e.target.value)} value={rg} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium">  Data de Nascimento:</label>
                        <input type="date" className="border border-gray-300 rounded p-1" onChange={(e)=>setNasc(e.target.value)} value={nasc} />
                    </div>
                </div>




                <div className="grid grid-cols-3 gap-4 mt-4">

                    <div className="flex flex-col">
                        <label className="text-sm font-medium">  E-mail:</label>
                        <input type="email"  className="border border-gray-300 rounded p-1" onChange={(e)=>setEmail(e.target.value)} value={email} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium">  Celular:</label>
                        <input type="text"  className="border border-gray-300 rounded p-1" onChange={(e)=>setCelular(e.target.value)} value={celular}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium"> Telefone:</label>
                        <input type="text"  className="border border-gray-300 rounded p-1" onChange={(e)=>setTelefone(e.target.value)} value={telefone} />
                    </div>


                </div>

                <div className="flex flex-row justify-end w-4/5 p-2">
                    <input type="submit" className="border border-gray-300 bg-blue-600 rounded-lg w-44 text-white font-bold mx-1" value="Enviar solicitação" />
                    <input type="button" className="border border-gray-300 bg-lime-600 rounded-lg w-44 text-white font-bold mx-1" value="Cancelar" />
                </div>


            </div>
            </form>

        </div>


    );
};

export default Cadastro;
