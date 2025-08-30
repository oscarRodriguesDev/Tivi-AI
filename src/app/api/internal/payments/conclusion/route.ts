import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Conclusão de pagamento, entrega créditos, zera compra e marca como entregue
export async function POST(req: NextRequest) {
  try {
    const { userId, creditos, compraId } = await req.json();

    if (!userId || !creditos || !compraId) {
      return NextResponse.json({ error: "Parâmetros obrigatórios ausentes. " +req.body }, { status: 400 });
    }

    // Busca a compra para garantir que pertence ao usuário informado
    const compra = await prisma.compra.findUnique({
      where: { id: compraId },
      select: { userId: true, Status: true, qtdCreditos: true },
    });

    if (!compra) {
      return NextResponse.json({ error: "Compra não encontrada." }, { status: 404 });
    }

    if (compra.userId !== userId) {
      return NextResponse.json({ error: "Usuário não autorizado para esta compra." }, { status: 403 });
    }

    // Limita a apenas uma entrega: só entrega se ainda não foi entregue (Status !== "entregue") e qtdCreditos não é null
    if (compra.Status === "entregue" || compra.qtdCreditos === null) {
      return NextResponse.json({ error: "Créditos já entregues para esta compra." }, { status: 409 });
    }

    // Busca o usuário atual para pegar o saldo de créditos atual (em string)
    const userAtual = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditos: true },
    });

    if (!userAtual) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    // Converte os créditos atuais e os créditos recebidos para número
    const creditosAtuais = Number(userAtual.creditos) || 0;
    const creditosAdicionar = Number(creditos) || 0;
    const novoCredito = (creditosAtuais + creditosAdicionar).toString();

    // Atualiza o saldo de créditos do usuário (como string)
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        creditos: novoCredito,
      },
    });

    // Marca a compra como entregue/concluída e zera qtdCreditos (seta como null)
    const compraAtualizada = await prisma.compra.update({
      where: { id: compraId },
      data: {
        Status: "entregue",
        qtdCreditos: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Créditos entregues com sucesso.",
      user,
      compra: compraAtualizada,
    });
  } catch (error) {
    console.error("Erro ao entregar créditos:", error);
    return NextResponse.json({ error: "Erro ao entregar créditos." }, { status: 500 });
  }
}