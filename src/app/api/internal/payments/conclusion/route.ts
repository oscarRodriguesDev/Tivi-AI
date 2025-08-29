import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Conclusão de pagamento, entrega créditos, zera compra e marca como entregue
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, creditos, compraId } = body;

    console.log("body", body);

    if (!userId || typeof creditos !== "number" || !compraId) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios: userId (string), creditos (number), compraId (string)" },
        { status: 400 }
      );
    }

    // Busca a compra específica
    const compra = await prisma.compra.findUnique({ where: { id: compraId } });
    if (!compra) {
      return NextResponse.json({ error: "Compra não encontrada" }, { status: 404 });
    }
    if (compra.Status === "ENTREGUE") {
      return NextResponse.json({ error: "Compra já marcada como ENTREGUE" }, { status: 409 });
    }

    // Busca o usuário
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Adiciona os créditos ao usuário (incrementa)
    const currentCredits = user.creditos ? parseInt(user.creditos, 10) : 0;
    const newCredits = currentCredits + creditos;

    // Atualiza o usuário com os novos créditos
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { creditos: newCredits.toString() },
    });

    // Marca a compra como entregue e zera os créditos da compra
    await prisma.compra.update({
      where: { id: compraId },
      data: {
        Status: "ENTREGUE",
        qtdCreditos:null,
      },
    });

    return NextResponse.json({
      success: true,
      userId: updatedUser.id,
      creditos: updatedUser.creditos,
      compraId,
      compraStatus: "ENTREGUE",
    });

  } catch (error) {
    console.error("Erro ao concluir pagamento e entregar créditos:", error);
    return NextResponse.json({ error: "Erro interno ao concluir pagamento" }, { status: 500 });
  }
}