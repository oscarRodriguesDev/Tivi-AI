import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';
import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcrypt';



const prisma = new PrismaClient();

//retorna todos os psicologos
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




//criar um novo pre cadastro do psicologo
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Pega os dados do corpo da requisição

    // Verifica se todos os campos necessários estão preenchidos
    const { cpf, cfp, crp, nome, rg, email, data_nasc, celular, telefone } = body;

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
        habilitado: false
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



async function notificar(email: string, nome: string, email_system: string, senha: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // Usando o serviço do Gmail
    auth: {
      user: 'oskharm12@gmail.com',  // Seu endereço de e-mail do Gmail
      pass: 'oger kdri xfhj wgvj',   // Sua senha do Gmail ou App Password (recomendado)
    },

    //vou chamar a rota pra criar o usuario com regra de psicologo
    //e enviar o email de confirmação

  });

  const mailOptions = {
    from: 'oskharm12@gmail.com',  // O e-mail que está enviando a mensagem
    to: email,
    subject: 'Cadastro habilitado no Tivi AI',
    text: `Olá ${nome},\n\n Seu cadastro como psicólogo foi habilitado com sucesso no Tivi AI! \n\n 
    estamos enviando seus dados de acesso para que você consiga completar seu cadastro!\n\n
    email: ${email_system}
    senha: ${senha}
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado: ', info.response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
}



// Função para gerar uma senha aleatória
function gerarSenhaAleatoria(tamanho: number = 8): string {
  const senha = cryptoRandomString({ length: tamanho, type: 'alphanumeric' });
  return senha
}


//essa função efetiva o cadastro do psicologo no banco de dados
async function efetivarPsicologo(nome: string, email_confirm: string) {
  // Criando o objeto do psicólogo
  nome = nome.replace(/\s+/g, "")
  const senha = gerarSenhaAleatoria()
  const hashedPassword = await bcrypt.hash(senha, 10);
  const psicologo = await prisma.user.create({
    data: {
      name: nome,
      email: `${nome}@tiviai.com.br`,
      email_confirm: email_confirm,
      password: hashedPassword,
      role: 'PSYCHOLOGIST'
    }
  });

  try {
    // Enviando a requisição POST para outro endpoint
    const apiUrl = `${process.env.NEXTAUTH_URL}/api/register_admins`
    const response = await fetch(apiUrl, {
      method: 'POST', // Definindo o método da requisição
      headers: {
        'Content-Type': 'application/json' // Informando que estamos enviando JSON
      },
      body: JSON.stringify(psicologo) // Convertendo o objeto psicologo para uma string JSON
    });


    if (!psicologo.email_confirm) {
      throw new Error("E-mail de confirmação é obrigatório para notificar o psicólogo.");
    }
    // Opcional: Pode retornar a resposta da API ou um status de sucesso
    const data = await response.json();
    console.log('Psicólogo cadastrado com sucesso:', data);

    await  notificar(email_confirm,nome,psicologo.email, senha)
    console.log(`use a senha: ${senha}`)
    return data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao tentar cadastrar psicólogo:', error);
    throw error; // Lançar o erro novamente para que possa ser tratado em outro lugar
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
    await efetivarPsicologo(updatedPsicologo.nome, updatedPsicologo.email)

    return NextResponse.json({ message: "Psicólogo habilitado com sucesso", data: updatedPsicologo }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao habilitar psicólogo:", error);
    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}
