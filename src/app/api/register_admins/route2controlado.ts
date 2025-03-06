import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key'; // Certifique-se de definir a chave secreta

// Função para verificar o token JWT e obter a role do usuário
const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    return null;
  }
};

export async function POST(req: Request) {
  try {
    // Extraindo o token da requisição
    const token = req.headers.get("Authorization")?.split(" ")[1]; // Supõe que o token é passado no formato 'Bearer <token>'

    if (!token) {
      return NextResponse.json(
        { message: "Token de autenticação ausente" },
        { status: 401 }
      );
    }

    // Verifica o token para garantir que o usuário tem a role 'ADMIN'
    const user = verifyToken(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Apenas administradores podem criar novos usuários" },
        { status: 403 }
      );
    }

    // Extraindo os dados do corpo da requisição
    const { name, email, password, confirmPassword } = await req.json();

    // Verifica se os campos obrigatórios foram fornecidos
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Nome, email, senha e confirmação de senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "As senhas não coincidem" }, { status: 400 });
    }

    // Verifica se o email já está cadastrado
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Usuário já cadastrado" }, { status: 400 });
    }

    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do novo usuário (ADMIN)
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN", // Definindo o papel como ADMIN
      },
    });

    // Resposta de sucesso
    return NextResponse.json(
      { message: "Admin cadastrado com sucesso", user: newAdmin },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Erro ao cadastrar admin:", error);
    return NextResponse.json({ message: "Erro ao cadastrar admin" }, { status: 500 });
  }
}
