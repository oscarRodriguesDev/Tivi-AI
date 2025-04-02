'use client'
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { useRouter } from "next/navigation"; // Para redirecionamento
import { FaCalendarAlt, FaInfoCircle, FaHome, FaPhone, FaExclamationTriangle } from 'react-icons/fa';
import { ChangeEvent, useState } from "react";
import { useParams } from "next/navigation";
import { Endereco } from "../../../../../types/adress";
import HeadPage from "../../components/headPage";
import { FaBookMedical } from "react-icons/fa";


const Pacientes = () => {
    const { psc } = useParams()
    const [userId, setUserId] = useState<string>(String(psc))
    const [nome, setNome] = useState<string>('')
    const [cpf, setCpf] = useState<string>('')
    const [nick, setNick] = useState<string>('')
    const [idade, setIdade] = useState<string>('')
    const [sintomas, setSintomas] = useState<string>('')
    const [telefone, setTelefone] = useState<string>('')
    const [convenio, setConvenio] = useState<string>('')
    const [sexo, setSexo] = useState('Masculino')
    const [nasc, setNasc] = useState<string>('')
    const [cep, setCep] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [bairro, setBairro] = useState<string>('')
    const [rua, setRua] = useState<string>('')
    const [numero, setNumero] = useState<string>('')
    const [pais, setPais] = useState<string>('Brasileira')
    const [complemento, setComplemento] = useState<string>('')
    const [estado, setEstado] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [rg, setRg] = useState<string>(String(''))



    const limparCampos = () => {
        setUserId('');
        setNome('');
        setCpf('');
        setNick('');
        setIdade('');
        setSintomas('');
        setTelefone('');
        setConvenio('');
        setSexo('Masculino'); // Se for necessário resetar para um valor padrão
        setNasc('');
        setCep('');
        setCity('');
        setBairro('');
        setRua('');
        setNumero('');
        setPais('Brasileira'); // Se for necessário resetar para um valor padrão
        setComplemento('');
        setEstado('');
        setEmail('');
        setRg('');
    };




    const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto
    const router = useRouter();


    // Enviar os dados para o backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        try {
            const response = await fetch("/api/register_pacientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    fantasy_name: nick,
                    idade: idade,
                    sintomas: sintomas,
                    telefone: telefone,
                    convenio: convenio,
                    sexo: sexo,
                    cep: cep,
                    cidade: city,
                    bairro: bairro,
                    rua: rua,
                    numero: numero,
                    pais: pais,
                    complemento: complemento,
                    estado: estado,
                    email: email,
                    rg: rg,
                    cpf: cpf,
                    psicoloId: userId

                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Paciente cadastrado com sucesso!");
                limparCampos()

            } else {
                alert(`Erro: ${data.error}`);
            }
        } catch (error) {
            alert("Erro ao cadastrar paciente.");
        } finally {

        }
    };


    /**
   * Valida um CPF.
   *
   * @param cpf - O CPF a ser validado (pode ser formatado ou não).
   * @returns Retorna `true` se o CPF for válido, caso contrário `false`.
   */
    function validarCPF(cpf: string) {
        // Remove caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');

        // Verifica se o CPF tem 11 dígitos ou se é uma sequência inválida
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            alert('O campo de cpf deve ter 11 digitos')
            setCpf('')

        }

        // Função auxiliar para calcular os dígitos verificadores
        const calcularDigito = (limit: number) => {
            let total = 0;
            for (let i = 0; i < limit; i++) {
                total += parseInt(cpf[i]) * (limit + 1 - i);
            }
            const resto = total % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        // Valida os dois dígitos verificadores
        const digito1 = calcularDigito(9);
        const digito2 = calcularDigito(10);

        let valido = digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
        if (!valido) {
            alert('o cpf digitado não é valido!')
            setCpf('')
        }
    }


    /**  Função determina a seleção de sexo do usuário no check box 
    * @param e:Event - tipagem do evento especifo para checkbox
    */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSexo(e.target.value);
    };


    /**
     * Essa função calcula a idade atraves do data de nascimento passada pelo usuario
     * @return void
     *  */
    const calcularIdade = () => {
        const dataNascimento = new Date(nasc);
        const dataAtual = new Date();

        let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();

        // Verifica se o aniversário já aconteceu neste ano
        const mesNascimento = dataNascimento.getMonth();
        const diaNascimento = dataNascimento.getDate();

        const mesAtual = dataAtual.getMonth();
        const diaAtual = dataAtual.getDate();

        // Se o mês atual for antes do mês de nascimento ou se for o mês de nascimento mas o dia atual ainda não chegou
        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
            idade--;
        }

        setIdade(String(idade));
    }


    /**
 * Função que faz o fetch para pegar o endereço quando o usuário digita o CEP.
 * @param cep O CEP que será utilizado para buscar o endereço.
 */
    const buscaAdress = async (cep: string) => {
        try {

            // Fazendo a requisição para a API de endereços
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

            // Verificando se a resposta foi bem-sucedida
            if (!res.ok) {
                throw new Error('Erro ao buscar o endereço');
            }

            const data: Endereco = await res.json();
            setBairro(data.bairro)
            setCity(data.localidade)
            setRua(data.logradouro)
            setEstado(data.estado)
            setCep(data.cep)


            return data; // Retorna os dados caso queira usá-los em outro lugar

        } catch (error) {
            // Lidando com erros de rede ou de formatação de CEP
            console.error('Erro:', error);
        }
    };



    return (
        <>
              
              <HeadPage title='Pacientes' icon={<FaBookMedical size={20}/>}/>



            {/* Verificação do Role aqui vai mudar para role=== 'PSYCHOLOGIST'*/}
            {role === 'PSYCHOLOGIST' ? (

                <form onSubmit={handleSubmit}>

                    <div className=" relative w-full max-w-screen-xl h-auto bg-white p-5">
                        {/* Header */}
                        <div className="w-full h-16 bg-[#F9FAFC] border border-[#D9D9D9] rounded-lg flex items-center px-6 mb-8">
                            <FaCalendarAlt className="text-black text-2xl mr-4" />
                            <h1 className="text-black font-extrabold text-2xl">Novo Paciente</h1>
                        </div>

                        {/* Informações Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FaInfoCircle className="text-black text-xl mr-4" />
                                <h2 className="text-black font-semibold text-lg">Informações</h2>
                            </div>
                            <hr className="border-t border-[#0b0404] mb-6" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                {/* Psicologo */}
                                <div>
                                    <label className="block text-black text-sm mb-1">Psicologo:</label>
                                    <input
                                        type="text"
                                        value={userId}
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        disabled
                                        readOnly
                                    />
                                </div>

                                {/* CPF */}
                                <div>
                                    <label className="block text-black text-sm mb-1">CPF:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        onBlur={() => validarCPF(cpf)}
                                        required
                                    />
                                </div>

                                {/* RG */}
                                <div>
                                    <label className="block text-black text-sm mb-1">RG:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={rg}
                                        onChange={(e) => setRg(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Nome e Nome fantasia */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-black text-sm mb-1">Nome:</label>
                                        <input
                                            type="text"
                                            className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-black text-sm mb-1">Nome fantasia:</label>
                                        <input
                                            type="text"
                                            className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                            value={nick}
                                            onChange={(e) => setNick(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Sexo */}
                                <div className="col-span-2 lg:col-span-3 bg-slate-200 p-4 rounded-sm">
                                    <label className="block text-black text-sm mb-2">Sexo:</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="sexo"
                                                value="masculino"
                                                className="accent-blue-500"
                                                onChange={handleChange}

                                            />
                                            Masculino
                                        </label>
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="sexo"
                                                value="feminino"
                                                className="accent-pink-500"
                                                onChange={handleChange}

                                            />
                                            Feminino
                                        </label>
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="sexo"
                                                value="nao_informar"
                                                className="accent-gray-500"
                                                onChange={handleChange}
                                            />
                                            Prefiro não informar
                                        </label>
                                    </div>
                                </div>

                                {/* Convenio */}
                                <div>
                                    <label className="block text-black text-sm mb-1">Convenio:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={convenio}
                                        onChange={(e) => setConvenio(e.target.value)}

                                    />
                                </div>

                                {/* Data de nascimento */}
                                <div>
                                    <label className="block text-black text-sm mb-1">Data de Nascimento:</label>
                                    <input
                                        type="date"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={nasc}
                                        onChange={(e) => {
                                            setNasc(e.target.value)
                                            calcularIdade()
                                        }}

                                        required
                                    />
                                </div>

                                {/* Naturalidade */}
                                <div>
                                    <label className="block text-black text-sm mb-1">Naturalidade:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={pais}
                                        onChange={(e) => setPais(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Endereço Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FaHome className="text-black text-xl mr-4" />
                                <h2 className="text-black font-semibold text-lg">Endereço</h2>
                            </div>
                            <hr className="border-t border-[#D9D9D9] mb-6" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-black text-sm mb-1">CEP:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        onBlur={(e) => { buscaAdress(cep) }}
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-black text-sm mb-1">Rua:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={rua}
                                        onChange={(e) => setRua(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-black text-sm mb-1">Estado:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-black text-sm mb-1">Bairro:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={bairro}
                                        onChange={(e) => setBairro(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-black text-sm mb-1">Cidade:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-black text-sm mb-1">Número:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={numero}
                                        onChange={(e) => setNumero(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Telefone*/}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FaPhone className="text-black text-xl mr-4" />
                                <h2 className="text-black font-semibold text-lg">Contatos</h2>
                            </div>
                            <hr className="border-t border-[#D9D9D9] mb-6" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-black text-sm mb-1">E-mail:</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required

                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-black text-sm mb-1">Telefone</label>
                                    <input
                                        type="text"
                                        className="w-full h-[40px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-black text-sm mb-1">Descrever o motivo da consulta</label>
                                <textarea
                                    className="w-full h-[120px] bg-[#F9FAFC] border border-[#D9D9D9] rounded p-2"
                                    onChange={(e) => setSintomas(e.target.value)}
                                    value={sintomas}

                                />

                            </div>

                            {/* Bottom Section */}
                            <div className="flex justify-between items-center mt-8">
                                <button
                                    className="bg-blue-500 text-white px-6 py-3 rounded-md"

                                >
                                    Cancelar
                                </button>


                                <input type='submit'
                                    className="bg-green-500 text-white px-6 py-3 rounded-md"
                                    value='Salvar'
                                    onClick={() => alert('quando implementado vai sair da pagina')}

                                />

                            </div>


                        </div>
                    </div>

                </form>


            ) : (<>
                      <div>
                        <h2>Sem autorização para ver essa pagina</h2>
                      </div>
            </>)}
        </>


    )
}

export default Pacientes;