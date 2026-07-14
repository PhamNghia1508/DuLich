import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LocaLink — Find Your Perfect Local Guide in Vietnam",
  description:
    "Connect with verified local guides in Ho Chi Minh City and across Vietnam. Personalized matching by language, interests, travel style, and budget.",
  keywords:
    "local guide Vietnam, Ho Chi Minh City tour, personalized guide matching, verified local guides, travel experiences Vietnam",
  openGraph: {
    title: "LocaLink — Explore Vietnam with someone who truly gets you",
    description:
      "Find a verified local guide who matches your language, interests, pace, and travel style.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-[#FAFAF7] text-[#1A1A1A]`}
      >
        {children}
      </body>
    </html>
  );
}
