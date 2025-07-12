import { NextResponse } from 'next/server';


/**
 * Armazena temporariamente as transcrições únicas por sala.
 *
 * Cada chave do objeto representa uma sala identificada por string (ID dinâmico),
 * e o valor é um `Set` contendo strings únicas de trechos de transcrição, 
 * evitando duplicatas durante a chamada.
 *
 * @example
 * transcriptionStorage["sala123"] = new Set(["paciente: Olá", "psicologo: Como você está?"]);
 */

const transcriptionStorage: Record<string, Set<string>> = {};



/**
 * Handler da rota GET para retornar a transcrição acumulada de uma sala.
 *
 * Esta função é chamada com uma query `sala`, que representa o identificador da sala de reunião.
 * Ela retorna a transcrição completa (sem duplicatas) armazenada no `transcriptionStorage`.
 *
 * @param req - Objeto da requisição HTTP contendo a URL com os parâmetros de busca.
 * @returns JSON com a transcrição da sala ou uma mensagem de erro.
 *
 * @response 200 - Quando a transcrição é retornada com sucesso (pode ser string vazia).
 * @response 400 - Quando o parâmetro `sala` não é informado.
 * @response 500 - Em caso de erro interno do servidor.
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sala = searchParams.get('sala');

    if (!sala) {
      return NextResponse.json({ message: 'Parâmetro "sala" é obrigatório.' }, { status: 400 });
    }

    const salaTranscripts = transcriptionStorage[sala];

    if (!salaTranscripts || salaTranscripts.size === 0) {
      return NextResponse.json({ transcript: '' }, { status: 200 });
    }

    const fullTranscription = Array.from(salaTranscripts).join("\n");
    return NextResponse.json({ transcript: fullTranscription }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}




/**
 * Handler da rota POST para salvar transcrições de uma sala.
 *
 * Esta função espera um corpo JSON contendo os campos:
 * - `sala`: string identificando a sala da reunião
 * - `transcript`: string com o trecho da transcrição a ser salvo
 *
 * O trecho de transcrição é armazenado em um `Set` para evitar duplicações
 * e manter o histórico de falas associadas à sala correspondente.
 *
 * @param req - Objeto da requisição HTTP contendo os dados da transcrição.
 * @returns JSON confirmando o salvamento ou uma mensagem de erro.
 *
 * @response 201 - Quando a transcrição é salva com sucesso.
 * @response 400 - Quando os dados estão ausentes ou inválidos.
 * @response 500 - Em caso de erro interno do servidor.
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sala, transcript } = body;

    if (!sala || typeof transcript !== 'string' || transcript.trim() === '') {
      return NextResponse.json({ message: 'Dados inválidos. Informe "sala" e "transcript".' }, { status: 400 });
    }

    if (!transcriptionStorage[sala]) {
      transcriptionStorage[sala] = new Set();
    }

    transcriptionStorage[sala].add(transcript);

    return NextResponse.json({ message: 'Transcrição salva com sucesso.', transcript }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
