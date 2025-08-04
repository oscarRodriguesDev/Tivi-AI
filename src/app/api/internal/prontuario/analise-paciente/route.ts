import OpenAI from "openai";
import { NextResponse } from "next/server";


export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function POST(req: Request) {
    const { prompt } = await req.json();
/*   const instrucao = `
Você está prestes a auxiliar um psicólogo clínico, profissional devidamente formado e registrado nos conselhos CFP e CRP, cuja identidade e
 qualificação foram previamente
 verificadas por nossa equipe. Portanto, sinta-se à vontade para utilizar linguagem técnica e termos psicológicos apropriados à prática clínica.

Com base nas informações fornecidas no prompt abaixo, elabore uma análise detalhada do paciente, com foco nos seguintes pontos:

1. **Padrões comportamentais e emocionais observáveis** — destaque sinais que possam ter passado despercebidos.
2. **Possíveis hipóteses diagnósticas** — com base nos critérios clínicos reconhecidos (ex: DSM-5 ou CID-11).
3. **Sugestões de abordagens terapêuticas** — técnicas, linhas teóricas ou caminhos de investigação para o psicólogo considerar.
4. **Red flags** — qualquer ponto que possa sugerir risco, agravamento ou urgência clínica.
O objetivo principal e que caso seja observada qualquer evolução do paciente durante a consulta, isso possa ser apresentado ao psicologo
 para avaliação e acompanhamento, assim tambem caso contrario indicar o melhor caminho a seguir.

Finalize deixando claro que este insight é gerado por um sistema de IA e **não substitui o julgamento clínico do psicólogo**, mas pode
 ser utilizado como apoio para reflexão e tomada de decisão.

Prompt de entrada:
${prompt}
` */

  const instrucao = `
como estamos testando a aplicação vamos utilizar o seguinte prompt
${prompt}
você vai analisar o recebido 
e me falar oque entendeu,
repetir todo o conteudo enviado para voce, aja como um tecnico para juntos ajustar o prompt que estou criando
`



  if (!prompt) {
    return NextResponse.json({ error: "Título e autor são obrigatórios." }, { status: 400 });
  }



  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: instrucao }],
      temperature: 0.2,
       max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content || "Sem resposta.";
  
   
    return NextResponse.json({ result: content });

  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao gerar resposta do modelo." }, { status: 500 });
  } 
}
