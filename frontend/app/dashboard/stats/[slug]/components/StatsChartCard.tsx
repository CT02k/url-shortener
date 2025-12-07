import { Loader2 } from "lucide-react";
import { ChartSeries } from "../types";
import { StatsChart } from "./StatsChart";

type StatsChartCardProps = {
  series: ChartSeries;
  loading: boolean;
  timeWindow: string;
};

export function StatsChartCard({
  series,
  loading,
  timeWindow,
}: StatsChartCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-black/60 p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">
            Graph
          </p>
          <h3 className="text-lg font-semibold">Click activity</h3>
        </div>
        <span className="text-xs text-zinc-400">{timeWindow}</span>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-zinc-900 bg-linear-to-b from-zinc-950 to-black p-4">
        {loading ? (
          <div className="flex h-60 items-center justify-center gap-2 text-zinc-300">
            <Loader2 className="size-5 animate-spin text-[#ed9c5a]" />
          </div>
        ) : (
          <StatsChart series={series} />
        )}
      </div>
    </div>
  );
}
