import { Clock3, MousePointer2, Sparkles } from "lucide-react";
import { formatNumber } from "../utils";
import { BrowserStat, CountryStat, StatsResponse } from "../types";
import { MetricCard } from "./MetricCard";
import { HighlightsCard } from "./HighlightsCard";

type StatsOverviewProps = {
  stats: StatsResponse | null;
  timeWindow: string;
  topCountry?: CountryStat;
  topBrowser?: BrowserStat;
};

export function StatsOverview({
  stats,
  timeWindow,
  topCountry,
  topBrowser,
}: StatsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Clicks"
        icon={<MousePointer2 className="size-4 text-[#ed9c5a]" />}
        value={
          stats
            ? formatNumber(stats.range?.clicks ?? stats.total.clicks)
            : "--"
        }
        helper={stats ? `${formatNumber(stats.total.clicks)} lifetime` : ""}
      />
      <MetricCard
        title="Unique visitors"
        icon={<Sparkles className="size-4 text-[#ed9c5a]" />}
        value={
          stats
            ? formatNumber(
                stats.range?.uniqueVisitors ?? stats.total.uniqueClicks,
              )
            : "--"
        }
        helper={
          stats ? `${formatNumber(stats.total.uniqueClicks)} lifetime` : ""
        }
      />
      <MetricCard
        title="Last Click"
        icon={<Clock3 className="size-4 text-[#ed9c5a]" />}
        value={
          stats?.total.lastClickAt
            ? new Date(stats.total.lastClickAt).toLocaleTimeString()
            : "Never"
        }
        helper={timeWindow}
      />
      <HighlightsCard topCountry={topCountry} topBrowser={topBrowser} />
    </div>
  );
}
