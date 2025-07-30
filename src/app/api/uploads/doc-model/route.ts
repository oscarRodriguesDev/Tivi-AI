import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, psicologoId, prompt } = await req.json()

    if (!name || !psicologoId || !prompt) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, psicologoId, prompt' },
        { status: 400 }
      )
    }

    const novoDoc = await prisma.model_doc.create({
      data: {
        name,
        psicologoId,
        prompt,
      },
    })

    return NextResponse.json(novoDoc, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar documento:', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}

// mock local (pode mover pra outro arquivo depois)
const Relatorios = (idP: string) => [
  {
    id: "1",
    name: "DPT",
    psicologoId: idP,
    prompt: "fale como fazer uma receita de bolo"
  },
  {
    id: "2",
    name: "TRT",
    psicologoId: idP,
    prompt: "fale como fazer uma receita de brigadeiro"
  },
  {
    id: "3",
    name: "RBT",
    psicologoId: idP,
    prompt: "fale como fazer uma receita de beijinho doce"
  },
  {
    id: "4",
    name: "AV",
    psicologoId: idP,
    prompt: "fale como fazer uma receita de torrada de chocolate"
  }
]

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const psicologoId = url.searchParams.get('psicologoId')

    if (!psicologoId) {
      return NextResponse.json(
        { error: 'Campo obrigatório: psicologoId' },
        { status: 400 }
      )
    }

    const docs = await prisma.model_doc.findMany({
      where: { psicologoId },
    })

    // Se não houver documentos, usa os mockados
    if (!docs || docs.length === 0) {
      const mockDocs = Relatorios(psicologoId)
      return NextResponse.json(mockDocs, { status: 200 })
    }

    // Retorna os docs do banco normalmente
    return NextResponse.json(docs, { status: 200 })

  } catch (error: any) {
    console.error('Erro ao buscar documentos:', error)
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}


//delete
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const docId = url.searchParams.get('docId')

    if (!docId) {
      return NextResponse.json(
        { error: 'Campo obrigatório: docId' },
        { status: 400 }
      )
    }

    const deletedDoc = await prisma.model_doc.delete({
      where: { id: docId },
    })

    return NextResponse.json({ message: 'Documento deletado com sucesso' }, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao deletar documento:', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
