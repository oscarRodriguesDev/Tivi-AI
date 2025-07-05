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

// src/app/api/uploads/doc-model/route.ts
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

    return NextResponse.json(docs, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao buscar documentos:', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
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
