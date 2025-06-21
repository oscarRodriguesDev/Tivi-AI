import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;

  // Pegando o IP via headers (primeiro IP da lista)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0';

  const registro = await prisma.acessos_anamnese_temp.findUnique({
    where: { token },
  });

  if (!registro) {
    await prisma.acessos_anamnese_temp.create({
      data: { token, ip, acessado_em: new Date() },
    });
    return NextResponse.json({ autorizado: true });
  }

  const tempoPassado = Date.now() - new Date(registro.acessado_em).getTime();
  const valido = tempoPassado <= 30 * 60 * 1000; // 30 minutos em ms

  if (registro.ip === ip && valido) {
    return NextResponse.json({ autorizado: true });
  } else {
    return NextResponse.json({ autorizado: false }, { status: 403 });
  }
}
