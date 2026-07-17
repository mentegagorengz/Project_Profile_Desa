import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Kelurahan Manembo-nembo Tengah",
  description: "Website resmi Kelurahan Manembo-nembo Tengah, Kecamatan Matuari, Kota Bitung",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="font-body text-foreground antialiased">
        <TooltipProvider delay={0}>{children}</TooltipProvider>
      </body>
    </html>
  );
}

