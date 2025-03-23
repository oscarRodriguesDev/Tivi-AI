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

  
  
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
     return
    }
  }, [status, router]);

  
  if (status === "loading") return <p>Carregando...</p>; 

  return (
    <>
      {children}
    </>
  );
}
