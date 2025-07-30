import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'chave-muito-secreta-e-segura-32bytes!!'; // 32 bytes
const IV_LENGTH = 16;


const prisma = new PrismaClient();
//put de pronturario
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { pacienteId, transcription } = body;
    

    if (!pacienteId || !transcription) {
      return NextResponse.json(
        { error: "ID do paciente e transcription são obrigatórios" },
        { status: 400 }
      );
    }

    const prontuarioExistente = await prisma.prontuario.findUnique({
      where: { pacienteId },
    });

    if (!prontuarioExistente) {
      return NextResponse.json(
        { error: "Prontuário não encontrado para o paciente"  },
        { status: 404 }
      );
    }

    const prontuarioAtualizado = await prisma.prontuario.update({
      where: { pacienteId },
      data: {
        transcription
      },
    });

    return NextResponse.json(prontuarioAtualizado, { status: 200 });

  } catch (error: any) {
    console.error("Erro ao atualizar transcription:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar transcription", details: error.message },
      { status: 500 }
    );
  }
}
