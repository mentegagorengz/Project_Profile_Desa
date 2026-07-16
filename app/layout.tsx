import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "Kelurahan Manembo-nembo Tengah",
  description: "Website resmi Kelurahan Manembo-nembo Tengah, Kecamatan Matuari, Kota Bitung",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={cn(spaceGrotesk.variable, inter.variable, plexMono.variable)}>
      <body className="font-body text-prussian antialiased">{children}</body>
    </html>
  );
}

