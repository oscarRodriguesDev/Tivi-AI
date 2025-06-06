/** 
 * Módulo de dependências utilizado para o endpoint de cadastro e envio de email de verificação.
 * Este módulo integra:
 * - Prisma ORM para manipulação de banco de dados.
 * - Next.js API Response.
 * - Nodemailer para envio de emails.
 * - crypto-random-string para geração de códigos aleatórios.
 * - bcrypt para criptografia de senhas.
 */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';
import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcrypt';


/**
 * Instância do Prisma Client para interações com o banco de dados.
 * Deve ser reutilizada sempre que possível para evitar múltiplas conexões simultâneas.
 * 
 * @const {PrismaClient} prisma - Cliente do Prisma para acesso ao banco.
 */
const prisma = new PrismaClient();


/**
 * Manipulador HTTP GET para recuperar todos os pré-psicólogos cadastrados no banco de dados.
 *
 * @async
 * @function GET
 * @param {Request} req - Requisição HTTP contendo os dados do pré-cadastro no corpo da requisição.
 * @returns {Promise<NextResponse>} Uma resposta JSON contendo os dados dos pré-psicólogos ou uma mensagem de erro.
 */

export async function GET(req: Request) {
  try {
    // Busca todos os pré-psicólogos no banco
    const prePsicologos = await prisma.prePsicologo.findMany();

    return NextResponse.json({ data: prePsicologos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}


/**
 * Manipulador HTTP POST que cria um novo pré-cadastro de psicólogo.
 *
 * Recebe os dados enviados pelo formulário e armazena no banco de dados.
 * Campos obrigatórios: cpf, cfp, crp, nome, rg, email, data_nasc, celular, telefone.
 * Em caso de sucesso, retorna os dados do novo pré-psicólogo cadastrado.
 * Em caso de erro, retorna mensagens apropriadas, incluindo erro de duplicação (CPF/CFP).
 *
 * @async
 * @function POST
 * @param {Request} req - Requisição HTTP contendo os dados do pré-cadastro no corpo da requisição.
 * @returns {Promise<NextResponse>} Resposta com status 201 e dados do pré-cadastro criado, 
 *                                  ou mensagem de erro com status apropriado.
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cpf, cfp, crp, nome, rg, email, data_nasc, celular, telefone, lastname } = body;

    if (!cpf || !crp || !nome || !rg || !email || !data_nasc || !celular || !telefone || !lastname) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios!" }, { status: 400 });
    }
    const newPrePsicologo = await prisma.prePsicologo.create({
      data: {
        cpf,
        cfp,
        crp,
        nome,
        lastname,
        rg,
        email,
        data_nasc,
        celular,
        telefone,
        //habilitado define que o psicologo ainda não foi habilitado no sistema
        habilitado: false
      },
    });
    //retorno caso sucesso
    return NextResponse.json({ message: "Pré-cadastro realizado com sucesso!", data: newPrePsicologo }, { status: 201 });

  } catch (error: any) {
    // Tratamento para erro de duplicação de CPF ou CFP
    if (error.code === "P2002") {
      return NextResponse.json({ error: "CPF ou CFP já cadastrado!" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}



/**
 * Notifica por e-mail que o usuário foi habilitado com sucesso.
 * 
 * @param {string} email - E-mail do usuário que será notificado.
 * @param {string} nome - Nome do usuário habilitado.
 * @param {string} email_system - E-mail gerado para acessar a plataforma.
 * @param {string} senha - Senha temporária gerada para o primeiro acesso.
 */
async function notificar(email: string, nome: string, email_system: string, senha: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_RESPONSE,
      pass: process.env.KEY_EMAIL_RESPONSE,
    },
  });

  const mailOptions = {
    from: 'oskharm12@gmail.com',
    to: email,
    subject: 'Cadastro Habilitado no Tivi AI',
    text: `Prezado(a) ${nome},\n\n
  É com prazer que informamos que seu cadastro como psicólogo foi habilitado com sucesso na plataforma Tivi AI.\n\n
  Abaixo, seguem seus dados de acesso para completar seu cadastro e iniciar sua jornada na plataforma:\n\n
  Email: "${email_system}"\n
  Senha: ${senha}\n\n
  Para sua segurança, recomendamos que, ao acessar a plataforma pela primeira vez, você altere sua senha. Isso garantirá a proteção do seu acesso e dados.\n\n
  Caso tenha alguma dúvida ou necessite de suporte, não hesite em nos contatar.\n\n
  Atenciosamente,\n
  Equipe Tivi AI`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
  }
}



/**
 * Gera uma senha aleatória composta por caracteres alfanuméricos.
 * 
 * @param {number} [tamanho=8] - O comprimento da senha a ser gerada (valor padrão: 8).
 * @returns {string} - Retorna a senha gerada em formato de string.
 */
function gerarSenhaAleatoria(tamanho: number = 8): string {
  const senha = cryptoRandomString({ length: tamanho, type: 'alphanumeric' });
  return senha
}


