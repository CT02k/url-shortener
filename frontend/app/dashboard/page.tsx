"use client";

import { FormEvent, useEffect, useState } from "react";
import { BarChart3, Loader2, Plus, RefreshCw, Trash2, X } from "lucide-react";
import UrlShortener from "../lib/api";
import getToken, { clearToken } from "../lib/getToken";
import { env } from "../lib/config";

type LinkItem = {
  id?: string;
  slug: string;
  redirect?: string;
  target?: string;
};

type Stats = {
  id: string;
  slug: string;
  clicks: string;
  uniqueClicks: string;
  lastClickAt: string;
};

export default function DashboardHome() {
  const [token, setToken] = useState<string | undefined>();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const [createOpen, setCreateOpen] = useState(false);
  const [createInput, setCreateInput] = useState("");
  const [creating, setCreating] = useState(false);

  const [statsOpen, setStatsOpen] = useState(false);
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [statsSlug, setStatsSlug] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | undefined>();

  const makeApi = (overrideToken?: string) =>
    new UrlShortener({
      token: overrideToken ?? token,
      onUnauthorized: async () => {
        await clearToken();
        setToken(undefined);
      },
    });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(undefined);
      const nextToken = await getToken();
      if (!nextToken) {
        setError("Token not found.");
        setLoading(false);
        return;
      }
      if (cancelled) return;
      setToken(nextToken);

      const data = await makeApi(nextToken).listMyLinks();
      if (cancelled) return;

      if (!data || data.message) {
        setError(
          typeof data?.message === "string"
            ? data.message
            : "Failed on loading links.",
        );
      } else {
        const mapped: LinkItem[] = data.list.map(
          (item: { slug: string; redirect: string }) => ({
            slug: item.slug,
            redirect: item.redirect,
          }),
        );
        setLinks(mapped);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shortUrlFor = (slug: string) =>
    new URL(slug, env.NEXT_PUBLIC_FRONTEND_URL).toString();

  const handleCreate = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setCreating(true);
    setError(undefined);

    const { slug, message } = await makeApi().createShortUrl(createInput);

    setCreating(false);

    if (!slug) {
      setError(message ?? "Error trying to create.");
      return;
    }

    const newLink: LinkItem = {
      slug,
      redirect: createInput,
    };

    setLinks((prev) => [newLink, ...prev]);
    setCreateInput("");
    setCreateOpen(false);
  };

  const handleDelete = async (slug: string) => {
    const previous = links;
    setLinks((prev) => prev.filter((item) => item.slug !== slug));
    const res = await makeApi().deleteMyLink(slug);
    if (res?.message) {
      setError(res.message);
      setLinks(previous);
    }
  };

  const handleStats = async (slug: string) => {
    setStatsOpen(true);
    setStatsSlug(slug);
    setStatsLoading(true);
    setStatsError(undefined);
    setStatsData(null);

    const res = await makeApi().getUrlStats(slug);
    if (res?.message && !res.stats) {
      setStatsError(res.message);
    } else {
      setStatsData(res);
    }
    setStatsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">Your shortened links</p>
          <h1 className="text-2xl font-semibold tracking-tight">Manage URLs</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#ed9c5a] px-4 py-2 text-black font-semibold transition hover:opacity-90 cursor-pointer"
          >
            <Plus className="size-4" />
            Create
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-700 transition cursor-pointer"
          >
            <RefreshCw className="size-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-black/60">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-950 text-zinc-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Slug</th>
              <th className="px-4 py-3 text-left font-semibold">Target</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-zinc-400" colSpan={3}>
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin text-[#ed9c5a]" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : links.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-zinc-400" colSpan={3}>
                  No links yet, start by creating one.
                </td>
              </tr>
            ) : (
              links.map((link) => (
                <tr
                  key={link.slug}
                  className="border-t border-zinc-900 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <a
                      href={shortUrlFor(link.slug)}
                      className="text-[#ed9c5a] underline"
                    >
                      {link.slug}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-zinc-200">
                    {link.redirect ?? link.target ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStats(link.slug)}
                        className="flex items-center gap-1 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:border-zinc-700 bg-zinc-900 cursor-pointer"
                      >
                        <BarChart3 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(link.slug)}
                        className="flex items-center gap-1 rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-200 hover:border-red-400/70 bg-red-900 cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Criar novo link</h2>
              <button
                onClick={() => setCreateOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer transition"
              >
                <X />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleCreate}>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-zinc-300">URL de destino</span>
                <input
                  type="url"
                  required
                  value={createInput}
                  onChange={(ev) => setCreateInput(ev.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-[#ed9c5a]"
                  placeholder="https://exemplo.com"
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 rounded-lg bg-[#ed9c5a] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
                >
                  {creating && (
                    <Loader2 className="size-4 animate-spin text-black" />
                  )}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {statsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Stats</p>
                <h3 className="text-lg font-semibold">
                  {statsSlug ? shortUrlFor(statsSlug) : "Link"}
                </h3>
              </div>
              <button
                onClick={() => setStatsOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer transition"
              >
                <X />
              </button>
            </div>
            {statsLoading ? (
              <div className="flex items-center gap-2 text-zinc-300">
                <Loader2 className="size-4 animate-spin text-[#ed9c5a]" />
                Loading stats...
              </div>
            ) : statsError ? (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {statsError}
              </div>
            ) : statsData ? (
              <div className="space-y-2 text-sm text-zinc-200">
                <div className="flex items-center justify-between rounded-lg border border-zinc-900 bg-black/60 px-3 py-2">
                  <span className="text-zinc-400">Clicks</span>
                  <span className="font-semibold">{statsData.clicks}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-900 bg-black/60 px-3 py-2">
                  <span className="text-zinc-400">Unique Clicks</span>
                  <span className="font-semibold">
                    {statsData.uniqueClicks}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-900 bg-black/60 px-3 py-2">
                  <span className="text-zinc-400">Last Click At</span>
                  <span className="font-semibold">
                    {new Date(statsData.lastClickAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-zinc-400">Nothing here, strange.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
