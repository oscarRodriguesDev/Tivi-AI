import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";


export const metadata: Metadata = {
  title: "Tivi AI - Paciente",
  description: "System smart meet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
     {children}
      </body>
    </html>
  );
}
