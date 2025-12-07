import { Globe2, LineChart, PanelsTopLeft } from "lucide-react";
import { HighlightRow } from "./HighlightRow";
import { browserIconFor, flagForCountry } from "../utils";
import { BrowserStat, CountryStat } from "../types";

type HighlightsCardProps = {
  topCountry?: CountryStat;
  topBrowser?: BrowserStat;
};

export function HighlightsCard({
  topCountry,
  topBrowser,
}: HighlightsCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-black/60 p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">
            Highlights
          </p>
          <h3 className="text-base font-semibold">Source & Browser</h3>
        </div>
        <PanelsTopLeft className="size-4 text-[#ed9c5a]" />
      </div>
      <div className="mt-3 space-y-3 text-sm">
        <HighlightRow
          label="Top country"
          iconUrl={flagForCountry(topCountry?.country)}
          fallbackIcon={<Globe2 className="size-4 text-zinc-300" />}
          value={topCountry?.country ?? "--"}
          count={topCountry?.count}
        />
        <HighlightRow
          label="Browser"
          iconUrl={browserIconFor(topBrowser?.browser)}
          fallbackIcon={<LineChart className="size-4 text-zinc-300" />}
          value={topBrowser?.browser ?? "--"}
          count={topBrowser?.count}
        />
      </div>
    </div>
  );
}
