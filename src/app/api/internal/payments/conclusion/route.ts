import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1️⃣ POST de adição de créditos
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { userId, creditos } = body;
  
      if (!userId || typeof creditos !== "number") {
        return NextResponse.json(
          { error: "Parâmetros obrigatórios: userId (string), creditos (number)" },
          { status: 400 }
        );
      }
  
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  
      const currentCredits = user.creditos ? parseInt(user.creditos, 10) : 0;
      const newCredits = currentCredits + creditos;
  
      const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { creditos: newCredits.toString() }, // ainda guarda como string
        });
        marcarCreditosEntregues(userId)
      // Aguarda pelo menos 5 segundos antes de prosseguir
      await new Promise((resolve) => setTimeout(resolve, 5000));
    
      return NextResponse.json({
        success: true,
        userId: updatedUser.id,
        creditos: updatedUser.creditos,
      });
     

    } catch (error) {
      console.error("Erro ao adicionar créditos:", error);
      return NextResponse.json({ error: "Erro interno ao adicionar créditos" }, { status: 500 });
    }
  }
  
 // Função que marca os créditos como entregues
export async function marcarCreditosEntregues(userId: string) {
    try {
      // Tenta marcar a compra como ENTREGUE
      const entregaRealizada = await marcarCompraComoEntregue(userId);
  
      // Só zera os créditos se a compra foi marcada como ENTREGUE com sucesso
      if (entregaRealizada) {
        await prisma.compra.update({
          where: { id: userId },
          data: { qtdCreditos: "0" }, // zera o saldo
        });
        console.log(`Créditos do usuário ${userId} zerados após entrega.`);
      } else {
        console.log(`Não foi possível zerar créditos, a entrega não ocorreu.`);
      }
    } catch (err) {
      console.error("Erro ao zerar créditos:", err);
    }
  }
  
  // Função para marcar o status da compra como "ENTREGUE"
  export async function marcarCompraComoEntregue(userId: string) {
    try {
      // Atualiza todas as compras do usuário que ainda não estão entregues
      const result = await prisma.compra.updateMany({
        where: { userId: userId, Status: { not: "ENTREGUE" } },
        data: { Status: "ENTREGUE" },
      });
  
      console.log(`Compras do usuário ${userId} marcadas como ENTREGUE:`, result.count);
      return result.count > 0; // retorna true se pelo menos uma compra foi atualizada
    } catch (err) {
      console.error("Erro ao marcar compra como entregue:", err);
      return false;
    }
  }
  