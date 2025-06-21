import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
    const token = params.token;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
    const registro = await prisma.acessoAnamneseTemp.findUnique({ where: { token } });
    if (!registro) {
        return NextResponse.json({ autorizado: false, erro: "Token inválido" }, { status: 404 });
    }
    const agora = new Date();
    // 1. Link criado há mais de 10 min e nunca foi acessado
    const expiradoSemUso = !registro.acessado_em &&
        agora.getTime() - new Date(registro.criado_em).getTime() > 1 * 60 * 1000;
    if (expiradoSemUso) {
        return NextResponse.json({ autorizado: false, erro: "Link expirado (tempo excedido)" }, { status: 403 });
    }
    // 2. Primeiro acesso (ainda não tem IP)
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
    // 3. Acesso já feito → validar IP e tempo restante
    const tempoDesdePrimeiroAcesso = agora.getTime() - new Date(registro.acessado_em).getTime();
    const valido = tempoDesdePrimeiroAcesso <= 10 * 60 * 1000;
    if (registro.ip === ip && valido) {
        return NextResponse.json({ autorizado: true });
    }
    return NextResponse.json({ autorizado: false, erro: "Link expirado ou IP diferente" }, { status: 403 });
}
