
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extrai todos os campos da anamnese
    const {
      nome,
      email,
      endereco,
      nascimento,
      idade,
      cpf,
      telefone,
      emergencia,
      generoOrientacao,
      estadoCivil,
      origemConhecimento,
      preocupacao,
      motivoAtendimento,
      experienciaAnterior,
      saudeFisica,
      detalhesSaudeFisica,
      medicamentos,
      diagnosticoMental,
      historicoFamiliar,
      rotina,
      sono,
      atividadeFisica,
      estresse,
      convivencia,
      relacaoFamiliar,
      apoioSocial,
      nivelFelicidade,
      ansiedade,
      pensamentosNegativos,
      objetivoTerapia,
      temasDelicados,
      estiloAtendimento,
      observacoesFinais,
      autorizacaoLGPD,
    } = body;

    // Validação simples dos campos obrigatórios (pode ser mais elaborado)
    if (
      !nome ||
      !email ||
      !nascimento ||
      !idade ||
      !cpf ||
      !preocupacao ||
      !motivoAtendimento
    
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios!" },
        { status: 400 }
      );
    }

    const prePaciente = await prisma.prePaciente.create({
      data: {
        nome,
        email,
        endereco,
        nascimento,
        idade,
        cpf,
        telefone,
        emergencia,
        generoOrientacao,
        estadoCivil,
        origemConhecimento,
        preocupacao,
        motivoAtendimento,
        experienciaAnterior,
        saudeFisica,
        detalhesSaudeFisica,
        medicamentos,
        diagnosticoMental,
        historicoFamiliar,
        rotina,
        sono,
        atividadeFisica,
        estresse,
        convivencia,
        relacaoFamiliar,
        apoioSocial,
        nivelFelicidade,
        ansiedade,
        pensamentosNegativos,
        objetivoTerapia,
        temasDelicados,
        estiloAtendimento,
        observacoesFinais,
        autorizacaoLGPD,
        habilitado: false,
      },
    });

    return NextResponse.json(
      { message: "Pré-cadastro de anamnese realizado com sucesso!", data: prePaciente },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao cadastrar anamnese:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "CPF já cadastrado!" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}









