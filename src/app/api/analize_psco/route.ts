import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';
const prisma = new PrismaClient();




export async function GET() {
  try {
    // Busca todos os pré-psicólogos no banco
    const prePsicologos = await prisma.prePsicologo.findMany();

    return NextResponse.json({ data: prePsicologos }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar pré-psicólogos:", error);
    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}



export async function POST(req: Request) {
  try {
    const body = await req.json(); // Pega os dados do corpo da requisição

    // Verifica se todos os campos necessários estão preenchidos
    const { cpf, cfp,crp, nome, rg, email, data_nasc, celular, telefone } = body;

    if (!cpf || !cfp || !crp || !nome || !rg || !email || !data_nasc || !celular || !telefone) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios!" }, { status: 400 });
    }

    // Cadastra no banco
    const newPrePsicologo = await prisma.prePsicologo.create({
      data: {
        cpf,
        cfp,
        crp,
        nome,
        rg,
        email,
        data_nasc,
        celular,
        telefone,
        habilitado:false
      },
    });

    return NextResponse.json({ message: "Pré-cadastro realizado com sucesso!", data: newPrePsicologo }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao cadastrar:", error);
    
    // Tratamento para erro de duplicação de CPF ou CFP
    if (error.code === "P2002") {
      return NextResponse.json({ error: "CPF ou CFP já cadastrado!" }, { status: 409 });
    }

    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}



async function notificar(email: string, nome: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // Usando o serviço do Gmail
    auth: {
      user: 'oskharm12@gmail.com',  // Seu endereço de e-mail do Gmail
      pass: 'oger kdri xfhj wgvj',   // Sua senha do Gmail ou App Password (recomendado)
    },
  });

  const mailOptions = {
    from: 'oskharm12@gmail.com',  // O e-mail que está enviando a mensagem
    to: email,
    subject: 'Cadastro habilitado no Tivi AI',
    text: `Olá ${nome},\n\nSeu cadastro como psicólogo foi habilitado com sucesso no Tivi AI! \n\n Complete seu cadastro e começe suas reuniões inteligentes hoje mesmo`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado: ', info.response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
}



//habilitar psicologo informando o cpf
export async function PUT(req: Request) {
  try {
    const { cpf } = await req.json(); // Pega o CPF do psicólogo que será habilitado

    if (!cpf) {
      return NextResponse.json({ error: "CPF é obrigatório" }, { status: 400 });
    }

    // Atualiza o campo 'habilitado' para 'true' no banco
    const updatedPsicologo = await prisma.prePsicologo.update({
      where: {
        cpf: cpf, // Encontra o psicólogo pelo CPF
      },
      data: {
        habilitado: true, // Define como 'habilitado' verdadeiro
        
      },
    });

    // Depois de habilitar o psicólogo, enviar e-mail de notificação
    await notificar(updatedPsicologo.email, updatedPsicologo.nome);

    return NextResponse.json({ message: "Psicólogo habilitado com sucesso", data: updatedPsicologo }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao habilitar psicólogo:", error);
    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}
