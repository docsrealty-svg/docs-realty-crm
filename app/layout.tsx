import type { Metadata } from "next";
import "./globals.css";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Automatizaciones Express",
  description: "Tienda de agentes, automatizaciones y productos IA listos para comprar, adaptar o instalar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
