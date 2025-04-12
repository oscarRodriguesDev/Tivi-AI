

const psicologo= 'Tatiane Fontes'
const paciente =  'tiago'
const idade = 30
const crp = '0001010'
const prompt = `Prompt para Geração de Documento Pós-Consulta Psicológica


Instruções para o Modelo GPT:
Você receberá a transcrição completa de uma consulta psicológica. Seu objetivo é analisar o conteúdo e gerar um documento de "Devolutiva de Triagem Psicológica" 
conforme o formato estabelecido abaixo.
Caso algum dado necessário não seja encontrado na transcrição, registre-o como "Dado não encontrado". você precisa analisar somente as falas do paciente, 
e analisando toda a conversa e falas do paciente perceber padrões que denotem os dados que preencham o documento abaixo:

# DPT - DEVOLUTIVA DE TRIAGEM PSICOLÓGICA
1. Identificação do Paciente
- Nome: ${paciente}
- Idade: ${idade}
- Data da Triagem: [Data]
- Tipo de Triagem: [Adulto / Criança ou Adolescente - realizada com o responsável]
- Nome do Responsável (se aplicável): [Nome do Responsável]
- Profissional Responsável: ${psicologo}, CRP: ${crp}

2. Introdução da Anamnese  
A anamnese psicológica foi realizada com o objetivo de levantar informações relevantes sobre o histórico do paciente, considerando aspectos emocionais, sociais, familiares e comportamentais. Este levantamento é essencial para compreender melhor as questões trazidas e estruturar um plano de intervenção adequado.

3. Resumo da Anamnese 
- Histórico médico e psicológico: [Dado não encontrado]
- Histórico de tratamentos psicológicos anteriores: [Dado não encontrado]
- Contexto familiar: [Dado não encontrado]
- Histórico acadêmico e profissional: [Dado não encontrado]
- Comportamento no ambiente social e familiar: [Dado não encontrado]
- Reação emocional: [Dado não encontrado]
- Ansiedade, timidez ou outras observações: [Dado não encontrado]

4. Escuta Ativa e Empática da Consulta  
- Principais demandas relatadas: [Dado não encontrado]
- Aspectos emocionais e comportamentais observados: [Dado não encontrado]
- Fatores que podem estar contribuindo para as dificuldades enfrentadas: [Dado não encontrado]
- Impacto emocional e relacional identificado durante a consulta: [Dado não encontrado]

5. Demandas Relatadas pelo Paciente/Responsável  
1. [Dado não encontrado]
2. [Dado não encontrado]
3. [Dado não encontrado]

6. Informações Adicionais da Consulta  
[Dado não encontrado]

7. Hipóteses Diagnósticas
IMPORTANTE: As informações a seguir não representam um diagnóstico fechado, mas sim hipóteses diagnósticas baseadas nos relatos do paciente, suas queixas e observações clínicas.
1. [Dado não encontrado]
2. [Dado não encontrado]
3. [Dado não encontrado]

8. Avaliação de Testes Psicológicos Indicados  
[Dado não encontrado]

9. Plano Terapêutico Inicial  
[Dado não encontrado]

10. Plano de Investimento  
- Valor por sessão: R$ [Valor]
- Tempo estimado por sessão: [Duração] minutos
- Forma de pagamento: Pix / Transferência / Dinheiro / Cartão
- Frequência sugerida: [Semanal / Quinzenal / Mensal]
- Pacote de acompanhamento: [Se houver, mencionar opções de desconto]

11. Considerações Finais 
(Resumo geral da consulta de forma clara e objetiva.)

Mensagens Importantes  
- Validação Profissional: Este documento deve ser analisado e validado por um profissional qualificado registrado no CRP.
- Conformidade com a LGPD: Todas as informações seguem os princípios da Lei Geral de Proteção de Dados (LGPD), garantindo sigilo e ética profissional.
- Respeito ao Código de Ética Profissional: Este relatório segue as diretrizes do Código de Ética do Psicólogo.

Profissional Responsável:
- Nome: ${psicologo}
- CRP: ${crp}

Observações:
- Você deve extrair padroes na transcrição da para que possa  preencher os campos correspondentes.
- Caso alguma informação não seja encontrada, registre o que voce encontrou e o que voce acha que pode ser preenchido.
- A formatação do documento: deve ser em formato json.
- como estamos fazendo testes não limite sua criatividade e invente dados para completar o documento.
- ao finalizar a geração do documento, quero que voce me retorne o documento  em formato json.
A seguir segue transcrição da consulta:`


export default  prompt ;
//subindo para a branch de dev
