"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UrlShortener from "@/app/lib/api";
import getToken, { clearToken } from "@/app/lib/getToken";
import { buildSeries, buildTimeWindow } from "../utils";
import {
  BrowserStat,
  ChartSeries,
  CountryStat,
  RangeValue,
  StatsResponse,
} from "../types";

type UseStatsResult = {
  range: RangeValue;
  setRange: (value: RangeValue) => void;
  loading: boolean;
  error: string | null;
  stats: StatsResponse | null;
  series: ChartSeries;
  topCountry: CountryStat | undefined;
  topBrowser: BrowserStat | undefined;
  timeWindow: string;
};

export function useStats(slug: string): UseStatsResult {
  const router = useRouter();
  const [range, setRange] = useState<RangeValue>("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

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

      const selectedRange = range === "all" ? undefined : range;
      const res = await api.getUrlStats(
        slug,
        selectedRange ? { range: selectedRange } : undefined,
      );

      if (cancelled) return;

      if (!res || res.message) {
        setError(res?.message ?? "Failed to load stats.");
        setStats(null);
      } else {
        setStats(res);
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [range, router, slug]);

  const series = useMemo(() => buildSeries(stats), [stats]);
  const timeWindow = useMemo(
    () => buildTimeWindow(stats, range),
    [range, stats],
  );

  const topCountry = stats?.range?.topCountries?.[0];
  const topBrowser = stats?.range?.topBrowsers?.[0];

  return {
    range,
    setRange,
    loading,
    error,
    stats,
    series,
    topCountry,
    topBrowser,
    timeWindow,
  };
}
