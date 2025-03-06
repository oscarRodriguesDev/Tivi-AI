// next-auth.d.ts

import { User as PrismaUser, UserRole } from "@prisma/client"; // Importe a enum UserRole do Prisma
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole; // Agora tipado como UserRole, que é a enum do Prisma
    };
  }

  // Extenda a interface User do NextAuth para adicionar o 'role' e manter compatibilidade com Prisma
  interface User extends PrismaUser {
    role: UserRole; // 'role' agora é tipado como UserRole
  }
}
