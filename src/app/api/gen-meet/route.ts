import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

// Criar uma reunião
export async function POST(req: Request) {
  const titulo =  'Consulta'
  try {
    const { pacienteId,name, fantasy_name, titulo:titulo, psicologoId, data, hora, tipo_consulta, observacao, recorrencia } = await req.json();

    const novaConsulta = await prisma.consulta.create({
      data: { pacienteId, fantasy_name, titulo, psicologoId,name, data, hora, tipo_consulta, observacao, recorrencia },
    });

    return NextResponse.json(novaConsulta, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar reunião" }, { status: 500 });
  }
}

// Recuperar reuniões
export async function GET() {
 

  try {
    const consultas = await prisma.consulta.findMany();
    return NextResponse.json(consultas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar reuniões" }, { status: 500 });
  }
}

// Atualizar uma reunião
export async function PUT(req: Request) {


  try {
    const { id, ...dadosAtualizados } = await req.json();

    const consultaAtualizada = await prisma.consulta.update({
      where: { id },
      data: dadosAtualizados,
    });

    return NextResponse.json(consultaAtualizada, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar reunião" }, { status: 500 });
  }
}

// Deletar uma reunião
export async function DELETE(req: Request) {


  try {
    const { id } = await req.json();

    await prisma.consulta.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Reunião deletada com sucesso" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar reunião" }, { status: 500 });
  }
}
