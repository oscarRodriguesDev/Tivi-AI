// src/app/layout.tsx
import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importante!
import './globals.css'
import CookiesAlert from "./(general-policies)/components/cookies-alert";



export const metadata: Metadata = {
  title: "Tivi AI - Consultas Inteligentes",
  description:
    "Tivi AI é um sistema inteligente que transforma suas consultas online com transcrição, trazendo insights com inteligência artificial",
  keywords:
    `inteligência artificial, reuniões, transcrição automática,
     agendamento inteligente, produtividade, assistente virtual,psicologia,psicologos,
     nr1,saudeocupacional, saúde emocional,chat gpt, agente de ia `,
  robots: "index, follow",
  openGraph: {
    title: "Tivi AI - Revolucione Suas Reuniões",
    description:
      "Aumente sua produtividade com o Tivi AI, o assistente inteligente para reuniões que transcreve, agenda e fornece insights em tempo real.",
    url: "https://tivi.ai",
    type: "website",
    locale: "PT_BR",
    siteName: "Tivi AI",
  },
};

/* Layout principal da aplicação */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="pt-BR">
    <body>
        {children}
        
        <ToastContainer/>
        <CookiesAlert/>
    </body>
  </html>
  );
}


