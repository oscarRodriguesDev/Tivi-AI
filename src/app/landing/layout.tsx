// src/app/layout.tsx
import type { Metadata } from "next";
import '../globals.css'
import CookiesAlert from "../components/cookies-alert";
import Footer from "../components/footer";
import WhatsappButton from "../components/whatsapp-button";


export const metadata: Metadata = {
  title: "Tivi AI - Consultas Inteligentes",
  description:
    "Tivi AI é um sistema inteligente que transforma suas consultas online com transcrição, trazendo insights com inteligência artificial",
  keywords:
    `inteligência artificial, reuniões, transcrição automática,
     agendamento inteligente, produtividade, assistente virtual,psicologia,psicologos,
     nr1,saudeocupacional, saúde emocional,chat gpt, agente de ia, `,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (


    <>
    
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsappButton />
      <CookiesAlert />
    </>


  );
}

