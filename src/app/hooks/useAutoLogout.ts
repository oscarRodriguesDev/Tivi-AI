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
    console.log(`[AutoLogout] Novo expiry setado: ${new Date(expiry).toLocaleTimeString()}`);
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
      console.log("[AutoLogout] Tempo expirado no reset, deslogando");
      localStorage.removeItem(localStorageKey);
      signOut({ callbackUrl: "/login" });
      return;
    }

    console.log(`[AutoLogout] Reset timer: faltam ${Math.round(msLeft / 1000)} segundos`);

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
        console.log("[AutoLogout] Sessão expirou ao carregar, deslogando...");
        localStorage.removeItem(localStorageKey);
        signOut({ callbackUrl: "/login" });
        return;
      } else {
        console.log(`[AutoLogout] Sessão válida, expirará em ${Math.round((expiry - now)/1000)} segundos`);
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

    // Intervalo para imprimir tempo restante a cada segundo
    intervalRef.current = setInterval(() => {
      const expiry = Number(localStorage.getItem(localStorageKey));
      const now = Date.now();
      const diff = expiry - now;
      if (diff <= 0) {
        console.log("[AutoLogout] Tempo acabou (intervalo), deslogando...");
        localStorage.removeItem(localStorageKey);
        signOut({ callbackUrl: "/login" });
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        console.log(`[AutoLogout] Tempo restante: ${Math.round(diff / 1000)} segundos`);
      }
    }, 1000);

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, activityHandler));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, inactivityMs]);
}
