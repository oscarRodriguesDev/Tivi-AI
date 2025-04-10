
'use client'
/**
 * Importações de ícones, hooks e utilidades usados na interface de cadastro ou visualização de psicólogos.
 *
 * - `BsFillFileEarmarkMedicalFill`: Ícone relacionado a documentos médicos.
 * - `IoIosInformationCircle`: Ícone informativo.
 * - `useState`: Hook React para gerenciar estado local.
 * - `useRouter`: Hook Next.js para manipulação de rotas e navegação.
 * - `validarCPF`: Função utilitária personalizada para validação de CPF.
 */

import { BsFillFileEarmarkMedicalFill } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";
import { useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { validarCPF } from "../util/validarCPF";




/**
 * @component Cadastro
 * 
 * @description
 * Componente responsável por exibir o formulário de pré-cadastro de psicólogos na plataforma Tivi AI.
 * Permite que profissionais da área preencham seus dados pessoais e profissionais para posterior análise e habilitação no sistema.
 * 
 * ### Visão Geral:
 * - Interface intuitiva para entrada de dados como CPF, CRP, nome, RG, data de nascimento, e-mail e telefones.
 * - Realiza validação de idade (mínimo de 18 anos) e de CPF (com verificação via função `validarCPF`).
 * - Ao submeter o formulário, os dados são enviados via `fetch` para o endpoint `/api/analize_psco`.
 * - Em caso de sucesso, o usuário recebe um alerta e os campos são resetados.
 * - Possui um botão de **cancelar**, que redireciona o usuário para a rota raiz (`/`).

 * ### Estados controlados:
 * - `cpf`, `cfp`, `crp`, `nome`, `rg`, `email`, `data_nasc`, `telefone`, `celular`, `ddi`, `ddi2`: armazenam os valores dos campos do formulário.
 * 
 * ### Funções principais:
 * - `handleSubmit`: Envia os dados para a API após validações.
 * - `clearInputs`: Limpa todos os campos do formulário após envio ou cancelamento.
 * - `validacpf`: Sanitiza e valida o CPF ao perder o foco.
 * - `defIdade`: Calcula a idade com base na data de nascimento.
 * 
 * ### Recursos Visuais:
 * - Ícones (`BsFillFileEarmarkMedicalFill`, `IoIosInformationCircle`) para reforçar semântica visual.
 * - Select de DDI para facilitar uso internacional.
 * 
 * @returns JSX.Element contendo o formulário completo de cadastro de psicólogo.
 */


const Cadastro = () => {

    // Estados utilizados para armazenar os dados inseridos no formulário de cadastro:

    /**
     * @state cpf
     * @description Armazena o CPF informado pelo psicólogo. Validação e formatação são aplicadas antes do envio.
     */
    const [cpf, setCPF] = useState<string>('')

    /**
     * @state cfp
     * @description Espelho do CRP, enviado para análise como referência cruzada. Serve para padronização ou envio a outro endpoint.
     */
    const [cfp, setCFP] = useState<string>('')

    /**
     * @state rg
     * @description Armazena o RG do psicólogo. Campo obrigatório para identificação.
     */
    const [rg, setRG] = useState<string>('')

    /**
     * @state nasc
     * @description Data de nascimento usada para calcular idade e validar se o usuário é maior de idade.
     */
    const [nasc, setNasc] = useState<string>('')

    /**
     * @state email
     * @description E-mail do profissional, utilizado para comunicação e validação de cadastro.
     */
    const [email, setEmail] = useState<string>('')

    /**
     * @state telefone
     * @description Telefone fixo ou número principal, concatenado com DDI antes do envio.
     */
    const [telefone, setTelefone] = useState<string>('')

    /**
     * @state celular
     * @description Celular alternativo ou secundário, concatenado com DDI2.
     */
    const [celular, setCelular] = useState<string>('')

    /**
     * @state nome
     * @description Nome completo do psicólogo, usado para identificação e exibição em futuras etapas.
     */
    const [nome, setNome] = useState<string>('')

    /**
     * @state nome
     * @description Last name do psicólogo, usamos para criar o email dele.
     */
    const [lastName, setLastName] = useState<string>('')

    /**
     * @state crp
     * @description Registro profissional no Conselho Regional de Psicologia (CRP), obrigatório para validação da atuação profissional.
     */
    const [crp, setCRP] = useState<string>('')

    /**
     * @state ddi
     * @description Código do país (DDI) para o telefone principal. Padrão inicial é Brasil (+55).
     */
    const [ddi, setDDI] = useState<string>('+55')

    /**
     * @state ddi2
     * @description Código do país (DDI) para o celular alternativo. Também padrão Brasil (+55).
     */
    const [ddi2, setDDI2] = useState<string>('+55')


    const router = useRouter()


    /**
 * Calcula a idade com base na data de nascimento fornecida.
 *
 * @function defIdade
 * @param {string} data - Data de nascimento em formato ISO (yyyy-mm-dd).
 * @returns {number} Idade aproximada em anos completos, considerando anos bissextos.
 *
 * @example
 * const idade = defIdade("1990-05-10");
 * console.log(idade); // Saída: 34 (dependendo do ano atual)
 */
    const defIdade = (data: string) => Math.floor((new Date().getTime() - new Date(data).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    



    /**
 * Idade atual do usuário calculada com base na data de nascimento fornecida no formulário.
 * Atualiza dinamicamente conforme o valor de `nasc` muda.
 */
    const idade = useMemo(() => defIdade(nasc), [nasc])


    /**
     * Manipula o envio do formulário de pré-cadastro de psicólogos.
     *
     * Esta função valida a idade do usuário com base na data de nascimento informada,
     * formata os dados inseridos (como telefone e celular com DDI),
     * e realiza uma requisição `POST` para a rota `/api/analize_psco`,
     * enviando os dados para análise posterior.
     *
     * Caso a idade seja inferior a 18 anos, o envio é interrompido.
     * Em caso de sucesso na requisição, um alerta de confirmação é exibido
     * e os campos do formulário são limpos.
     *
     * @param {React.FormEvent} event - Evento de envio do formulário.
     * 
     * @async
     * @returns {Promise<void>} - A função não retorna valor, mas lida com efeitos colaterais como alertas, limpeza de campos e chamadas HTTP.
     *
     * @sideEffects
     * - Altera estados internos como `setCFP`, `setTelefone`, `setCelular`, e limpa campos com `clearInputs()`.
     * - Exibe alertas ao usuário conforme a resposta da API ou validações de idade.
     * - Realiza uma requisição HTTP para envio de dados do formulário.
     * 
     * @example
     * // Disparado automaticamente ao submeter o formulário:
     * <form onSubmit={handleSubmit}>...</form>
     */

    const handleSubmit = async (event: React.FormEvent) => {
        if (idade < 18) {
            alert('Você não tem idade para se cadastrar')
            setNasc('')
            return null

        }

        event.preventDefault()
        setCFP(crp)
        setCelular(ddi2 + celular)
        setTelefone(ddi + telefone)

        const dados = {
            cpf: cpf,
            cfp: cfp,
            crp: crp,
            nome: nome,
            lastname: lastName,
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
                setTelefone('')
                setCelular('')
            }
        } catch (error) {
            alert('Erro ao enviar dados ' + error)
            console.error("Erro na requisição:", error);
            setTelefone('')
            setCelular('')
        }
    };



    /**
 * Limpa todos os campos do formulário de pré-cadastro.
 *
 * Esta função redefine os estados dos campos relacionados aos dados do usuário,
 * esvaziando os valores previamente preenchidos.
 * Ideal para ser chamada após o envio bem-sucedido do formulário ou quando for necessário reiniciar o preenchimento.
 *
 * @function
 * @returns {void}
 *
 * @sideEffects
 * - Altera o estado de todos os campos vinculados ao formulário.
 *
 * @example
 * // Após envio bem-sucedido:
 * clearInputs();
 */

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
        setLastName('')
    }



    /**
   * Valida e formata o CPF informado.
   *
   * Esta função limpa o CPF de caracteres indesejados (como pontos e traços), 
   * e em seguida, utiliza a função `validarCPF` para verificar se o CPF é válido.
   * Se inválido, exibe um alerta e limpa o campo.
   *
   * @function
   * @returns {void}
   *
   * @sideEffects
   * - Atualiza o estado `cpf` com a versão limpa ou com uma string vazia em caso de erro.
   * - Exibe um alerta se o CPF for inválido.
   *
   * @example
   * // Em um campo de input ao perder o foco:
   * validacpf();
   */

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

    /**
     * Componente de formulário para pré-cadastro de psicólogos no sistema Tivi AI.
     *
     * Este formulário coleta dados obrigatórios para análise da equipe, incluindo
     * informações pessoais e profissionais como nome, CPF, CRP, e-mail, telefones,
     * e data de nascimento. Os dados são validados (como idade e CPF) e enviados via
     * requisição `POST` para a API interna (`/api/analize_psco`).
     * 
     * Funcionalidades:
     * - Verifica se o usuário tem mais de 18 anos.
     * - Valida o CPF no evento `onBlur`.
     * - Permite definir DDI para telefones.
     * - Oculta campo CFP, preenchendo automaticamente com o CRP.
     * - Após submissão bem-sucedida, os campos são limpos.
     * 
     * @component
     * @returns {JSX.Element} JSX do formulário de cadastro de psicólogos.
     *
     * @example
     * return (
     *   <FormularioCadastroPsicologo />
     * )
     *
     * @sideEffects
     * - Mostra alertas em casos de erro ou sucesso.
     * - Redireciona para a página inicial ao cancelar.
     * - Atualiza múltiplos estados locais com `useState`.
     */

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
                                <label className="text-sm font-medium">  Primeiro Nome:</label>
                                <input type="text"
                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => setNome(e.target.value)}
                                    value={nome}
                                    required
                                />
                                <label className="text-sm font-medium"> Sobrenome:</label>
                                <input type="text"
                                    className="border border-gray-300 rounded p-1"
                                   onChange={(e) => setLastName(e.target.value)}
                                    value={lastName} 
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
                                <label className="text-sm font-medium">  RG:</label>
                                <input
                                    type="text"
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
                            <div className="flex flex-col">
                                <label className="text-sm font-medium">Registro CRP:</label>
                                <input type="text"
                                    title='Esse numero será verificado no portal do Conselho Regional de Psicologia'
                                    className="border border-gray-300 rounded p-1"
                                    onChange={(e) => {
                                        setCRP(e.target.value)
                                        setCFP(e.target.value)
                                    }}
                                    value={crp}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="hidden text-sm font-medium">Registro CFP:</label>
                                <input
                                    type="text"
                                    title='Esse numero será verificado no portal do Conselho Federal de Psicologia'
                                    className="hidden border border-gray-300 rounded p-1"
                                    value={crp}
                                    onChange={(e) => setCFP(crp)}

                                />
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
                            </div>
                            
                        </div>

                        <div className="grid grid-cols-2 w-full  gap-6 mt-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium"> Celular 1:</label>
                                <div className="flex flex-row w-full">
                                    <select
                                        className="border border-gray-300 rounded p-1"
                                        value={ddi}
                                        onChange={(e) => setDDI(e.target.value)}
                                    >
                                        <option value="+1">🇺🇸+1</option>
                                        <option value="+44">🇬🇧+44</option>
                                        <option value="+55">🇧🇷+55</option>
                                        <option value="+33">🇫🇷+33</option>
                                        <option value="+49">🇩🇪+49</option>
                                        <option value="+34">🇪🇸+34</option>
                                        <option value="+81">🇯🇵+81</option>
                                        <option value="+86">🇨🇳+86</option>
                                        <option value="+351">🇵🇹+351</option>
                                        <option value="+91">🇮🇳+91</option>
                                        {/* Adicione mais DDI conforme necessário */}
                                    </select>


                                    <input
                                        type="text"
                                        className="border w-full border-gray-300 rounded p-1"
                                        onChange={(e) => {
                                            setTelefone(e.target.value);
                                        }}
                                        value={telefone}
                                        required
                                    />
                                </div>

                            </div>


                            <div className="flex flex-col">
                                <label className="text-sm font-medium"> Celular 2:</label>

                                <div className="flex flex-row w-full">
                                    <select
                                        className="border border-gray-300 rounded p-1"
                                        value={ddi2}
                                        onChange={(e) => setDDI2(e.target.value)}
                                    >
                                        <option value="+1">🇺🇸+1</option>
                                        <option value="+44">🇬🇧+44</option>
                                        <option value="+55">🇧🇷+55</option>
                                        <option value="+33">🇫🇷+33</option>
                                        <option value="+49">🇩🇪+49</option>
                                        <option value="+34">🇪🇸+34</option>
                                        <option value="+81">🇯🇵+81</option>
                                        <option value="+86">🇨🇳+86</option>
                                        <option value="+351">🇵🇹+351</option>
                                        <option value="+91">🇮🇳+91</option>
                                        {/* Adicione mais DDI conforme necessário */}
                                    </select>


                                    <input
                                        type="text"
                                        className="border w-full border-gray-300 rounded p-1"
                                        onChange={(e) => {
                                            setCelular(e.target.value);
                                        }}
                                        value={celular}
                                        required
                                    />
                                </div>

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