/**
 * Efetiva o cadastro do psicólogo no banco de dados.
 * 
 * @param {string} nome - Nome completo do psicólogo.
 * @param {string} email_confirm - E-mail do psicólogo para confirmação e comunicação.
 * @param {string} cpf - CPF do psicólogo (Cadastro de Pessoa Física).
 * @param {string} cfp - Código de identificação profissional do psicólogo.
 * @param {string} crp - Número do registro no Conselho Regional de Psicologia (CRP).
 * @param {string} telefone - Telefone fixo do psicólogo.
 * @param {string} celular - Número de celular do psicólogo.
 * @param {string} data_nasc - Data de nascimento do psicólogo no formato "aaaa-mm-dd".
 * 
 * @returns {Promise<void>} - Retorna uma Promise que não resolve nenhum valor explícito.
 */
async function efetivarPsicologo(nome: string, lastname: string, email_confirm: string, cpf: string, cfp: string, crp: string, telefone: string, celular: string, data_nasc: string) {
  let cname = `${nome.replace(/\s+/g, "")}.${lastname.replace(/\s+/g, "")}`
  cname = cname.toLowerCase()
  const senha = gerarSenhaAleatoria().toLowerCase()
  const hashedPassword = await bcrypt.hash(senha, 10);

  const first_acess = false

  /**
 * Calcula a idade com base em uma data de nascimento fornecida.
 * 
 * @param {string} data - Data de nascimento no formato "mm/dd/aaaa" ou "aaaa-mm-dd".
 * @returns {number} - Retorna a idade em anos completos.
 * 
 */
  const defIdade = (data: string) => Math.floor((new Date().getTime() - new Date(data).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  const psicologo = await prisma.user.create({
    data: {
      name: nome,
      lastname: lastname,
      email: `${cname}@tiviai.com.br`,
      email_confirm: email_confirm,
      password: hashedPassword,
      role: 'PSYCHOLOGIST',
      cpf: cpf,
      cfp: cfp,
      crp: crp,
      telefone: telefone,
      celular: celular,
      idade: String(defIdade(data_nasc)), //passamos a idade para o objeto a ser salvo
      first_acess: true, //primeiro acesso definido


    }
  });

  try {
    /*  Enviando a requisição POST para outro endpoint */
    const apiUrl = `${process.env.NEXTAUTH_URL}/api/register_admins`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(psicologo)
    });

    if (!psicologo.email_confirm) {
      return NextResponse.json(
        { error: "E-mail de confirmação é obrigatório para notificar o psicólogo." },
        { status: 400 }
      );
    }

    const data = await response.json();
    /* Aqui estamos efetivando o psicologo caso seu cadastro seja aprovado */
    await notificar(email_confirm, nome, psicologo.email, senha)
    return data;
  } catch (error) {

    throw error;
  }
}



/**
 * Manipulador HTTP PUT que habilita um psicólogo previamente cadastrado no sistema.
 *
 * Recebe o CPF do psicólogo no corpo da requisição, valida a existência do registro,
 * atualiza o campo `habilitado` para `true`, efetiva o cadastro e envia um e-mail de notificação.
 *
 * @async
 * @function PUT
 * @param {Request} req - Requisição HTTP contendo o CPF do psicólogo a ser habilitado.
 * @returns {Promise<NextResponse>} Resposta com status 200 e dados do psicólogo habilitado,
 *                                  ou mensagem de erro com status apropriado.
 */

export async function PUT(req: Request) {
  try {
    const { cpf } = await req.json();
    if (!cpf) {
      return NextResponse.json({ error: "CPF é obrigatório" }, { status: 400 });
    }

    //busca o psicologo que vai ser autorizado
    const prePsicologo = await prisma.prePsicologo.findUnique({
      where: { cpf },
    });

    if (!prePsicologo) {
      return NextResponse.json({ error: "Psicólogo não encontrado" }, { status: 404 });
    }

    // Atualiza o campo 'habilitado' para 'true' no banco
    const updatedPsicologo = await prisma.prePsicologo.update({
      where: { cpf },
      data: { habilitado: true },
    });

    //garante que o sobrenome do psicólogo é obrigatório
    if (!updatedPsicologo.lastname) {
      return NextResponse.json({ error: "Sobrenome do psicólogo é obrigatório" }, { status: 400 });
    }
    // Efetiva o psicólogo no sistema e envia e-mail de notificação
    await efetivarPsicologo(
      updatedPsicologo.nome,
      updatedPsicologo.lastname,
      updatedPsicologo.email,
      updatedPsicologo.cfp,
      updatedPsicologo.cfp,
      updatedPsicologo.crp,
      updatedPsicologo.telefone,
      updatedPsicologo.celular,
      updatedPsicologo.data_nasc,

    );

    // Retorna todos os dados disponíveis do psicólogo após habilitação
    return NextResponse.json({
      message: "Psicólogo habilitado com sucesso",
      data: updatedPsicologo,
    }, { status: 200 });

  } catch (error: any) {

    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}

