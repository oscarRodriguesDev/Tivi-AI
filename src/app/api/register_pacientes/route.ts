import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Interface para a estrutura de dados do paciente
interface PatientData {
  id: string;
  nome: string;
  cpf: string;
  idade: number; // Alterado para number
  sintomas: string;
  telefone: string;
}

// Cadastrar um novo paciente
export async function POST(req: Request) {
  try {
    const body: PatientData = await req.json();
    const { nome, idade, telefone, cpf, sintomas } = body;
    console.log(body)

    // Validação dos campos obrigatórios
    if (!nome || !idade || !telefone || !cpf || !sintomas) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    // Convertendo a idade para data de nascimento (considerando o início do ano como base)
    const anoAtual = new Date().getFullYear();
    const dataNascimento = new Date(anoAtual - idade, 0, 1); // Idade para data de nascimento

    // Criando paciente no banco de dados
    const novoPaciente = await prisma.paciente.create({
      data: {
       
        nome,        // Nome do paciente
        cpf,         // CPF do paciente
        idade: String(idade), // Idade como string (mantendo a coerência com o modelo)
        sintomas,    // Sintomas do paciente
        telefone,    // Telefone do paciente 
      },
    });

    return NextResponse.json(
      { message: "Paciente cadastrado com sucesso", data: novoPaciente },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { error: "Erro ao processar a requisição", details: error.message },
      { status: 500 }
    );
  }
}
