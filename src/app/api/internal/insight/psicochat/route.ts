import OpenAI from "openai";
import { NextResponse } from "next/server";
//import prompt from "@/app/util/prompt";
import { generateTrasnctipionPrompt } from "@/app/util/prompt3";

export const runtime = 'edge';



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});



export async function POST(req: Request) {
  const { message } = await req.json();
  //recuperar data do dia
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0]; 

  if (!message) {
    return NextResponse.json({ error: "Mensagem não fornecida." }, { status: 400 });
  }

  const prompt = generateTrasnctipionPrompt(
    "Paciente",
    "30",
    formattedDate,
    "Adolescente",
    "irmão",
    "Tatiane de Souza Pontes Correa",
    "16/10466",
    message
  );

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
}
