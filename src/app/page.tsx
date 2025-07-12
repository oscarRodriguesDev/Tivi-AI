'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Home from "./(public-access)/landing/page";
import HeygenAvatar from "./components/heygen/heigen";

export default function LandingPage() {
    const [isClient, setIsClient] = useState(false); // Controlar a renderização do cliente
    const router = useRouter();

    useEffect(() => {
        setIsClient(true); 
    }, []);

    if (!isClient) {
        <div><h6>Carregando...</h6></div>
        return; // Retorna nada ou algum conteúdo de loading até que o cliente seja renderizado
    }

    return (
      <>
          <Home/>
          <HeygenAvatar/>
      </>
      
      
     
    );
}



