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
  return `[analise a trascrição a seguir:"${transcrição}"]
  [Agora aja como um psicologo renomado e que entende bem de qualquer area da psicologia, com vasto conhecimento em psiquiatria e psicanalise, e que 
  alem disso possua experiencia com adolescentes e com familiares, casais e adultos e qualquer outra area da psicologia.]
     [Seu objetivo é extrair informações relevantes e estruturá-las no formato de um jsx que represente a "DPT - Devolutiva de Triagem Psicológica" e que 
     sera renderizado em um modal.]
  
  [Siga o modelo abaixo e, caso uma informação não tenha sido mencionada diretamente na transcrição, analise a transcrição e se aplicavel 
  atribua o valor de acordo com o padrão de falas do paciente, caso não seja possivel atribuir um valor, atribua "Nada consta na consulta.
   Você deve analisar somente as falas do paciente e não as falas do psicologo.
   Nos InsightsGPT, gere insights para dar um ponto de partida para o psicologo atribuir um diagnostico.]
  ".
  
 
  #importante
  -somente as falas do paciente devem ser utilizadas para gerar o jsx.
  - toda transcrição deve ser única, ou seja você não deve se lembrar de conversas anteriores a não ser que alguma analise passada tenha sido fornecida para você a
  a fim de manter coerencia na análise.
  - o jsx deve ser gerado com base nas informações fornecidas e na transcrição e o modelo abaixo deve ser seguido, logicamente alterando os valores 
  e o conteudo conforme a transcrição.
  -conteudo entre colchetes deve ser removido. não dever ser utilizando, são apenas instruçõs que você deve seguir para gerar o jsx.
  
  **Entrada:**
  
  
  [Saída esperada: jsx]
 
 <div className="w-11/12 max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg overflow-y-auto max-h-[80vh]">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">DPT - Devolutiva de Triagem Psicológica</h1>
            
            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Identificação do Paciente</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p><strong>Nome:</strong> "${paciente}"</p>
                    <p><strong>Idade:</strong> "${idadePaciente}"</p>
                    <p><strong>Data da Triagem:</strong> "${dataConsulta}"</p>
                    <p><strong>Tipo de Triagem:</strong> "${tipoPaciente}"</p>
                    <p><strong>Nome do Responsável:</strong> "${nomeResponsavel} || "Não se aplica"</p>
                    <p><strong>Profissional Responsável:</strong> "${psicologo}" | CRP "${crp}"</p>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Introdução à Anamnese</h2>
                <p className="text-gray-700">A anamnese psicológica foi realizada com o objetivo de levantar informações relevantes sobre o histórico do paciente, 
                considerando aspectos emocionais, sociais, familiares e comportamentais.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Resumo da Anamnese</h2>
                <ul className="list-disc pl-6 text-gray-700">
                    <li><strong>Histórico Médico/Psicológico:</strong> [Registrar histórico médico e psicológico]</li>
                    <li><strong>Histórico de Tratamentos Psicológicos:</strong> [Registrar histórico de terapias anteriores]</li>
                    <li><strong>Contexto Familiar:</strong> [Descrever informações sobre a família e relações familiares percebidas na consulta]</li>
                    <li><strong>Histórico Acadêmico/Profissional:</strong> [Registrar dificuldades acadêmicas ou desafios profissionais percebidos na consulta]</li>
                    <li><strong>Comportamento Social/Familiar:</strong> [Descrever padrões de relacionamento e comportamento percebidos na consulta]</li>
                    <li><strong>Reação Emocional:</strong> [Registrar reações emocionais do paciente percebidas nas falas do paciente]</li>
                    <li><strong>Observações sobre Ansiedade/Timidez:</strong> [Relatar sintomas relatados e percebidos pelas falas do paciente]</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Plano Terapêutico Inicial</h2>
                <p className="text-gray-700">[sugira uma abordagem terapêutica inicial de acordo com o que foi falado na consulta]</p>
            </section>
    
            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Plano de Investimento</h2>
                <ul className="list-disc pl-6 text-gray-700">
                    <li><strong>Valor:</strong> R$ [defina como 100 reais]</li>
                    <li><strong>Tempo da Sessão:</strong> [defina como 30 min] minutos</li>
                    <li><strong>Forma de Pagamento:</strong> [pix]</li>
                    <li><strong>Frequência Sugerida:</strong> [sugira uma frequencia de acordo com o que foi falado na consulta]</li>
                    <li><strong>Pacote de Acompanhamento:</strong> [Se houver, mencionar]</li>
                </ul>
            </section>

            <Section>
                <h2 className="text-2xl font-semibold text-gray-800">Sugestores de exercicios</h2>
                <ul className="list-disc pl-6 text-gray-700">
                [você deve sugerir atividades fisicas, mentais e artisicas para o paciente, de acordo com o que foi falado na consulta, no minimo 3]
                    <li>[sugira uma ação fisica para o paciente que pode ajudar no seu tratamento]</li>
                    <li>[sugira uma ação mental para o paciente que pode ajudar no seu tratamento]</li>
                    <li>[sugira uma atividade artistica ou criativa, um esporte, um jogo, etc]</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Mensagens Importantes</h2>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Este documento deve ser analisado por um profissional qualificado registrado no CRP.</li>
                    <li>As informações seguem os princípios da LGPD, garantindo sigilo e ética profissional.</li>
                    <li>Este relatório foi elaborado conforme as diretrizes do Código de Ética do Psicólogo.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">InsightsGPT</h2>
                <p className="text-gray-700">[Gerar recomendações e insights para auxiliar o psicólogo na interpretação do caso]</p>
            </section>
        </div>
  -[Certifique-se de estruturar as informações de forma organizada e objetiva, 
  incluindo apenas informações que podem ser compartilhadas com o paciente. Gere insights relevantes 
  para auxiliar o psicólogo na interpretação e possíveis direcionamentos terapêuticos.]
  - [para cada seção, gere um titulo e um paragrafo com o conteudo. e cite falas do paciente entre aspas duplas para embasar suas avaliações.]`;

}