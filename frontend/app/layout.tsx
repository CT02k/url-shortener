import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { env } from "./lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ed9c5a",
};

export const metadata: Metadata = {
  title: "URL Shortener",
  description:
    "Small fullstack URL shortener: Express + Prisma (PostgreSQL) backend and Next.js frontend to create short links, track clicks, and handle auth/account.",
  openGraph: {
    title: "URL Shortener",
    description:
      "Small fullstack URL shortener: Express + Prisma (PostgreSQL) backend and Next.js frontend to create short links, track clicks, and handle auth/account.",
    images: [`${new URL("/og.png", env.NEXT_PUBLIC_FRONTEND_URL)}`],
  },
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
