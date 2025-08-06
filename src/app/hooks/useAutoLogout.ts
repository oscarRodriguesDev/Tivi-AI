// hooks/useAutoLogout.ts

import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

export function useAutoLogout(inactivityMs: number = 10 * 60 * 1000) {
  const { status } = useSession();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const localStorageKey = "autoLogoutExpiry"; // armazena o timestamp limite

  // Define o timestamp limite (data/hora do logout)
  const setExpiry = () => {
    const expiry = Date.now() + inactivityMs;
    localStorage.setItem(localStorageKey, expiry.toString());
   
  };

  // Reseta o timer de logout (usado após interação)
  const resetLogoutTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Pega o timestamp limite do localStorage (ou seta um novo)
    let expiry = localStorage.getItem(localStorageKey);
    if (!expiry) {
      setExpiry();
      expiry = localStorage.getItem(localStorageKey)!;
    }

    const msLeft = Number(expiry) - Date.now();

    // Se tempo já passou, desloga imediatamente
    if (msLeft <= 0) {
      localStorage.removeItem(localStorageKey);
      signOut({ callbackUrl: "/login" });
      return;
    }

   

    timerRef.current = setTimeout(() => {
      console.log("[AutoLogout] Tempo esgotado, deslogando...");
      localStorage.removeItem(localStorageKey);
      signOut({ callbackUrl: "/login" });
    }, msLeft);
  };

  useEffect(() => {
    if (status !== "authenticated") {
      // Limpa tudo se não estiver autenticado
      localStorage.removeItem(localStorageKey);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Ao entrar, se não tiver timestamp, cria
    if (!localStorage.getItem(localStorageKey)) {
      setExpiry();
    } else {
      // Se timestamp existe, verifica se já expirou
      const expiry = Number(localStorage.getItem(localStorageKey));
      const now = Date.now();
      if (now >= expiry) {
      
        localStorage.removeItem(localStorageKey);
        signOut({ callbackUrl: "/login" });
        return;
      } else {
      
      }
    }

    resetLogoutTimer();

    // Eventos que indicam atividade do usuário (para resetar contagem)
    const activityEvents = ["mousemove", "keydown", "scroll", "click"];
    const activityHandler = () => {
      setExpiry();     // Atualiza o timestamp no localStorage
      resetLogoutTimer();  // Reseta o timer interno
    };

    activityEvents.forEach((event) => window.addEventListener(event, activityHandler));



    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, activityHandler));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, inactivityMs]);
}
