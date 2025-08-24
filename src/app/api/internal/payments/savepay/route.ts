import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, paymentId, stats } = body;



    if (!userId || !paymentId) {
      return NextResponse.json(
        { error: "userId e paymentId são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar status e definir default
    const validStatuses = ["PENDING", "FAILED", "PAID"];
    const statusToSave =
      typeof stats === "string" && validStatuses.includes(stats.toUpperCase())
        ? stats.toUpperCase()
        : "PENDING";
    console.log("status api", statusToSave);
    // Criar a compra no banco
    const compra = await prisma.compra.create({
      data: {
        userId,
        paymentId,
        Status: statusToSave, // agora sempre válido
      },
    });

    return NextResponse.json({ success: true, compra }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar compra:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar compra" },
      { status: 500 }
    );
  }
}
