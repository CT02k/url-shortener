import { ChartSeries, RangeValue, StatsResponse } from "./types";

export const rangeOptions: { label: string; value: RangeValue }[] = [
  { label: "1h", value: "hour" },
  { label: "24h", value: "day" },
  { label: "7d", value: "week" },
  { label: "30d", value: "month" },
  { label: "All", value: "all" },
];

const browserIconSlug: Record<string, string> = {
  Chrome: "googlechrome",
  "Mobile Chrome": "googlechrome",
  Firefox: "firefoxbrowser",
  "Mobile Firefox": "firefoxbrowser",
  Safari: "safari",
  "Mobile Safari": "safari",
  Edge: "microsoftedge",
  Opera: "opera",
  Brave: "brave",
  Vivaldi: "vivaldi",
};

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export const flagForCountry = (country?: string) =>
  country ? `https://flagcdn.com/${country.toLowerCase()}.svg` : null;

export const browserIconFor = (browser?: string) => {
  if (!browser) return null;
  const slug = browserIconSlug[browser] ?? null;
  return slug ? `https://cdn.simpleicons.org/${slug}/f5f5f5` : null;
};

export const buildSeries = (stats?: StatsResponse | null): ChartSeries => {
  const clicks = stats?.range?.clicks ?? stats?.total.clicks ?? 0;
  const uniques =
    stats?.range?.uniqueVisitors ?? stats?.total.uniqueClicks ?? 0;
  const steps = 14;

  const buildCurve = (value: number) =>
    Array.from({ length: steps }, (_, index) => {
      const t = index / (steps - 1);
      const eased = Math.sin(t * Math.PI);
      const lift = 0.18 + 0.82 * eased;
      return Math.round(Math.max(value * lift, 0));
    });

  return { clicks: buildCurve(clicks), uniques: buildCurve(uniques) };
};

export const buildTimeWindow = (
  stats: StatsResponse | null,
  range: RangeValue,
) => {
  if (stats?.range?.from && stats?.range?.to) {
    return `${new Date(stats.range.from).toLocaleDateString()} - ${new Date(
      stats.range.to,
    ).toLocaleDateString()}`;
  }

  if (range === "all") return "All time";
  return "Most recent selected range";
};
