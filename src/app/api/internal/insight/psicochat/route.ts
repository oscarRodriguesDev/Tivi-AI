import OpenAI from "openai";
import { NextResponse } from "next/server";
import { generate} from "@/app/util/GenericPrompts";



export const runtime = 'edge';
//export const runtime = 'nodejs';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



export async function POST(req: Request) {
  var retorno =''

  const { searchParams } = new URL(req.url);
  const model = searchParams.get('prompt');
  const { message: transcription } = await req.json();
  
  //no corpo da requisição preciso enviar os dados do paciente, o valor da cunsulta, dados do psicologo
  //na url enviar o tipo do documento que vai ser gerado

  //recuperar data do dia
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];


  const prompt = generate(transcription, String(model)) // Corrigido: prompt agora é o resultado da função, não a prompt

  if (!transcription) {
    return NextResponse.json({ error: "Mensagem não fornecida." }, { status: 400 });
  }
  // Corrigido: prompt agora é o resultado da função, não a função em si
  //generate


  const promptMessage = `${retorno} crie o documento solicitado para a seguinte transcrição: ${transcription} ao fim me fale dos materiais que se baseou`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
       max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content || "Sem resposta.";
    return NextResponse.json({ response: content });

  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao gerar resposta do modelo." }, { status: 500 });
  } 
}

