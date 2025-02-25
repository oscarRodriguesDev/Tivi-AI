import { NextResponse } from 'next/server';

let transcriptionStorage: string[] = []; // 🔥 Garante que todas as mensagens estão armazenadas

export async function GET(req: Request) {
  try {
    // Remover duplicatas usando Set
    const uniqueMessages = [...new Set(transcriptionStorage)];
    
    if (uniqueMessages.length === 0) {
      return NextResponse.json({ transcript: '' }, { status: 200 });
    }

    const fullTranscription = uniqueMessages.join("\n");

    return NextResponse.json({ transcript: fullTranscription }, { status: 200 });

  } catch (error) {
    console.error('Erro interno do servidor.');
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}




export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
      return NextResponse.json({ message: 'Mensagem inválida.' }, { status: 400 });
    }

    transcriptionStorage.push(transcript); // 🔥 Agora todas as mensagens são armazenadas corretamente

    return NextResponse.json({ message: 'Mensagem salva com sucesso.', transcript }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
