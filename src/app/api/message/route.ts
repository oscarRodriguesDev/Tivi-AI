import { NextResponse } from 'next/server';

let transcriptionStorage: string[] = []; // Armazenar as mensagens transcritas

// Método GET para recuperar todas as transcrições
export async function GET(req: Request) {
  try {
    // Verificar se existem transcrições
    if (transcriptionStorage.length === 0) {
        console.error('nenhuma mensagem encontrada');
      return NextResponse.json({ message: 'Nenhuma transcrição encontrada.' }, { status: 404 });
    }

    // Retornar todas as transcrições
    console.log(transcriptionStorage)
    // Limpar quebras de linha desnecessárias antes de exibir
    transcriptionStorage = transcriptionStorage.map(transcriptionStorage => transcriptionStorage.replace(/(\n\s*){2,}/g, ''));
    return NextResponse.json({ transcriptions: transcriptionStorage }, { status: 200 });

  } catch (error) {
    console.error('ocorreu um erro no servidor');
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();
   

    if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
      console.error('Mensagem inválida ou vazia recebida.');
      return NextResponse.json({ message: 'Mensagem inválida.' }, { status: 400 });
    }

    // Verifique se transcriptionStorage está corretamente inicializado
    if (typeof transcriptionStorage === "undefined") {
      transcriptionStorage = []; // Inicialize o armazenamento de transcrições
    }

    // Adicionar a nova mensagem ao array de transcrições

    
    transcriptionStorage.push(transcript);
    
    // Log para verificação
    console.log(`Mensagem salva com sucesso. Total de mensagens: ${transcriptionStorage.length}`);

    // Se você quiser persistir os dados de alguma maneira, como em um banco de dados, insira aqui a lógica

    return NextResponse.json({ message: 'Mensagem salva com sucesso.', transcript }, { status: 200 });
  } catch (error) {
    console.error('Erro interno do servidor:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

