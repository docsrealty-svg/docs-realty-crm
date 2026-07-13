import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "CRM comercial",
  },
  description: "CRM comercial para WhatsApp, leads, agenda y reportes.",
  openGraph: {
    title: "CRM comercial",
    description: "CRM comercial para WhatsApp, leads, agenda y reportes.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CRM comercial",
    description: "CRM comercial para WhatsApp, leads, agenda y reportes.",
  },
};

export default function CrmLayout({ children }: { children: ReactNode }) {
  return children;
}
