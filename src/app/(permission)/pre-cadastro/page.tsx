
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
import { validarCPF } from "../../util/validarCPF";
import ModalConsent from "../../(general-policies)/components/modal-consent";
import { showErrorMessage, showInfoMessage, showSuccessMessage } from "../../util/messages";





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

    const [dados, setDados] = useState({})

    const [invalid, setInvalid] = useState<string>('')

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
 */
    const defIdade = (data: string) => Math.floor((new Date().getTime() - new Date(data).getTime()) / (365.25 * 24 * 60 * 60 * 1000));




    /**
 * Idade atual do usuário calculada com base na data de nascimento fornecida no formulário.
 * Atualiza dinamicamente conforme o valor de `nasc` muda.
 */
    const idade = useMemo(() => defIdade(nasc), [nasc])

    const [showModal, setShowModal] = useState(false); // ou false inicialmente, se preferir
    const [consentido, setConsentido] = useState<boolean | null>(null);

    const handleConsent = (consent: boolean) => {
        setShowModal(false);
        setConsentido(consent);

    };



    const userData = {
        nome: nome,
        cpf: cpf,
    };





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
        event.preventDefault();

        // Validação antes de enviar
        if (idade < 18) {
            showErrorMessage('Você não tem idade pra utilizar o sistema!');
            return;
        } else if (!consentido) {
            showErrorMessage('Você precisa assinar o nosso Termo de Privacidade, Uso e Proteção de Dados!');
            return
        } else {

            const dados = {
                cpf,
                cfp,
                crp,
                nome,
                lastname: lastName,
                rg,
                email,
                data_nasc: nasc,
                celular: ddi2 + celular,
                telefone: ddi + telefone,
            };

            try {
                const response = await fetch("/api/solicitar-acesso", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dados),
                });

                const result = await response.json();

                if (response.ok) {
                    showSuccessMessage(`Pré-cadastro realizado com sucesso!
                     A equipe TiviAi vai verificar suas informçções e enviaremos seus dados de acesso no email informado`);
                    clearInputs();
                } else {
                    showErrorMessage("Dados não foram salvos no banco de dados");

                }
            } catch (error) {
                showErrorMessage("Erro no envio de dados: " + error);
            } finally {
                showInfoMessage("Processo finalizado!");
            }
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
        setInvalid('')
        setCFP('')
        setCRP('')
        setRG('')
        setNasc('')
        setEmail('')
        setTelefone('')
        setCelular('')
        setNome('')
        setLastName('')
        setConsentido(false)

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
        const cpf_format = (cpf: string) => cpf.replace(/[.-0-9]/g, '');
        // Exemplo de uso:
        setCPF(cpf_format)
        try {
            const cpfLimpo = validarCPF(invalid);
            setCPF(cpfLimpo)
            setInvalid(cpfLimpo)
        } catch (error) {
            if (error) {
                showErrorMessage('Cpf invalido!')
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

    //teste


    return (
        <>

            <div className="flex justify-center items-start mt-24 px-4 sm:px-6">
                <ModalConsent show={showModal} onConsent={handleConsent} userData={userData} />

                <form onSubmit={handleSubmit} className="w-full max-w-6xl">
                    <div className="relative w-full bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">

                        {/* Header */}
                        <div className="w-full bg-gray-100 border border-gray-300 rounded-lg flex flex-col sm:flex-row items-center gap-4 px-4 py-4">
                            <BsFillFileEarmarkMedicalFill size={40} />
                            <h1 className="text-xl sm:text-2xl font-extrabold text-center sm:text-left">
                                Sou psicólogo e quero usar todo o poder do Tivi AI
                            </h1>
                        </div>

                        {/* Info */}
                        <div className="mt-5 border-b border-gray-300 pb-2 flex items-start gap-2">
                            <IoIosInformationCircle size={20} />
                            <h2 className="text-sm sm:text-base font-semibold">
                                Informe seus dados de psicólogo abaixo. Nossa equipe pode levar até 48h para analisar seu pedido.
                            </h2>
                        </div>

                        {/* Formulário */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {/* Coluna 1 */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Primeiro Nome:</label>
                                <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setNome(e.target.value)} value={nome} required />

                                <label className="text-sm font-medium">Sobrenome:</label>
                                <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setLastName(e.target.value)} value={lastName} required />

                                <label className="text-sm font-medium">CPF:</label>
                                <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setInvalid(e.target.value)} value={invalid} onBlur={validacpf} required />

                                <label className="text-sm font-medium">RG:</label>
                                <input type="text" className="border border-gray-300 rounded p-2" value={rg} onChange={(e) => setRG(e.target.value.replace(/[^\d.-]/g, ''))} required />
                            </div>

                            {/* Coluna 2 */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Data de Nascimento:</label>
                                <input type="date" className="border border-gray-300 rounded p-2" value={nasc} onChange={(e) => setNasc(e.target.value)} onBlur={(e) => {
                                    const valor = e.target.value;
                                    const dataNascimento = new Date(valor);
                                    const hoje = new Date();
                                    const idade = hoje.getFullYear() - dataNascimento.getFullYear();
                                    const mes = hoje.getMonth() - dataNascimento.getMonth();
                                    const dia = hoje.getDate() - dataNascimento.getDate();
                                    const maiorDeIdade = idade > 18 || (idade === 18 && (mes > 0 || (mes === 0 && dia >= 0)));
                                    if (!maiorDeIdade) {
                                        showErrorMessage("Você precisa ser maior de 18 anos.");
                                        setNasc("");
                                    }
                                }} required />

                                <label className="text-sm font-medium">Registro CRP:</label>
                                <input type="text" className="border border-gray-300 rounded p-2" value={crp} onChange={(e) => {
                                    let valor = e.target.value.replace(/[^\d]/g, '');
                                    if (valor.length > 2) valor = valor.slice(0, 2) + '/' + valor.slice(2, 7);
                                    setCRP(valor); setCFP(valor);
                                }} required />

                                <label className="text-sm font-medium">E-mail:</label>
                                <input type="email" className="border border-gray-300 rounded p-2" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => {
                                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                    if (!regex.test(e.target.value)) {
                                        showErrorMessage("Email inválido!");
                                        setEmail("");
                                    }
                                }} required />
                            </div>
                        </div>

                        {/* Telefones */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {[{ label: "Celular 1", ddi, setDDI, value: telefone, setValue: setTelefone },
                            { label: "Celular 2", ddi: ddi2, setDDI: setDDI2, value: celular, setValue: setCelular }].map((cel, i) => (
                                <div className="flex flex-col gap-2" key={i}>
                                    <label className="text-sm font-medium">{cel.label}:</label>
                                    <div className="flex gap-2">
                                        <select className="border border-gray-300 rounded p-2" value={cel.ddi} onChange={(e) => cel.setDDI(e.target.value)}>
                                            <option value="+1">🇺🇸+1</option><option value="+44">🇬🇧+44</option><option value="+55">🇧🇷+55</option>
                                            <option value="+33">🇫🇷+33</option><option value="+49">🇩🇪+49</option><option value="+34">🇪🇸+34</option>
                                            <option value="+81">🇯🇵+81</option><option value="+86">🇨🇳+86</option><option value="+351">🇵🇹+351</option>
                                            <option value="+91">🇮🇳+91</option>
                                        </select>
                                        <input
                                            type="text"
                                            className="border w-full border-gray-300 rounded p-2"
                                            onChange={(e) => {
                                                let valor = e.target.value.replace(/\D/g, '');
                                                if (valor.length > 10) valor = valor.replace(/(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                                                else if (valor.length > 6) valor = valor.replace(/(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                                                else if (valor.length > 2) valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                                                else if (valor.length > 0) valor = valor.replace(/(\d{0,2})/, '($1');
                                                cel.setValue(valor);
                                            }}
                                            value={cel.value}
                                            required={i === 0}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                            <input type="submit" className="border border-gray-300 bg-blue-600 rounded-lg px-6 py-3 text-white font-bold cursor-pointer" value="Enviar solicitação" />
                            <input type="button" className="border border-gray-300 bg-lime-600 rounded-lg px-6 py-3 text-white font-bold cursor-pointer" value="Cancelar" onClick={() => router.push('/')} />
                        </div>

                        {/* Botão termos */}
                        <input
                            type="button"
                            onClick={() => setShowModal(true)}
                            value="Assinar Termos de Uso, Privacidade e Proteção de Dados"
                            className="mt-6 px-6 py-3 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-xs text-white font-semibold rounded-lg shadow-md cursor-pointer text-center transition duration-300 ease-in-out"
                        />
                    </div>
                </form>
            </div>

        </>







    );
};

export default Cadastro;
