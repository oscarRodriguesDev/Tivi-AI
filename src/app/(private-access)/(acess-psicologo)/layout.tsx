

import type { Metadata } from "next";
import AuthProvider from "../../context/AuthProvider";
import Menu from "@/app/(private-access)/components/menuLateral";
import { AccessControlProvider } from "../../context/AcessControl";
import { HistoryProvider } from "@/app/context/historyContext";
import AppProvider from "@/app/context/AppProvider";



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
        <HistoryProvider>


          <AuthProvider>
              <AccessControlProvider>
          {/*   <div className="flex-1 ml-[300px] mt-2"> */}
             
            <Menu />
                <AppProvider>
              {children}
           </AppProvider>
            {/* </div> */}
              </AccessControlProvider>
          </AuthProvider>
      
        </HistoryProvider>
  );
}

