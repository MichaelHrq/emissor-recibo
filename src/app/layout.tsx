import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerador de Recibo de Serviço PDF | Rápido e Grátis",
  description: "Crie recibos de prestação de serviços profissionais em PDF (A4) prontos para imprimir. Ferramenta gratuita para gerar e baixar recibos na hora.",
  icons: {
    icon: "/favicon.ico", // Opcional: se tiver um ícone
  },
  openGraph: {
    title: "Gerador de Recibo de Serviço PDF",
    description: "Gere seus recibos de serviço em segundos. Layout profissional A4.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
