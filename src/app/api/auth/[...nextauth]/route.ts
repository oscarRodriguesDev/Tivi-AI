/**
 * Importações utilizadas para autenticação e gerenciamento de banco de dados:
 * 
 * - `NextAuth`: 
 *    Framework principal para autenticação no Next.js.
 * 
 * - `CredentialsProvider` (next-auth/providers/credentials):
 *    Provedor de autenticação que permite login com credenciais personalizadas.
 * 
 * - `PrismaAdapter` (@next-auth/prisma-adapter):
 *    Adaptador que conecta o NextAuth com o Prisma ORM.
 * 
 * - `PrismaClient`, `UserRole` (@prisma/client):
 *    Cliente do Prisma para interação com o banco de dados e enumeração de roles.
 * 
 * - `compare` (bcryptjs):
 *    Função para comparação segura de senhas hasheadas.
 */


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, UserRole } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();
/**
 * Configuração principal do NextAuth para autenticação na aplicação.
 * 
 * Este handler configura:
 * - O adaptador Prisma para persistência de dados
 * - O provedor de credenciais para autenticação com email/senha
 * - Estratégia de sessão JWT
 * - Callbacks para personalização do token e sessão
 * 
 * @param {Object} config - Configuração do NextAuth
 * @param {PrismaAdapter} config.adapter - Adaptador Prisma para persistência
 * @param {Array} config.providers - Lista de provedores de autenticação
 * @param {Object} config.session - Configuração da sessão
 * @param {Object} config.callbacks - Funções de callback para personalização
 * 
 * @returns {Object} Handler do NextAuth configurado
 */
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        id: { label: 'Id', type: 'id' },
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        role: { label: "role", type: 'UserRole' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Email e senha são obrigatórios.");
          throw new Error("Email e senha são obrigatórios.");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("Usuario não existe no sistema"); //teste de erro
        }
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
         //redirecionar para tela de login
         throw new Error("Usuario ou senha incorretos!");
          //throw new Error("erro senha");
        }
        if (![UserRole.ADMIN, UserRole.PSYCHOLOGIST, UserRole.COMMON].includes(user.role)) {
          throw new Error("Acesso negado: este usuário não tem permissão.");
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Adiciona `role` ao token quando o usuário faz login
      if (user) {
        token.id = user.id
        token.role = user.role; // Adiciona o role do usuário ao token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: `/login`,
    signOut: `/`,
    error: `/login`,

  },
});
export { handler as GET, handler as POST };

