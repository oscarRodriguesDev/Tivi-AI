import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  // Extrai o IP (primeiro da lista de possíveis IPs)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0';

  const registro = await prisma.acessoAnamneseTemp.findUnique({
    where: { token },
  });

  const agora = new Date();

  // Se não houver registro, cria um novo com o IP e a hora atual
  if (!registro) {
    await prisma.acessoAnamneseTemp.create({
      data: { token, ip, acessado_em: agora },
    });
    return NextResponse.json({ autorizado: true });
  }

  // Se o campo acessado_em for nulo, é o primeiro acesso
  if (!registro.acessado_em) {
    await prisma.acessoAnamneseTemp.update({
      where: { token },
      data: { ip, acessado_em: agora },
    });
    return NextResponse.json({ autorizado: true });
  }

  // Calcula tempo decorrido desde o primeiro acesso
  const acessadoEm = new Date(registro.acessado_em).getTime();
  const tempoPassado = Date.now() - acessadoEm;
  const valido = tempoPassado <= 30 * 60 * 1000; // 30 minutos em ms

  // Validação de IP e tempo
  if (registro.ip === ip && valido) {
    return NextResponse.json({ autorizado: true });
  } else {
    return NextResponse.json({ autorizado: false }, { status: 403 });
  }
}
