// app/api/validar-anamnese/[token]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const token = params.token;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";


  const registro = await prisma.acessoAnamneseTemp.findUnique({
    where: { token },
  });

  if (!registro) {
    return NextResponse.json(
      { autorizado: false, erro: "Token inválido" },
      { status: 404 }
    );
  }

  const agora = new Date();

  // Se o link nunca foi acessado e expirou (mais de 10 minutos)
  const expiradoSemUso =
    !registro.acessado_em &&
    agora.getTime() - new Date(registro.criado_em).getTime() > 10 * 60 * 1000;

  if (expiradoSemUso) {
    return NextResponse.json(
      { autorizado: false, erro: "Link expirado (tempo excedido)" },
      { status: 403 }
    );
  }

  // Se for o primeiro acesso, registra o IP e horário
  if (!registro.acessado_em) {
    await prisma.acessoAnamneseTemp.update({
      where: { token },
      data: {
        ip,
        acessado_em: agora,
      },
    });

    return NextResponse.json({ autorizado: true });
  }

  // Verifica se IP é o mesmo e se o tempo ainda é válido
  const tempoDesdePrimeiroAcesso =
    agora.getTime() - new Date(registro.acessado_em).getTime();
  const valido = tempoDesdePrimeiroAcesso <= 10 * 60 * 1000;

  if (registro.ip === ip && valido) {
    return NextResponse.json({ autorizado: true });
  }

  return NextResponse.json(
    { autorizado: false, erro: "Link expirado ou IP diferente" },
    { status: 403 }
  );
}
