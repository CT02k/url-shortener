import Image from "next/image";
import { type ReactNode } from "react";
import { formatNumber } from "../utils";

type HighlightRowProps = {
  label: string;
  value: string;
  count?: number;
  iconUrl: string | null;
  fallbackIcon: ReactNode;
};

export function HighlightRow({
  label,
  value,
  count,
  iconUrl,
  fallbackIcon,
}: HighlightRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-900 bg-black/40 px-3 py-2">
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center justify-center rounded-lg ${iconUrl ?? "bg-zinc-900 border border-zinc-800 size-8"} overflow-hidden`}
        >
          {iconUrl ? (
            <Image
              unoptimized
              src={iconUrl}
              alt={value}
              height={32}
              width={32}
              className="size-6 object-cover"
            />
          ) : (
            fallbackIcon
          )}
        </div>
        <div className="leading-tight">
          <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">
            {label}
          </p>
          <p className="text-sm font-semibold">{value}</p>
        </div>
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-zinc-400">
          {formatNumber(count)} clicks
        </span>
      )}
    </div>
  );
}
