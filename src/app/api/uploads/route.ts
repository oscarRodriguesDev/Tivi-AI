import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Função para fazer upload de arquivo no Supabase Storage
// Função para fazer upload de arquivo no Supabase Storage
async function uploadFile(file: File) {
  const fileName = `${Date.now()}-${file.name}`; // Garante um nome único
  console.log(`esse é o nome do arquivo:${fileName}`)

/*   // Verifica se o usuário está autenticado
  const { data: user, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('Usuário não autenticado ou erro ao obter usuário:', authError);
    return null;
  }
 */
  // Faz o upload do arquivo no bucket "tiviai-images"
  const { data, error } = await supabase.storage
    .from('tiviai-images')
    .upload(`users/${fileName}`, file, {
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
    .getPublicUrl(`users/${fileName}`);

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
