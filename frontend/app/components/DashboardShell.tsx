"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, LogOut, Menu, PanelsTopLeft, X } from "lucide-react";
import UrlShortener from "../lib/api";
import getToken, { clearToken } from "../lib/getToken";
import Image from "next/image";

interface DashboardShellProps {
  children: ReactNode;
}

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: PanelsTopLeft },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition duration-150 ${
        active
          ? "bg-[#ffebda]/10 text-[#ed9c5a]"
          : "text-zinc-400 hover:text-white hover:border-zinc-800 hover:bg-white/5"
      }`}
    >
      <Icon className="size-4" />
      <span className="font-semibold tracking-tight">{item.label}</span>
    </Link>
  );
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loadingSession, setLoadingSession] = useState(true);
  const [profile, setProfile] = useState<{ username?: string } | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function ensureAuth() {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      const api = new UrlShortener({
        token,
        onUnauthorized: async () => {
          await clearToken();
          if (!cancelled) router.replace("/login");
        },
      });

      const me = await api.getProfile();
      if (cancelled) return;

      if (!me?.id) {
        await clearToken();
        router.replace("/login");
        return;
      }

      setProfile(me);
      setLoadingSession(false);
    }

    ensureAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = async () => {
    await clearToken();
    router.replace("/login");
  };

  useEffect(() => {
    const func = async () => setNavOpen(false);
    func();
  }, [pathname]);

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-300">
          <Loader2 className="size-24 animate-spin text-[#ed9c5a]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <button
        type="button"
        onClick={() => setNavOpen((open) => !open)}
        className="lg:hidden fixed left-4 top-4 z-30 flex items-center gap-2 rounded-full border border-zinc-900 bg-black/80 px-4 py-2 text-sm text-zinc-200 shadow-lg backdrop-blur"
      >
        {navOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        Menu
      </button>
      <div
        className={`fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          navOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setNavOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-black/95 border-r border-zinc-900 flex flex-col justify-between px-4 py-6 overflow-hidden transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="relative">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="URL Shortener Logo"
              className="w-48 h-auto"
              width={256}
              height={256}
            />
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                }
              />
            ))}
          </nav>
        </div>
        <div className="relative mt-8 border-t border-zinc-900 pt-6">
          <div className="flex items-center gap-3 pb-3">
            <div className="size-10 rounded-full bg-[#ed9c5a] text-black font-semibold flex items-center justify-center">
              {(profile?.username?.[0] ?? "U").toUpperCase()}
            </div>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">
                Logged as
              </p>
              <p className="font-semibold">{profile?.username ?? "User"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-900 text-sm text-zinc-200 hover:opacity-80 transition cursor-pointer"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 relative overflow-hidden lg:ml-0">
        <div className="relative">
          <main className="px-6 py-16 lg:px-10 lg:py-8 h-screen overflow-y-scroll">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
