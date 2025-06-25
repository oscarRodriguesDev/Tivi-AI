import OpenAI from "openai";
import { NextResponse } from "next/server";
import { generateDTP } from "@/app/util/DTP";
import { generateAV } from "@/app/util/AV";
import { generateEP } from "@/app/util/EP";
import { generateLP } from "@/app/util/LP";
import { generatePT } from "@/app/util/PT";
import { generateRBT } from "@/app/util/RBT";
import { generateRN } from "@/app/util/RN";
import { generateTRT } from "@/app/util/TRT";


export const runtime = 'edge';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



export async function POST(req: Request) {
  var retorno =''

  const { searchParams } = new URL(req.url);
  const tipoDocumento = searchParams.get('tipo');
  const { message: transcription } = await req.json();
  //no corpo da requisição preciso enviar os dados do paciente, o valor da cunsulta, dados do psicologo
  //na url enviar o tipo do documento que vai ser gerado

  //recuperar data do dia
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];


  if (!transcription) {
    return NextResponse.json({ error: "Mensagem não fornecida." }, { status: 400 });
  }
   switch(tipoDocumento) {
    case 'DTP': retorno= generateDTP(transcription)
    break
    case 'RBT': retorno= generateRBT(transcription)
    break
    case 'AV': retorno = generateAV(transcription)
    break
    case 'EP': retorno = generateEP(transcription)
    break
    case 'LP': retorno = generateLP(transcription)
    break
    case 'PT': retorno = generatePT(transcription)
    break
    case 'RN': retorno = generateRN(transcription)
    break
    case 'TRT': retorno = generateTRT(transcription)
    break
    default: return NextResponse.json({ error:'Erro ao solicitar documento'})
   }



  const promptMessage = `${retorno} crie o documento solicitado para a seguinte transcrição: ${transcription}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptMessage }],
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content || "Sem resposta.";
    return NextResponse.json({ response: content });

  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao gerar resposta do modelo." }, { status: 500 });
  } 
}


//forma de escolher qual documento vai ser gerado


/* export async function POST(req: Request) {

  const { searchParams } = new URL(req.url);
  const tipoDocumento = searchParams.get('tipo');
  const { message } = await req.json();

  //recuperar data do dia
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0]; 

  if (!message) {
    return NextResponse.json({ error: "Mensagem não fornecida." }, { status: 400 });
  }

  // Corrigido: prompt agora é o resultado da função, não a função em si
  let prompt: string;
  switch (tipoDocumento) {
    case 'ANMP':
      prompt = generateAMNP(message);
      break;
    case 'DPT':
      prompt = generateDPT(message);
      break;
    case 'AV':
      prompt = generateAV(message);
      break;
    case 'EP':
      prompt = generateEP(message);
      break;
    case 'LP':
      prompt = generateLP(message);
      break;
    case 'PT':
      prompt = generatePT(message);
      break;
    case 'RBT':
      prompt = generateRBT(message);
      break;
    case 'RN':
      prompt = generateRN(message);
      break;
    case 'TRT':
      prompt = generateTRT(message);
      break;
    default:
      prompt = "Tipo de documento inválido.";
  }

  const promptMessage = `${prompt} ${message}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [{ role: "user", content: promptMessage }],
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content || "Sem resposta.";
    return NextResponse.json({ response: content });

  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao gerar resposta do modelo." }, { status: 500 });
  }
} */