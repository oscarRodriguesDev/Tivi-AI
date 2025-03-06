import type { Metadata } from "next";

import AuthProvider from "../context/AuthProvider";



export const metadata: Metadata = {
  title: "Tivi AI - Psicólogo",
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
