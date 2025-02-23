import { NextResponse } from 'next/server';

let transcriptionStorage: string[] = []; // Armazenar as mensagens transcritas

// Método GET para recuperar todas as transcrições
export async function GET(req: Request) {
  try {
    // Verificar se existem transcrições
    if (transcriptionStorage.length === 0) {
      return NextResponse.json({ message: 'Nenhuma transcrição encontrada.' }, { status: 404 });
    }

    // Retornar todas as transcrições
    return NextResponse.json({ transcriptions: transcriptionStorage }, { status: 200 });

  } catch (error) {
    console.error('Erro interno do servidor:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}



// Método POST para salvar uma nova mensagem transcrita
export async function POST(req: Request) {
  try {
    const { message } = await req.json(); // Recebe apenas a mensagem

    if (!message) {
      return NextResponse.json({ message: 'Falta a mensagem no corpo da requisição.' }, { status: 400 });
    }

    // Adicionar a nova mensagem ao array de transcrições
    transcriptionStorage.push(message);

    console.log(`Mensagem salva com sucesso. Total de mensagens: ${transcriptionStorage.length}`);

    return NextResponse.json({ message: 'Mensagem salva com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro interno do servidor:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
