"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  /* definir o que admin e psicologo podem acessar */
  
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redireciona se não estiver logado
    }
  }, [status, router]);

  // Durante o carregamento da sessão, mostramos uma mensagem de espera
  if (status === "loading") return <p>Carregando...</p>; 

  // Caso a sessão não esteja presente e o status não seja "loading", garantimos que o usuário será redirecionado
  if (status === "unauthenticated") return null; 

  return (
    <>
      {children}
    </>
  );
}
