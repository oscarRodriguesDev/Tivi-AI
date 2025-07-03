


import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";





/**
 * PrismaClient é o client do ORM Prisma para realizar consultas e transações com o banco de dados.
 * Recomendado criar apenas uma instância por execução, especialmente em ambientes serverless.
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client
 */

const prisma = new PrismaClient();

 
/**
 * Função assíncrona para fazer upload de um arquivo no Supabase Storage.
 *
 * @param {File} file - O arquivo a ser enviado.
 * @returns {Promise<string | null>} A URL pública do arquivo salvo ou null em caso de erro.
 */
async function uploadFile(file: File, path: string) {
 
  // Limpa o nome do arquivo: remove espaços, acentos e caracteres especiais
  const sanitizedFileName = file.name
    .normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove marcas de acento
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/[^a-zA-Z0-9.-]/g, ''); // Remove caracteres não permitidos (exceto ponto e hífen)

  const fileName = `${Date.now()}-${sanitizedFileName}`; // Nome único e limpo

  const { data, error } = await supabase.storage
    .from('docs-tiviai')
    .upload(`${path}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return null;
  }


  const { data: publicUrl } = supabase
    .storage
    .from('tiviai-images')
    .getPublicUrl(`${path}/${fileName}`);

  return publicUrl?.publicUrl;
}


/* 
// Função que recebe a requisição POST e chama `uploadFile`
export async function POST(req: Request) {
    const path = new URL(req.url).searchParams.get('path');
  try {
    // Obtém os dados da requisição
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
    
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }
    // Chama a função de upload
    let fileUrl: string | null = null;
  
      fileUrl = await uploadFile(file, String(path));
      console.log(fileUrl)
   
    if (!fileUrl) {
      return NextResponse.json({ error: 'Erro ao salvar o arquivo' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Upload realizado com sucesso!', url: fileUrl });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

 */


export async function POST(req: Request) {
  const path = new URL(req.url).searchParams.get('path') || 'model-doc'

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const psicologoId = formData.get('psicologoId') as string

    if (!file || !name || !psicologoId) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const fileUrl = await uploadFile(file, path)
    if (!fileUrl) {
      return NextResponse.json({ error: 'Erro ao salvar o arquivo' }, { status: 500 })
    }

    const doc = await prisma.model_doc.create({
      data: {
        name,
        url: fileUrl,
        psicologoId,
      }
    })

    return NextResponse.json(doc)
  } catch (err) {
    console.error("Erro na API POST:", err)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}