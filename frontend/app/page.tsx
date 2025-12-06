"use client";

import { FormEvent, useEffect, useState } from "react";
import UrlShortener from "./lib/api";
import getToken, { clearToken } from "./lib/getToken";
import { env } from "./lib/config";
import AuthButtons from "./components/AuthButtons";

export default function Home() {
  const [token, setToken] = useState<string>();
  const [result, setResult] = useState<string>();
  const [error, setError] = useState<string>();

  const api = new UrlShortener({
    token,
    onUnauthorized: async () => {
      await clearToken();
      setToken(undefined);
    },
  });

  useEffect(() => {
    async function getAndSetToken() {
      const nextToken = await getToken();
      setToken(nextToken);
    }

    getAndSetToken();
  }, []);

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError(undefined);
    setResult(undefined);

    const redirect = (document.getElementById("redirect") as HTMLInputElement)
      ?.value;

    const { slug, message } = await api.createShortUrl(redirect);

    if (slug) {
      const url = new URL(slug, env.NEXT_PUBLIC_FRONTEND_URL).toString();
      setResult(url);
      return;
    }

    setError(message ?? "Unknown error, try again later.");
  }

  return (
    <main className="w-full h-screen bg-[#010101] flex flex-col items-center justify-center contain-content">
      <div className="absolute bg-[#ed9c5a]/10 size-128 rounded-full blur-[10rem] -bottom-1/6"></div>
      <div className="flex w-full justify-end absolute top-0 p-8 gap-2">
        <AuthButtons />
      </div>
      <div className="flex flex-col items-center w-full z-10">
        <h1 className="text-6xl font-semibold bg-linear-to-t from-[#ed9c5a] to-white text-transparent bg-clip-text">
          Create short URLs
        </h1>
        <p className="text-2xl">
          URL shortener allows to create a shortened link making it easy to
          share.
        </p>
        <form className="flex w-1/4 mt-8" onSubmit={handleSubmit}>
          <input
            type="text"
            id="redirect"
            className="rounded-lg bg-zinc-950/75 backdrop-blur-lg border border-zinc-900 w-full py-2 px-2 outline-none focus:border-[#ed9c5a]"
            placeholder="https://url.com"
            required
          />
          <input
            type="submit"
            value="Shorten"
            className="bg-[#ed9c5a] rounded-lg h-full px-4 ml-2 transition hover:opacity-90 cursor-pointer"
          />
        </form>
        {error && (
          <div className="bg-red-500/25 border border-red-500 p-1.5 text-sm rounded-lg mt-4">
            {error}
          </div>
        )}
        {result && (
          <div className="bg-[#ed9c5a]/15 border border-[#ed9c5a] p-1.5 text-sm rounded-lg mt-4">
            Successfully shorten the URL,{" "}
            <a className="text-[#ed9c5a] underline" href={result}>
              {result}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
