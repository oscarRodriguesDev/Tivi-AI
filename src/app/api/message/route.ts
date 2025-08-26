import { NextResponse } from 'next/server';




const transcriptionStorage: Record<string, Set<string>> = {};

/**
 * @swagger
 * /api/transcriptions:
 *   get:
 *     summary: Recupera transcrição de uma sala
 *     description: Retorna toda a transcrição acumulada de uma sala específica. Se não houver transcrição, retorna uma string vazia.
 *     tags:
 *       - Transcrições
 *     parameters:
 *       - in: query
 *         name: sala
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador da sala de transcrição
 *         example: "sala123"
 *     responses:
 *       200:
 *         description: Transcrição recuperada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transcript:
 *                   type: string
 *                   description: Texto completo da transcrição
 *                   example: "Olá, bem-vindo à sala!\nAqui estamos testando a transcrição."
 *       400:
 *         description: Parâmetro "sala" não fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Parâmetro "sala" é obrigatório.'
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
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
 * @swagger
 * /api/transcriptions:
 *   post:
 *     summary: Salva uma nova transcrição em uma sala
 *     description: Adiciona o texto da transcrição à sala especificada. Transcrições duplicadas dentro da mesma sala não são adicionadas.
 *     tags:
 *       - Transcrições
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sala
 *               - transcript
 *             properties:
 *               sala:
 *                 type: string
 *                 description: Identificador da sala
 *                 example: "sala123"
 *               transcript:
 *                 type: string
 *                 description: Texto da transcrição a ser salvo
 *                 example: "Olá, esta é a primeira transcrição da sala."
 *     responses:
 *       201:
 *         description: Transcrição salva com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transcrição salva com sucesso."
 *                 transcript:
 *                   type: string
 *                   example: "Olá, esta é a primeira transcrição da sala."
 *       400:
 *         description: Dados inválidos fornecidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Dados inválidos. Informe "sala" e "transcript".'
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
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
