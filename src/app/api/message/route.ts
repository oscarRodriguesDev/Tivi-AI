import { NextResponse } from 'next/server';

let transcriptionStorage: Set<string> = new Set(); // Usa Set diretamente para evitar duplicatas

export async function GET() {
  try {
    if (transcriptionStorage.size === 0) {
      return NextResponse.json({ transcript: '' }, { status: 200 });
    }

    const fullTranscription = Array.from(transcriptionStorage).join("\n");
    console.log(fullTranscription)
    return NextResponse.json({ transcript: fullTranscription }, { status: 200 });

  } catch (error) {
    console.error('Erro no GET:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body.transcript !== 'string' || body.transcript.trim() === '') {
      return NextResponse.json({ message: 'Mensagem inválida.' }, { status: 400 });
    }

    transcriptionStorage.add(body.transcript); // Evita duplicatas automaticamente
    console.log('Nova transcrição salva:', transcriptionStorage);

    return NextResponse.json({ message: 'Mensagem salva com sucesso.', transcript: body.transcript }, { status: 200 });
  } catch (error) {
    console.error('Erro no POST:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
