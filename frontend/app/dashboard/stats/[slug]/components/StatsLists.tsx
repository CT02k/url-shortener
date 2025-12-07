import Image from "next/image";
import { Globe2, LineChart } from "lucide-react";
import { browserIconFor, flagForCountry } from "../utils";
import { StatsResponse } from "../types";
import { StatList } from "./StatList";

type StatsListsProps = {
  stats: StatsResponse | null;
};

export function StatsLists({ stats }: StatsListsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StatList
        title="Referrers"
        items={stats?.range?.topReferrers ?? []}
        emptyLabel="No referrer data."
        renderLabel={(item) => (
          <div className="flex items-center gap-2">
            <span className="truncate">{item.referrer}</span>
          </div>
        )}
      />
      <StatList
        title="Browsers"
        items={stats?.range?.topBrowsers ?? []}
        emptyLabel="No browser data."
        renderLabel={(item) => (
          <div className="flex items-center gap-2">
            {browserIconFor(item.browser) ? (
              <Image
                unoptimized
                src={browserIconFor(item.browser) as string}
                alt={item.browser}
                width={32}
                height={32}
                className="size-4"
              />
            ) : (
              <LineChart className="size-4 text-zinc-400" />
            )}
            <span className="truncate">{item.browser}</span>
          </div>
        )}
      />
      <StatList
        title="Countries"
        items={stats?.range?.topCountries ?? []}
        emptyLabel="No country data."
        renderLabel={(item) => (
          <div className="flex items-center gap-2">
            {flagForCountry(item.country) ? (
              <Image
                unoptimized
                src={flagForCountry(item.country) as string}
                alt={item.country}
                height={32}
                width={32}
                className=" rounded-sm border border-zinc-800"
              />
            ) : (
              <Globe2 className="size-4 text-zinc-400" />
            )}
            <span className="truncate uppercase">{item.country}</span>
          </div>
        )}
      />
    </div>
  );
}
