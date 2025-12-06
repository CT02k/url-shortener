"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UrlShortener from "../lib/api";
import getToken, { clearToken } from "../lib/getToken";

interface AuthButtonsProps {
  className?: string;
}

export default function AuthButtons({ className = "" }: AuthButtonsProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const token = await getToken();
      if (!token) {
        if (!cancelled) setIsAuthenticated(false);
        return;
      }

      const api = new UrlShortener({
        token,
        onUnauthorized: async () => {
          await clearToken();
          if (!cancelled) setIsAuthenticated(false);
        },
      });

      const profile = await api.getProfile();
      if (!cancelled) {
        setIsAuthenticated(Boolean(profile?.id));
      }
    }

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await clearToken();
    setIsAuthenticated(false);
    router.refresh();
  };

  if (isAuthenticated) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <button
          onClick={handleLogout}
          className="bg-zinc-900 border border-zinc-800 rounded-full px-6 py-2 transition hover:border-red-400 hover:text-red-200"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <Link
        href="/login"
        className="bg-[#ed9c5a]/10 border border-[#ed9c5a] rounded-full px-6 py-2 transition hover:opacity-90 cursor-pointer"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="bg-[#ed9c5a] rounded-full px-6 py-2 transition hover:opacity-90 cursor-pointer"
      >
        Register
      </Link>
    </div>
  );
}
