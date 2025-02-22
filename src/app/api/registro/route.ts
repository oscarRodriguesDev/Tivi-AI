import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Extraindo os dados do corpo da requisição
    const { name, email, password, confirmPassword } = await req.json();


    // Verifica se os campos obrigatórios foram fornecidos
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: "Nome, email, senha e confirmação de senha são obrigatórios" }, { status: 400 });
    }

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "As senhas não coincidem" }, { status: 400 });
    }

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Usuário já cadastrado" }, { status: 400 });
    }

    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        name: name,  // Salvando o nome do usuário
        email,
        password: hashedPassword,
      },
    });

    // Resposta de sucesso
    return NextResponse.json({ message: "Usuário cadastrado com sucesso", user: newUser }, { status: 201 });
  } catch (error) {
    // Erro genérico caso ocorra algum problema na API
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json({ message: "Erro ao cadastrar usuário" }, { status: 500 });
  }
}
