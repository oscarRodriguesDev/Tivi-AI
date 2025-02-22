"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Menu from "../(protected)/components/menu";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redireciona se não estiver logado
    }
  }, [status, router]);

  if (status === "loading") return <p>Carregando...</p>; // Pode adicionar um spinner aqui

  return(
    <>
    <Menu/>
   {children}
   </>
  )
 }

  
  
