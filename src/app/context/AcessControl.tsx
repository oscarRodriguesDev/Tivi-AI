'use client'

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSession } from "next-auth/react"; // Continuamos usando o useSession para pegar o papel do usuário


type Role = 'ADMIN' | 'PSYCHOLOGIST' | 'COMMON';

// Interface do contexto
interface AccessControlContextProps {
  role: Role | null;
  hasRole: (role: Role) => boolean;
}

const AccessControlContext = createContext<AccessControlContextProps | undefined>(undefined);

// Provider para disponibilizar o contexto
export const AccessControlProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession(); // Somente pegamos o dado da sessão (não fazemos a verificação de autenticação aqui)
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    // Agora apenas setamos o papel do usuário se ele estiver logado
    if (session?.user?.role) {
      setRole(session.user.role as Role);
    }
  }, [session]);

  // Função para verificar se o usuário tem o papel necessário
  const hasRole = (role: Role) => {
    return role === role;
  };

  return (
    <AccessControlContext.Provider value={{ role, hasRole }}>
      {children}
    </AccessControlContext.Provider>
  );
};


// Hook para acessar o contexto
export const useAccessControl = (): AccessControlContextProps => {
  const context = useContext(AccessControlContext);
  if (!context) {
    throw new Error("useAccessControl must be used within an AccessControlProvider");
  }
  return context;
};
