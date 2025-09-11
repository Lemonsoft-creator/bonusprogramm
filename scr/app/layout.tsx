import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "All in Sport Bonus",
  description: "Demo-Mockup – Duolingo Style",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}