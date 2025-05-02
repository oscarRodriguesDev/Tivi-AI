import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Paciente } from "../../../../types/paciente";

const prisma = new PrismaClient();


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const psicoloId = searchParams.get('psicoloId');

    if (!psicoloId) {
      return NextResponse.json(
        { error: "ID do psicólogo é obrigatório" },
        { status: 400 }
      );
    }

    const pacientes = await prisma.paciente.findMany({
      where: {
        psicoloId: psicoloId
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
    const {id, nome,fantasy_name, idade,sintomas, telefone,convenio, cpf, sexo,cep,cidade,bairro,rua,numero,pais,complemento,estado,email,rg,psicoloId} = body;
   

    // Validação dos campos obrigatórios
    if ( !nome || !fantasy_name  || !sintomas || !telefone || !convenio || !cpf || !sexo || !cep || !cidade || !bairro || !rua || !numero || !pais || !estado || !email || !rg ||!psicoloId) {
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
        telefone,           // Telefone do paciente
        id,          // ID do psicólogo
        fantasy_name,
        psicoloId,       // Nome fantasia
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
