import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, UserRole } from "@prisma/client";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        id: { label: 'Id', type: 'id' },
        email: { label: "Email", type: "email", placeholder: "exemplo@email.com" },
        password: { label: "Senha", type: "password" },
        role: { label: "role", type: 'UserRole' },
      },
      async authorize(credentials, req) {
        const host = req?.headers?.host || "localhost:3000";

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Senha incorreta.");
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
      if (user) {
        token.id = user.id;
        token.role = user.role;
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

    async redirect({ url, baseUrl }) {
      // Detecta a origem dinamicamente com base na url da requisição
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return url;
    },
  },

  pages: {
    signIn: `/login`,
    signOut: `/`,
    error: `/login`,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
