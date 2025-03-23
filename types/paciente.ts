// types/paciente.d.ts

/**
 * Representa um paciente no sistema.
 */
export interface Paciente {
    /**
     * Identificador único do paciente.
     * Será gerado automaticamente como UUID.
     */
    id: string;
  
    /**
     * Nome completo do paciente.
     */
    nome: string;
  
    /**
     * Nome fantasia do paciente, caso aplicável.
     */
    fantasy_name: string;
  
    /**
     * CPF do paciente. Este campo é único e não pode se repetir.
     */
    cpf: string;
  
    /**
     * Idade do paciente.
     */
    idade: string;
  
    /**
     * Descrição dos sintomas do paciente.
     */
    sintomas: string;
  
    /**
     * Número de telefone do paciente.
     */
    telefone: string;
  
    /**
     * Nome do convênio do paciente.
     */
    convenio: string;
  
    /**
     * Identificador do psicólogo responsável pelo paciente.
     * Esse campo faz referência ao psicólogo que cuida do paciente.
     */
    psicoloId: string;
  }
  