import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Função para fazer upload de arquivo no Supabase Storage
async function uploadFile(file: File) {
  const fileName = `${Date.now()}-${file.name}`; // Garante um nome único
  
  // Faz o upload do arquivo no bucket "tiviai-images"
  const { data, error } = await supabase.storage
    .from('tiviai-images')
    .upload(`profile-pictures/${fileName}`, file, {
      cacheControl: '3600', 
      upsert: false,
    });

  if (error) {
    console.error('Erro no upload:', error);
    return null;
  }

  console.log('Arquivo enviado com sucesso:', data);

  // Obtém a URL pública do arquivo
  const { data: publicUrl } = supabase
    .storage
    .from('tiviai-images')
    .getPublicUrl(`profile-pictures/${fileName}`);

  return publicUrl.publicUrl; // Retorna a URL pública do arquivo salvo
}


// Função para fazer upload de qualquer arquivo no Supabase Storage
async function uploadPhotos(file: File,path:string) {
  const fileName = `${Date.now()}-${file.name}`; // Garante um nome único
  
  // Faz o upload do arquivo no bucket "tiviai-images"
  const { data, error } = await supabase.storage
    .from('tiviai-images')
    .upload(`${path}/${fileName}`, file, {
      cacheControl: '3600', 
      upsert: false,
    });

  if (error) {
    console.error('Erro no upload:', error);
    return null;
  }

  console.log('Arquivo enviado com sucesso:', data);

  // Obtém a URL pública do arquivo
  const { data: publicUrl } = supabase
    .storage
    .from('tiviai-images')
    .getPublicUrl(`${path}/${fileName}`);

  return publicUrl.publicUrl; // Retorna a URL pública do arquivo salvo
}

// Função que recebe a requisição POST e chama `uploadFile`
export async function POST(req: Request) {
  try {
    // Obtém os dados da requisição
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Chama a função de upload
    const fileUrl = await uploadFile(file);
    if (!fileUrl) {
      return NextResponse.json({ error: 'Erro ao salvar o arquivo' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Upload realizado com sucesso!', url: fileUrl });
  } catch (err) {
    console.error('Erro inesperado:', err);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
