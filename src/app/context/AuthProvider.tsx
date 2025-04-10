"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    const isPublicPage = ["/", "/login", "/register"].includes(pathname || "");

    if (status === "unauthenticated" && !isPublicPage) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && isPublicPage) {
      router.push("/common-page");
      return;
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  return <>{children}</>;
}
