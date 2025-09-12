import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "All in Sport Bonus",
  description: "Spielerisch belohnen — Demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50">{children}</body>
    </html>
  );
}
