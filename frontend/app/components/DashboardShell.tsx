"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, LogOut, PanelsTopLeft } from "lucide-react";
import UrlShortener from "../lib/api";
import getToken, { clearToken } from "../lib/getToken";

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
          ? "bg-zinc-900 text-[#ed9c5a]"
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
      <aside className="w-64 bg-black/95 border-r border-zinc-900 flex flex-col justify-between px-4 py-6 relative overflow-hidden">
        <div className="relative">
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
          <div className="flex items-center gap-3 px-3 pb-3">
            <div className="size-10 rounded-full bg-linear-to-br from-[#ed9c5a] to-amber-300 text-black font-semibold flex items-center justify-center">
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
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-900 text-sm text-zinc-200 hover:border-red-400 hover:text-red-100 transition"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 relative overflow-hidden">
        <div className="relative">
          <main className="px-10 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
