import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { pacienteId, psicologoId } = await req.json();

    if (!pacienteId || !psicologoId) {
      return NextResponse.json(
        { error: "Campos obrigatórios: pacienteId, psicologoId" },
        { status: 400 }
      );
    }

    const token = randomUUID(); // pode usar nanoid() se preferir

    await prisma.acessoAnamneseTemp.create({
      data: {
        token,
        pacienteId,
        psicologoId,
      },
    });

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/amnp/${token}`;

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Erro ao gerar link:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
