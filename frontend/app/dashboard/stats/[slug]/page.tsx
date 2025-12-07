"use client";

import { useParams } from "next/navigation";
import { StatsChartCard } from "./components/StatsChartCard";
import { StatsHeader } from "./components/StatsHeader";
import { StatsLists } from "./components/StatsLists";
import { StatsOverview } from "./components/StatsOverview";
import { useStats } from "./hooks/useStats";

export default function StatsPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    range,
    setRange,
    loading,
    error,
    stats,
    series,
    topCountry,
    topBrowser,
    timeWindow,
  } = useStats(slug);

  return (
    <div className="space-y-6">
      <StatsHeader slug={slug} range={range} onRangeChange={setRange} />

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <StatsOverview
        stats={stats}
        timeWindow={timeWindow}
        topCountry={topCountry}
        topBrowser={topBrowser}
      />

      <StatsChartCard
        series={series}
        loading={loading}
        timeWindow={timeWindow}
      />

      <StatsLists stats={stats} />
    </div>
  );
}
