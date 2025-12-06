import type { ReactNode } from "react";
import DashboardShell from "../components/DashboardShell";
import { Viewport, Metadata } from "next";

export const viewport: Viewport = {
  themeColor: "#ed9c5a",
};

export const metadata: Metadata = {
  title: "URL Shortener | Dashboard",
  description:
    "Small fullstack URL shortener: Express + Prisma (PostgreSQL) backend and Next.js frontend to create short links, track clicks, and handle auth/account.",
  openGraph: {
    title: "URL Shortener | Dashboard",
    description:
      "Small fullstack URL shortener: Express + Prisma (PostgreSQL) backend and Next.js frontend to create short links, track clicks, and handle auth/account.",
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
