import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, UserRole } from "@prisma/client";
import { compare } from "bcryptjs";


const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        id:{label:'Id',type:'id'},
        email: { label: "Email", type: "email", placeholder: "exemplo@email.com" },
        password: { label: "Senha", type: "password" },
        role: { label: "role", type:'UserRole'},
       
      },
      async authorize(credentials) {
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
      // Adiciona `role` ao token quando o usuário faz login
      if (user) {
        token.id = user.id
        token.role = user.role; // Adiciona o role do usuário ao token
       
      }
      return token;
    },
  
    async session({ session, token }) {
      // Passa o `role` do token para a sessão
      if (token) {
        session.user.role = token.role as UserRole; // Faz o cast para UserRole
        session.user.id =  token.id as string;
        
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
   pages: {
    signIn: "/login",
  
  }, 
});

export { handler as GET, handler as POST };
