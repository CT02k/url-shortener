"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UrlShortener from "../lib/api";
import getToken, { clearToken, setToken } from "../lib/getToken";

export default function RegisterPage() {
  const router = useRouter();
  const api = new UrlShortener({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function redirectIfLogged() {
      const existingToken = await getToken();
      if (!existingToken) return;

      const sessionApi = new UrlShortener({
        token: existingToken,
        onUnauthorized: async () => {
          await clearToken();
          if (!cancelled) setError(undefined);
        },
      });

      const profile = await sessionApi.getProfile();
      if (profile?.id && !cancelled) {
        router.replace("/dashboard");
      }
    }

    redirectIfLogged();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError(undefined);
    setLoading(true);

    const { token, message } = await api.registerAccount({
      data: { username, password },
    });

    setLoading(false);

    if (!token) {
      setError(message ?? "Could not register, try again.");
      return;
    }

    await setToken(token);
    router.push("/dashboard");
  }

  return (
    <main className="w-full h-screen bg-[#010101] flex items-center justify-center contain-content">
      <div className="absolute bg-[#ed9c5a]/10 size-128 rounded-full blur-[10rem] -bottom-1/6"></div>
      <div className="w-full max-w-md mx-auto rounded-2xl border border-zinc-900 bg-zinc-950/75 backdrop-blur-lg p-8 relative z-10 shadow-2xl shadow-[#ed9c5a]/10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold bg-linear-to-t from-[#ed9c5a] to-white text-transparent bg-clip-text">
            Create account
          </h1>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-300">Username</span>
            <input
              type="text"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2 outline-none focus:border-[#ed9c5a]"
              placeholder="Username"
              minLength={3}
              maxLength={32}
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2 outline-none focus:border-[#ed9c5a]"
              placeholder="********"
              minLength={6}
              maxLength={128}
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ed9c5a] rounded-lg py-2 font-medium transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
          {error && (
            <div className="bg-red-500/15 border border-red-500 text-sm text-red-200 p-2 rounded-lg">
              {error}
            </div>
          )}
        </form>
        <p className="text-sm text-zinc-400 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#ed9c5a] font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
