export type RangeValue = "hour" | "day" | "week" | "month" | "all";

export type StatsResponse = {
  slug: string;
  total: {
    clicks: number;
    uniqueClicks: number;
    lastClickAt: string | null;
  };
  range: {
    from: string | null;
    to: string | null;
    clicks: number;
    uniqueVisitors: number;
    topReferrers: ReferrerStat[];
    topBrowsers: BrowserStat[];
    topCountries: CountryStat[];
  } | null;
  message?: string;
};

export type ChartSeries = { clicks: number[]; uniques: number[] };

export type ReferrerStat = { referrer: string; count: number };
export type BrowserStat = { browser: string; count: number };
export type CountryStat = { country: string; count: number };
