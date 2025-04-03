export function generateTrasnctipionPrompt(
    paciente: string,
    transcrição: string,
    idadePaciente: string,
    dataConsulta: string,
    tipoPaciente: String,
    nomeResponsavel: string,
    psicologo: string,
    crp: string,
  ): string {
    return `analise essa  transcrição de uma consulta psicológica realizada por um profissional da área."${transcrição}
     Seu objetivo é extrair informações relevantes e estruturá-las no formato de um documento JSON que represente a "DPT - Devolutiva de Triagem Psicológica".
  
  Siga o modelo abaixo e, caso uma informação não tenha sido mencionada diretamente na transcrição, analise a transcrição e se aplicavel 
  atribua o valor de acordo com o padrão de falas do paciente, caso não seja possivel atribuir um valor, atribua "Nada consta na consulta.
   Você deve analisar somente as falas do paciente e não as falas do psicologo.
   nos InsightsGPT, gere insights para dar um ponto de partida para o psicologo atribuir um diagnostico.
  ".
  
  ---
  
  **Entrada:**
  - Transcrição da consulta psicológica
  
  **Saída esperada:**
  \`\`\`json
  {
    "IdentificacaoPaciente": {
      "Nome": "${paciente}",
      "Idade": ${idadePaciente},
      "DataTriagem": "${dataConsulta}",
      "TipoTriagem": "${tipoPaciente}",
      "NomeResponsavel": "${nomeResponsavel || "Não se aplica"}",
      "ProfissionalResponsavel": "${psicologo} | CRP ${crp}"
    },
    "IntroducaoAnamnese": "A anamnese psicológica foi realizada com o objetivo de levantar informações relevantes sobre o histórico do paciente, considerando aspectos emocionais, sociais, familiares e comportamentais. Este levantamento é essencial para compreender melhor as questões trazidas e estruturar um plano de intervenção adequado.",
    "ResumoAnamnese": {
      "HistoricoMedicoPsicologico": "[Registrar histórico médico e psicológico]",
      "HistoricoTratamentosPsicologicos": "[Registrar histórico de terapias anteriores]",
      "ContextoFamiliar": "[Descrever informações sobre a família e relações familiares]",
      "HistoricoAcademicoProfissional": "[Registrar dificuldades acadêmicas ou desafios profissionais]",
      "ComportamentoSocialFamiliar": "[Descrever padrões de relacionamento e comportamento]",
      "ReacaoEmocional": "[Registrar reações emocionais do paciente]",
      "ObservacoesAnsiedadeTimidez": "[Relatar sintomas observados, se mencionados]"
    },
    "EscutaAtivaEmpatica": {
      "PrincipaisDemandasRelatadas": "[Queixas principais do paciente]",
      "AspectosEmocionaisComportamentais": "[Emoções e comportamentos observados]",
      "FatoresDificuldades": "[Fatores que contribuem para as dificuldades do paciente]",
      "ImpactoEmocionalRelacional": "[Como as dificuldades afetam a vida do paciente]"
    },
    "DemandasPaciente": ["[Demanda 1]", "[Demanda 2]", "[Demanda 3, se aplicável]"] ,
    "InformacoesAdicionais": "[Registrar informações extras, se houver]",
    "HipotesesDiagnosticas": ["[Hipótese 1]", "[Hipótese 2, se aplicável]"] ,
    "TestesPsicologicosIndicados": "[Se houver indicação, mencionar a área de avaliação correspondente]",
    "PlanoTerapeuticoInicial": "[Registrar abordagem terapêutica sugerida]",
    "PlanoInvestimento": [
      {
        "Valor": "R$ [Valor]",
        "TempoSessao": "[Duração] minutos",
        "FormaPagamento": "[Pix / Transferência / Dinheiro / Cartão]",
        "FrequenciaSugerida": "[Semanal / Quinzenal / Mensal]",
        "PacoteAcompanhamento": "[Se houver, mencionar]"
      }
    ],
    "ConsideracoesFinais": "[Resumo geral de forma clara e objetiva]",
    "MensagensImportantes": [
      "Validação Profissional: Este documento deve ser analisado por um profissional qualificado registrado no CRP.",
      "Conformidade LGPD: Todas as informações seguem os princípios da LGPD, garantindo sigilo e ética profissional.",
      "Respeito ao Código de Ética Profissional: Este relatório foi elaborado conforme as diretrizes do Código de Ética do Psicólogo."
    ],
    "ProfissionalResponsavel": {
      "Nome": "${psicologo}",
      "CRP": "${crp}"
    },
    "InsightsGPT": "[Gerar recomendações e insights para auxiliar o psicólogo na interpretação do caso]"
  }
  
  Certifique-se de estruturar as informações de forma organizada e objetiva, 
  incluindo apenas informações que podem ser compartilhadas com o paciente. Gere insights relevantes 
  para auxiliar o psicólogo na interpretação e possíveis direcionamentos terapêuticos.`;
  }
  