import { NextResponse } from 'next/server';

let peerStorage: Record<string, string> = {}; // Armazena temporariamente os peerIds

// Método GET para recuperar o peerId associado ao iddinamico
export async function GET(req: Request) {
  interface peerProps {
    peerId: string;
    id: string | any;
  }

  try {
    // Extrair o iddinamico da URL
    const url = new URL(req.url);
    const iddinamico = url.searchParams.get('iddinamico'); // Supondo que iddinamico é passado como parâmetro na URL

    if (!iddinamico) {
      return NextResponse.json({ message: 'Falta o parâmetro iddinamico.' }, { status: 400 });
    }

    // Buscar o peerId usando a chave iddinamico
    const peerId = peerStorage[iddinamico];

    if (!peerId) {
     
      return NextResponse.json({ message: 'Nenhum peerId encontrado para o iddinamico fornecido.' }, { status: 404 }); 
    }

    // Retornar o peerId e o iddinamico
    const response: peerProps = { peerId, id: iddinamico };
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
       return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// Método POST para salvar o peerId
export async function POST(req: Request) {
  try {
    const { iddinamico, peerId } = await req.json();

    if (!iddinamico || !peerId) {
      return NextResponse.json({ message: 'Faltam parâmetros obrigatórios.' }, { status: 400 });
    }

    // Armazenar o peerId no peerStorage
    peerStorage[iddinamico] = peerId; // Salva o peerId com a chave iddinamico
    return NextResponse.json({ message: 'ID salvo com sucesso.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
