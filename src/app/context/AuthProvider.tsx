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
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Verifica o status somente após ele ser carregado
    if (status === "loading") {
      return
    } else {
      if (status === "unauthenticated") {

        router.push("/");
        return
      } else if (status === "authenticated") {
        router.push("/common-page");
        return
      }
    }

  }, [status, router]); // Executa sempre que o status mudar

  if (status === "loading") { return <p>Carregando...</p>; }else{// Exibe "Carregando..." enquanto a autenticação não está pronta

  return (
    <>
      {children} {/* Renderiza o conteúdo filho se a sessão for carregada */}
    </>
  );
}
}