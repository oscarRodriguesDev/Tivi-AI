import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const prisma = new PrismaClient();
    
    // Obtém o IP do cliente
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipNumber = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    
    // Busca o consentimento no banco de dados
    const consent = await prisma.cookies_consent.findUnique({
      where: {
        ipNumber: ipNumber
      }
    });

    // Se não encontrar o consentimento, retorna 404
    if (!consent) {
      return NextResponse.json(
        { error: 'Consentimento não encontrado' },
        { status: 404 }
      );
    }

    // Verifica se o consentimento está desatualizado (mais de 30 dias)
    const consentDate = new Date(consent.data.split('/').reverse().join('-'));
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - consentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      // Remove o consentimento antigo
      await prisma.cookies_consent.delete({
        where: {
          id: consent.id // Usando o ID do consentimento para garantir a exclusão correta
        }
      });
      return NextResponse.json(
        { error: 'Consentimento expirado' },
        { status: 404 }
      );
    }

    return NextResponse.json(consent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar consentimento' },
      { status: 500 }
    );
  }
}






export async function DELETE(req: Request) {
  try {
    const prisma = new PrismaClient();
    
    // Obtém o IP do cliente
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipNumber = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    
    // Deleta o consentimento do banco de dados
    await prisma.cookies_consent.delete({
      where: {
        ipNumber: ipNumber
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar consentimento' },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {
  try {
    const prisma = new PrismaClient();
    const { accepted, timestamp } = await req.json();
    
    // Obtém o IP do cliente
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipNumber = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    
    // Formata a data e hora
    const data = new Date(timestamp).toLocaleDateString('pt-BR');
    const hora = new Date(timestamp).toLocaleTimeString('pt-BR');
    
    // Salva no banco de dados
    await prisma.cookies_consent.create({
      data: {
        ipNumber,
        data,
        Hora: hora,
        permissão: accepted
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao salvar consentimento' },
      { status: 500 }
    );
  }
}
