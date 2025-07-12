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



/**
 * Instância do Prisma Client para interações com o banco de dados.
 * Deve ser reutilizada sempre que possível para evitar múltiplas conexões simultâneas.
 * 
 * @const {PrismaClient} prisma - Cliente do Prisma para acesso ao banco.
 */
const prisma = new PrismaClient();




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
    const { cpf, cfp, crp, nome, rg, email, data_nasc, celular, telefone,lastname } = body;

    if (!cpf || !crp || !nome || !rg || !email || !data_nasc || !celular || !telefone||!lastname) {
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
       habilitado:false
      },
    });
    //retorno caso sucesso
    return NextResponse.json({ message: "Pré-cadastro realizado com sucesso!", data: newPrePsicologo }, { status: 201 });

  } catch (error: any) {

    // Tratamento para erro de duplicação de CPF ou CFP
    if (error.code === "P2002") {
      return NextResponse.json({ error: "CPF ou CRP já cadastrado!" }, { status: 409 });
    }

    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}












