import { Loader2, X } from "lucide-react";
import useDashboardContext from "../hooks/useDashboard";
import { shortUrlFor } from "@/app/lib/utils";

export default function StatsPopup() {
  const {
    statsOpen,
    statsSlug,
    statsData,
    statsLoading,
    statsError,
    setStatsOpen,
  } = useDashboardContext();

  if (!statsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur">
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
              <span className="font-semibold">{statsData.uniqueClicks}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-zinc-900 bg-black/60 px-3 py-2">
              <span className="text-zinc-400">Last Click At</span>
              <span className="font-semibold">
                {statsData.lastClickAt
                  ? new Date(statsData.lastClickAt).toLocaleString()
                  : "Never"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-zinc-400">Nothing here, strange.</p>
        )}
      </div>
    </div>
  );
}
