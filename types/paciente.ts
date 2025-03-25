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
   * Sexo do paciente.
   * Pode ser "masculino", "feminino" ou outro valor conforme necessidade.
   */
  sexo: string;

  /**
   * CEP do endereço do paciente.
   */
  cep: string;

  /**
   * Cidade onde o paciente reside.
   */
  cidade: string;

  /**
   * Bairro onde o paciente reside.
   */
  bairro: string;

  /**
   * Rua onde o paciente reside.
   */
  rua: string;

  /**
   * Número do endereço do paciente.
   */
  numero: string;

  /**
   * País de origem ou naturalidade do paciente.
   */
  pais: string;

  /**
   * Complemento do endereço (ex: apartamento, bloco).
   */
  complemento: string;

  /**
   * Estado onde o paciente reside.
   */
  estado: string;

  /**
   * E-mail do paciente.
   */
  email: string;

  /**
   * RG do paciente.
   */
  rg: string;

  /**
   * Identificador do psicólogo responsável pelo paciente.
   * Esse campo faz referência ao psicólogo que cuida do paciente.
   */
  psicologoId: string; // Ajuste do campo para refletir o nome correto
}
