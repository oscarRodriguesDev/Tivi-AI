import OpenAI from "openai";
import { NextResponse } from "next/server";
import { generate } from "@/app/util/GenericPrompts";
import { useCredit } from "@/hooks/useCredits";


//export const runtime = 'edge';
export const runtime = 'nodejs';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



export async function POST(req: Request) {
  var retorno = ''

  const { searchParams } = new URL(req.url);
// const model = searchParams.get('prompt'); //parametnro
  const userId = searchParams.get("userId") as string;
  const {
    message: transcription,
     prompt: model


  } = await req.json();


  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];


  const prompt = generate(transcription, String(model))

  if (!transcription) {
    return NextResponse.json({ error: "Mensagem não fornecida." }, { status: 400 });
  }
  const promptMessage = `${retorno} crie o documento solicitado para a seguinte transcrição: ${transcription} ao fim me fale dos materiais que se baseou`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content || "Sem resposta.";

    await useCredit(userId, 1)
    return NextResponse.json({ response: content });

  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao gerar resposta do modelo." }, { status: 500 });
  }
}

