import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Paciente } from "../../../../../types/paciente";

const prisma = new PrismaClient();


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const psicologoId = searchParams.get('psicologoId');

    if (!psicologoId) {
      return NextResponse.json(
        { error: "ID do psicólogo é obrigatório" },
        { status: 400 }
      );
    }

    const pacientes = await prisma.paciente.findMany({
      where: {
        psicologoId: psicologoId
      },
      select: {
        id: true,
        nome: true,
        fantasy_name: true,
        idade: true,
        telefone: true,
        cidade: true,
        estado: true,
        convenio: true,
        cpf: true,
        sexo: true,
        cep: true,
        bairro: true,
        numero: true,
        pais: true,
        complemento: true,
        email: true,
        rg: true,
        sintomas: true,
        rua: true,


      }
    });

    return NextResponse.json(pacientes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar pacientes" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body: Paciente = await req.json();
    const { nome, fantasy_name, idade, sintomas, telefone, convenio, cpf, 
      sexo, cep, cidade, bairro, rua, numero, pais, complemento, estado, email, rg, psicologoId } = body;


    // Validação dos campos obrigatórios
    if (!nome || !fantasy_name || !sintomas || !telefone || !convenio || !cpf || !sexo || !cep
       || !cidade || !bairro || !rua || !numero || !pais || !estado || !email || !rg || !psicologoId) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    // Criando paciente no banco de dados
    const novoPaciente = await prisma.paciente.create({
      data: {
        nome,               // Nome do paciente
        cpf,                // CPF do paciente
        idade, // Idade como string (mantendo a coerência com o modelo)
        sintomas,           // Sintomas do paciente
        telefone,           // Telefone do paciente         // ID do psicólogo
        fantasy_name,
        psicologoId,
        convenio,           // Convênio
        sexo,               // Sexo do paciente
        cep,                // CEP do paciente
        cidade,             // Cidade do paciente
        bairro,             // Bairro do paciente
        rua,                // Rua do paciente
        numero,             // Número do endereço
        pais,               // País do paciente
        complemento,        // Complemento do endereço
        estado,             // Estado do paciente
        email,              // E-mail do paciente
        rg
      },
    });

    return NextResponse.json(
      { message: "Paciente cadastrado com sucesso", data: novoPaciente },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao processar a requisição", details: error.message },
      { status: 500 }
    );
  }
}


//rota deletar um paciente
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID do paciente é obrigatório" },
        { status: 400 }
      );
    }

    // Verifica se o paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id },
    });

    if (!paciente) {
      return NextResponse.json(
        { error: "Paciente não encontrado" },
        { status: 404 }
      );
    }

    // Deleta o paciente
    await prisma.paciente.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Paciente deletado com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao deletar paciente", details: error.message },
      { status: 500 }
    );
  }
}



//edição de pacientes
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "ID do paciente é obrigatório" },
        { status: 400 }
      );
    }

    // Verifica se o paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id },
    });

    if (!paciente) {
      return NextResponse.json(
        { error: "Paciente não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza os dados do paciente
    const updatedPaciente = await prisma.paciente.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedPaciente, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao atualizar paciente", details: error.message },
      { status: 500 }
    );
  }
}
