import type { Metadata } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import "../globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Administration — MAISON",
    template: "%s — Admin MAISON",
  },
  description: "Espace d'administration MAISON.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-smoke text-ink">{children}</body>
    </html>
  );
}
