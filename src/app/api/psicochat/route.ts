import OpenAI from "openai";
import { NextResponse } from "next/server";



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function GET(req: Request) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Liste 5 anomalias psicológicas conhecidas." }],
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
    // Definindo o prompt fixo com as instruções
    const prompt = process.env.PERSONA_PSICO_PROMPT;

    try {
        // Lendo o corpo da requisição
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Mensagem não fornecida." }, { status: 400 });
        }

        // Combinando o prompt com a mensagem do paciente
        const promptMessage = `${prompt} ${message}`;

        // Chamando a API da OpenAI com o prompt combinado e a mensagem recebida
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Usando o modelo GPT-4
            messages: [{ role: "user", content: promptMessage }],
        });

        // Retornando a resposta do modelo
        console.log(completion.choices[0])
        return NextResponse.json({ response: completion.choices[0].message.content });

    } catch (error) {
        console.error("Erro ao chamar OpenAI:", error);
        return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
    }
}