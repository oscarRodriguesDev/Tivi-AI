import type { Metadata } from "next";

import AuthProvider from "../context/AuthProvider";
import CardUser from "./components/cardUser";
import Menu from "./components/menuLateral";
import { AccessControlProvider } from "../context/AcessControl";




export const metadata: Metadata = {
  title: "Tivi AI",
  description: "Tivi AI é um sistema inteligente que transforma suas cosnultas online com transcrição, trazendo insights com inteligencia artificial",
  keywords: "inteligência artificial, reuniões, transcrição automática, agendamento inteligente, produtividade, assistente virtual",
  robots: "index, follow",
  openGraph: {
    title: "Tivi AI - Revolucione Suas Reuniões",
    description: "Aumente sua produtividade com o Tivi AI, o assistente inteligente para reuniões que transcreve, agenda e fornece insights em tempo real.",
    url: "https://tivi.ai",
    type: "website",
    locale: "pt_BR",
    siteName: "Tivi AI",

  },

};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <AuthProvider>
            <AccessControlProvider>
          <Menu />
          <div className="flex-1 ml-[300px] mt-2">{/* Todo conteúdo  */}
            <CardUser />
              {children}  {/* Aqui você passa o children para que o conteúdo da página seja renderizado */}
          </div>
            </AccessControlProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
//alteração na dev
