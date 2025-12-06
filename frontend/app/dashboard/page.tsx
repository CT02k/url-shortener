"use client";

import {
  BarChart3,
  Check,
  Copy,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import CreatePopup from "./components/CreatePopup";
import StatsPopup from "./components/StatsPopup";
import { DashboardProvider, useDashboardContext } from "./hooks/useDashboard";
import { useState } from "react";

export default function DashboardHome() {
  return (
    <DashboardProvider>
      <DashboardContent />
      <CreatePopup />
      <StatsPopup />
    </DashboardProvider>
  );
}

function DashboardContent() {
  const [copied, setCopied] = useState<boolean>(false);

  const {
    links,
    loading,
    error,
    shortUrlFor,
    setCreateOpen,
    handleDelete,
    handleStats,
  } = useDashboardContext();

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

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
              links.map((link) => {
                const url = shortUrlFor(link.slug);
                return (
                  <tr
                    key={link.slug}
                    className="border-t border-zinc-900 hover:bg-white/5"
                  >
                    <td className="px-4 py-3 flex items-center gap-2">
                      <a
                        href={url}
                        className="text-[#ed9c5a] underline text-xs md:text-base"
                      >
                        {url}
                      </a>
                      <span
                        className="cursor-pointer hover:opacity-80 transition"
                        onClick={() => handleCopy(url)}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-200 text-xs md:text-base">
                      {link.redirect}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col md:flex-row gap-2">
                        <button
                          onClick={() => handleStats(link.slug)}
                          className="flex items-center justify-center rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:border-zinc-700 bg-zinc-900 cursor-pointer"
                        >
                          <BarChart3 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(link.slug)}
                          className="flex items-center justify-center rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-200 hover:border-red-400/70 bg-red-900 cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
