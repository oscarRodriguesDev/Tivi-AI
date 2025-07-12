import OpenAI from "openai";
import { NextResponse } from "next/server";
export const runtime = 'edge';
import { generateTrasnctipionPrompt } from "@/app/util/prompt3";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function GET(req: Request) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "fale sobre o sistema tivi ai" }],
        });

        return NextResponse.json({
            success: true,
            message: completion.choices[0].message.content,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error,
        }, { status: 500 });
    }
}



export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Mensagem não fornecida." }, { status: 400 });
  }

  const prompt = generateTrasnctipionPrompt(
    "Andre",
    "15",
    "2024-01-01",
    "Adolescente",
    "irmão",
    "Tatiane de Souza Pontes Correa",
    "16/10466",
    message
  );

  const promptMessage = `${prompt} ${message}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", 
      messages: [{ role: "user", content: promptMessage }],
      max_tokens: 600,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "Sem resposta.";
    return NextResponse.json({ response: content });

  } catch (error: any) {
    console.error("Erro ao chamar OpenAI:", error.response?.data || error.message || error);
    return NextResponse.json({ error: "Erro ao gerar resposta do modelo." }, { status: 500 });
  }
}

