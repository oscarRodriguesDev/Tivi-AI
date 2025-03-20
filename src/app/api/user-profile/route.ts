import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Obtém o ID da query string

    if (!id) {
      return NextResponse.json({ error: "ID do usuário não fornecido." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json(user); //aqui retorna o usuario
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}


//edicão de dados do usuario:

export async function PUT(req:Request) {
  try {
      const { id, ...updates } = await req.json();

      if (!id) {
          return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 });
      }

      // Verifica se o usuário existe
      const existingUser = await prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
          return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
      }

      // Atualiza os dados do usuário
      const updatedUser = await prisma.user.update({
          where: { id },
          data: updates,
      });

      return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

