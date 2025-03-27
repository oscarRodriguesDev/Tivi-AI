/**
 * Representa um psicólogo cadastrado na plataforma.
 *
 * @interface Psicologo
 */
interface Psicologo {
    /**
     * Identificador único do psicólogo.
     * @type {string}
     */
    id: string;
  
    /**
     * Nome completo do psicólogo.
     * @type {string}
     */
    name: string;
  
    /**
     * Endereço de e-mail do psicólogo.
     * @type {string}
     */
    email: string;
  
    /**
     * Número de registro profissional (ex: registro do conselho).
     * Opcional.
     * @type {string | undefined}
     */
    registro?: string;
  
    /**
     * Número do Cadastro de Pessoa Física (CPF).
     * Opcional.
     * @type {string | undefined}
     */
    cfp?: string;
  
    /**
     * Número do Conselho Regional de Psicologia (CRP).
     * Opcional.
     * @type {string | undefined}
     */
    crp?: string;
  
    /**
     * Número de celular do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    celular?: string;
  
    /**
     * Número de telefone fixo do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    telefone?: string;
  
    /**
     * Idade do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    idade?: string;
  
    /**
     * Cidade onde o psicólogo está localizado.
     * Opcional.
     * @type {string | undefined}
     */
    cidade?: string;
  
    /**
     * Estado (UF) onde o psicólogo está localizado.
     * Opcional.
     * @type {string | undefined}
     */
    uf?: string;
  
    /**
     * URL da foto de perfil do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    photoprofile?: string;
  
    /**
     * Descrição ou biografia do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    description?: string;
  
    /**
     * Senha do psicólogo (criptografada).
     * Opcional.
     * @type {string | undefined}
     */
    password?: string;
  
    /**
     * Indica se é o primeiro acesso do psicólogo.
     * Opcional.
     * @type {boolean | undefined}
     */
    first_acess?: boolean;

    /**
     * variavel para corrigir erro no build.
     * Opcional.
     * @type {boolean | undefined}
     */
    habilitado?: boolean;
}

/**
 * Reexporta a interface Psicologo.
 */
export type { Psicologo };
