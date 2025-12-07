import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RangeValue } from "../types";
import { rangeOptions } from "../utils";

type StatsHeaderProps = {
  slug: string;
  range: RangeValue;
  onRangeChange: (value: RangeValue) => void;
};

export function StatsHeader({ slug, range, onRangeChange }: StatsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1.5 text-sm text-zinc-200 hover:border-zinc-700 transition cursor-pointer"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <p className="text-sm text-zinc-400">Link stats</p>
          <h1 className="text-2xl font-semibold tracking-tight">{slug}</h1>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {rangeOptions.map((item) => (
          <button
            key={item.value}
            onClick={() => onRangeChange(item.value)}
            className={`rounded-full px-3 py-1.5 text-sm transition cursor-pointer border ${
              range === item.value
                ? "border-[#ed9c5a] bg-[#ed9c5a]/10 text-[#ed9c5a]"
                : "border-zinc-800 bg-black/60 text-zinc-300 hover:border-zinc-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
