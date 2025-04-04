import OpenAI from "openai";
import { NextResponse } from "next/server";
//import prompt from "@/app/util/prompt";
import { generateTrasnctipionPrompt } from "@/app/util/prompt2";



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
   /*  const prompt = process.env.PERSONA_PSICO_PROMPT; */
   const { message } = await req.json();
   const prompt = generateTrasnctipionPrompt(
    'Andre',
    '15',
    '2024-01-01',
    'Adolescente',
    'irmão',
    'Tatiane de Souza Pontes Correa',
    '16/10466',
    message
   )
    try {
        // Lendo o corpo da requisição

        if (!message) {
            return NextResponse.json({ error: "Mensagem não fornecida." }, { status: 400 });
        }

        // Combinando o prompt com a mensagem do paciente
        const promptMessage = `${prompt} ${message}`;
        NextResponse.json({ error: "aguardando resposta do modelo" }, { status: 1000 });

        // Chamando a API da OpenAI com o prompt combinado e a mensagem recebida
        const completion = await openai.chat.completions.create({
            //usar o 3.5 turbo  
            model: "gpt-3.5-turbo", //tive que alterar o modelo
            messages: [{ role: "user", content: promptMessage }],
        });

        return NextResponse.json({ response: completion.choices[0].message.content });

    } catch (error) {
        console.error("Erro ao chamar OpenAI:", error);
        return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
    }
}