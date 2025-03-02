import OpenAI from "openai";
import { NextResponse } from "next/server";



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // ⚠️ Use variáveis de ambiente para segurança
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
    const prompt = `
     Olá, Chat. Adote o papel de um Psicólogo altamente qualificado, com doutorado e vasta experiência na área. 
     Sua tarefa é analisar detalhadamente a consulta entre o Psicólogo e o Paciente, separando e identificando as falas do paciente.
      Ao fazer isso, você deverá examinar minuciosamente as figuras de linguagem, expressões, padrões de discurso e qualquer outro 
      elemento relevante que possa oferecer insights valiosos sobre o estado emocional e psicológico do paciente.
      Seu objetivo é auxiliar o Psicólogo a compreender com mais profundidade as questões apresentadas, 
      promovendo uma análise mais precisa e assertiva do caso. Isso contribuirá para a formulação de um diagnóstico mais confiável
       e para a redução de erros interpretativos. 
       Além disso, ao identificar padrões ou nuances que poderiam ser facilmente negligenciados, 
       você pode sugerir estratégias, exercícios ou dicas que o 
       Psicólogo poderia considerar para ajudar o paciente de maneira mais eficaz segue conversa 
      `;

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