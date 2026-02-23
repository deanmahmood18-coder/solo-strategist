import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import "./globals.css";

import { Shell } from "@/components/shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "The Solo Strategist",
  description:
    "Independent capital allocation research through secular thematics and value discipline.",
  metadataBase: new URL("https://the-solo-strategist.pages.dev")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
