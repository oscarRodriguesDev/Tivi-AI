"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useId } from "react";
import Image from "next/image";
import tiviai from "../../../../../public/patern_capa/banner_pattern.png";
import capa_default from "../../../../../public/patern_capa/tivia.jpg";
import userDefault from "../../../../../public/profile_pictures_ps/userdefault.png";
import AlteracaoSenha from "../../components/trocar_senha";
import { Psicologo } from "../../../../../types/psicologos";
import LoadingNoHidration from "../../components/noHidration";



/**
 * Componente de perfil do psicólogo.
 *
 * Este componente permite visualizar e editar as informações do psicólogo,
 * incluindo nome, contato, registro profissional, descrição e foto de perfil.
 *
 * Funcionalidades principais:
 * - Buscar dados do psicólogo no banco de dados via API.
 * - Permitir a edição dos dados cadastrais.
 * - Alterar a senha com criptografia (bcrypt).
 * - Fazer upload e atualização da foto de perfil.
 * - Controlar o fluxo de primeiro acesso com validação de senha.
 *
 * @component
 * @returns {JSX.Element} Interface de perfil do psicólogo.
 */
const Perfil = () => {
    const { id } = useParams<{ id: string }>();
    const [psicologo, setPsicologo] = useState<Psicologo | null>(null);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState<Psicologo | null>(null);
    const [alterar, setAlterar] = useState<boolean>(false);
    const [renderBox, setRenderBox] = useState<boolean>(false);

    /**
     * Busca os dados do psicólogo no banco de dados.
     *
     * Esta função realiza uma requisição à API para obter os dados do psicólogo
     * com base no `userId` fornecido. Os dados recebidos são armazenados nos estados
     * `psicologo` e `formData`.
     *
     * @async
     * @function fetchUserData
     * @param {string} userId - O ID do psicólogo a ser buscado.
     * @returns {Promise<void>} Não retorna valor diretamente, mas atualiza os estados do componente.
     *
     * @throws {Error} Lança um erro caso a requisição falhe ou a resposta não seja bem-sucedida.
     */
    async function fetchUserData(userId: string) {
        try {
            const res = await fetch(`/api/user-profile?id=${userId}`);
            if (!res.ok) {
                throw new Error("Erro ao buscar dados do usuário");
            }
            const data = await res.json();
            console.log("Dados recebidos:", data);
            setPsicologo(data);
            setFormData(data);
        } catch (error) {
            alert(`Erro ao buscar dados do psicólogo:${error}`);
        }
    }

    /* Esse UseEfect esta impedindo erro na pagina caso não possua id na url */
    useEffect(() => {
        if (id) {
            fetchUserData(id);
        }
    }, [id]);

    /**
    * Controla a renderização do componente de troca de senha.
    *
    * Regras:
    * - Renderiza o componente (`setRenderBox(true)`) se:
    *   - O usuário for um psicólogo e ainda não tiver feito o primeiro acesso (first_acess === false)
    *   - Ou se a flag `alterar` estiver ativada manualmente
    * - Caso contrário, oculta o componente (`setRenderBox(false)`)
    *
    * @param {object} psicologo - Objeto do psicólogo logado
    * @param {boolean} alterar - Flag que indica se o componente deve ser aberto manualmente
    * @param {Function} setRenderBox - Função que ativa/desativa a renderização do componente
    */
    useEffect(() => {
        if (!psicologo) return

        const deveRenderizar = psicologo.first_acess || alterar
        setRenderBox(deveRenderizar)
    }, [alterar])

    /**
     * Manipula as alterações nos campos de entrada do formulário.
     *
     * Atualiza o estado `formData` com os valores inseridos pelo usuário
     * em campos de entrada (`input` ou `textarea`).
     *
     * @function handleChange
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Evento de mudança no campo de entrada.
     * @returns {void} Não retorna nenhum valor.
     */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (!formData) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Salva as alterações feitas no perfil do psicólogo.
     *
     * Atualiza o estado `psicologo` com os dados do formulário,
     * chama a função `handleUpdate` para persistir as alterações no banco de dados
     * e desativa o modo de edição.
     *
     * @async
     * @function handleSave
     * @returns {Promise<void>} Não retorna nenhum valor explícito.
     */
    const handleSave = async () => {
        setPsicologo(formData);
        await handleUpdate();
        setEditando(false);
    };



    /**
     * Função responsável por atualizar os dados do perfil do psicólogo.
     * Envia uma requisição PUT para a API com as informações atualizadas e, caso tenha sucesso, atualiza o estado do psicólogo.
     * Exibe uma mensagem de sucesso ou erro conforme o resultado da operação.
     *
     * @async
     * @function handleUpdate
     * @returns {Promise<void>} Retorna uma promessa que não resolve com valor, apenas executa a atualização e exibe os alertas correspondentes.
     */
    const handleUpdate = async () => {
        if (!formData) return;


        try {
            const { id, ...restOfFormData } = formData || {}; // Desestruturando o formData
            const payload = { id: psicologo?.id, ...restOfFormData };

            const res = await fetch(`/api/user-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Erro ao atualizar perfil");

            const updatedUser = await res.json();
            setPsicologo(updatedUser);
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            alert("Falha ao atualizar perfil. Tente novamente.");
        }
    };

    /**
     * Função responsável por lidar com a alteração do arquivo de imagem (foto de perfil).
     * Realiza o upload do arquivo para o servidor e atualiza a URL da foto de perfil no estado do formulário.
     * Exibe um alerta caso ocorra algum erro durante o upload.
     *
     * @async
     * @function handleProfilePictures
     * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança de arquivo do input de tipo arquivo.
     * @returns {Promise<void>} Retorna uma promessa que não resolve com valor, apenas executa o upload e atualiza o estado do formulário.
     */
    const handleProfilePictures = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !formData) return;

        try {
            const fileData = new FormData();
            fileData.append("file", file);

            const res = await fetch("/api/uploads/?path=profile-pictures", {
                method: "POST",
                body: fileData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erro no upload");
            }

            const data = await res.json();
            alert("Foto de perfil atualizada!");

            // Atualiza com a URL correta
            setFormData((prevFormData) =>
                prevFormData ? { ...prevFormData, photoprofile: data.url } : null
            );
        } catch (error) {
            alert("Erro ao enviar a foto. Tente novamente.");
        }
    };




    //função para alterar banner
    const handleBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !formData) return;

        try {
            const fileData = new FormData();
            fileData.append("file", file);

            const res = await fetch("/api/uploads/?path=banner", {
                method: "POST",
                body: fileData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erro no upload");
            }

            const data = await res.json();
            alert("Banner atualizado!");

            // Atualiza com a URL correta
            setFormData((prevFormData) =>
                prevFormData ? { ...prevFormData, banner: data.url } : null
            );
        } catch (error) {
            alert("Erro ao enviar o banner. Tente novamente.");
        }
    };



    /**
  * Condicional que verifica se os dados do psicólogo ou o formulário estão carregados.
  * Caso contrário, exibe a mensagem de "Carregando..." enquanto os dados são carregados.
  *
  * @returns {LoadingNoHidration} O componente de carregamento ou o conteúdo do perfil do psicólogo.
  */

    if (!psicologo || !formData) {
        return (
            //componente de carregamento para evitar o erro de Hidratatiosn
            <LoadingNoHidration />
        );
    } else

        return (
            <>

                {!renderBox ? (

                    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
                        {/* Banner */}
                        {!editando ? (
                            <div className="w-full h-60 bg-gray-800">
                                <Image
                                    src={formData.banner || capa_default}
                                    width={800}
                                    height={375}
                                    alt="Banner"
                                    quality={100}
                                    className="w-full h-60"
                                />
                            </div>

                        ) : (
                            /* 1472 x375 padrão do banner*/

                            <div className="w-full rounded-xl overflow-hidden border border-gray-300 shadow-md bg-white">
                                <div className="relative w-full h-60 bg-gray-800">
                                    <Image
                                        src={tiviai}
                                        width={800}
                                        height={375}
                                        alt="Banner"
                                        quality={100}
                                        className=" w-full h-60"
                                    />
                                </div>

                                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <label
                                        htmlFor="file-input"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Escolha uma foto de banner
                                    </label>

                                    <input
                                        name="banner"
                                        id="file-input"
                                        type="file"
                                        className="absolute top-0 w-full sm:w-auto text-sm text-gray-700 
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100 transition duration-150 ease-in-out"
                                        onChange={handleBanner}
                                    />
                                </div>
                            </div>



                        )}


                        {/* Perfil */}
                        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg -mt-16 p-6 flex flex-col items-center">
                            {editando ? (
                                /* edição de dados do perfil */

                                <>
                                    <label htmlFor="foto">Escolha uma foto de perfil</label>
                                    <input
                                        name="foto"
                                        id="file-input"
                                        type="file"
                                        onChange={handleProfilePictures} // Atualiza a foto ao selecionar
                                        placeholder="Foto de perfil"
                                    />
                                </>
                            ) : (
                                <Image
                                    src={formData.photoprofile || userDefault}
                                    alt="imagem de perfil"
                                    width={75}
                                    height={75}
                                    className="w-20 h-20 rounded-full object-cover" // Usando as classes Tailwind
                                />
                            )}

                            <h1 className="text-2xl font-bold text-gray-800 mt-4">
                                {psicologo.nome}
                            </h1>
                            <p className="text-gray-600">{psicologo.email}</p>

                            <button
                                onClick={() => setEditando(!editando)}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                {editando ? "Cancelar" : "Editar Perfil"}
                            </button>
                            {editando && (
                                <button
                                    onClick={handleSave}
                                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    Salvar
                                </button>
                            )}
                        </div>

                        {/* Informações Profissionais */}
                        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                Informações Profissionais
                            </h2>
                            {editando ? (
                                <>
                                    <label htmlFor="description">Bio</label>
                                    <textarea
                                        name="description"
                                        value={formData.description || ''}
                                        onChange={handleChange}
                                        className="w-full border p-2 mt-2"
                                    />

                                    <button>Alterar senha</button>
                                    <label htmlFor="registro">Registro</label>
                                    <input
                                        type="text"
                                        name="registro"
                                        value={formData.registro || ""}
                                        onChange={handleChange}
                                        className="w-full border p-2 mb-2"
                                        placeholder="Registro"
                                    />
                                    <label htmlFor="crp">CRP</label>
                                    <input
                                        type="text"
                                        name="crp"
                                        value={formData.crp || ""}
                                        onChange={handleChange}
                                        className="w-full border p-2 mb-2"
                                        placeholder="CRP"
                                    />
                                    <label htmlFor="cfp">CFP</label>
                                    <input
                                        type="text"
                                        name="cpf"
                                        value={formData.cpf || ""}
                                        onChange={handleChange}
                                        className="w-full border p-2 mb-2"
                                        placeholder="Cpf"
                                    />
                                    <label htmlFor="idade">Idade</label>
                                    <input
                                        type="text"
                                        name="idade"
                                        value={formData.idade || ""}
                                        onChange={handleChange}
                                        className="w-full border p-2 mb-2"
                                        placeholder="idade"
                                    />
                                    <label htmlFor="celular">Celular</label>
                                    <input
                                        type="text"
                                        name="celular"
                                        value={formData.celular || ""}
                                        onChange={handleChange}
                                        className="w-full border p-2 mb-2"
                                        placeholder="Celular"
                                    />
                                    <label htmlFor="telefone">Telefone</label>
                                    <input
                                        type="text"
                                        name="telefone"
                                        value={formData.telefone || ""}
                                        onChange={handleChange}
                                        className="w-full border p-2 mb-2"
                                        placeholder="Telefone"
                                    />
                                    <label htmlFor="cidade">Cidade</label>
                                    <input
                                        type="text"
                                        name="cidade"
                                        value={formData.cidade || ""}
                                        onChange={handleChange}
                                        className="w-full border p-2 mb-2"
                                        placeholder="Cidade"
                                    />
                                    <label htmlFor="UF">UF</label>
                                    <input
                                        type="text"
                                        name="uf"
                                        value={formData.uf || ""}
                                        onChange={handleChange}
                                        className="w-full border p-2 mb-2"
                                        placeholder="Estado"
                                    />
                                </>


                            ) : (
                                /* Dados renderizados caso não esteja editando */
                                <>
                                    <p className="text-gray-500 mt-2 text-center">
                                        {psicologo.description || "descrição de psicologo"}
                                    </p>
                                    <p>
                                        <strong>Registro:</strong>{" "}
                                        {psicologo.registro || "Não informado"}
                                    </p>
                                    <p>
                                        <strong>CRP:</strong> {psicologo.crp || "Não informado"}
                                    </p>

                                    <p>
                                        <strong>Idade:</strong> {psicologo.idade || "Não informado"}
                                    </p>
                                    <p>
                                        <strong>Celular:</strong>{" "}
                                        {psicologo.celular || "Não informado"}
                                    </p>
                                    <p>
                                        <strong>Telefone:</strong>{" "}
                                        {psicologo.telefone || "Não informado"}
                                    </p>
                                    <p>
                                        <strong>Cidade:</strong> {psicologo.cidade || "Não informado"}
                                    </p>
                                    <p>
                                        <strong>Estado:</strong> {psicologo.uf || "Não informado"}
                                    </p>

                                    <input
                                        type="button"
                                        value="Trocar senha"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                        onClick={() => {
                                            setAlterar(!alterar);
                                            alert(alterar);

                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <>

                        <div className="flex justify-center items-center min-h-screen bg-gray-100">
                            <AlteracaoSenha
                                id={id}
                                email={formData.email}
                                nome={formData.nome}
                                password={formData.password}
                                first_acess={formData.first_acess}
                                lastname={formData.lastname}
                            />
                        </div>
                    </>
                )}
            </>
        );
};

export default Perfil;
//subindo alteraçãoes para a homologação