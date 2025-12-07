import { type ReactNode } from "react";
import { formatNumber } from "../utils";

type StatListProps<T extends { count: number }> = {
  title: string;
  items: T[];
  renderLabel: (item: T) => ReactNode;
  emptyLabel: string;
};

export function StatList<T extends { count: number }>({
  title,
  items,
  renderLabel,
  emptyLabel,
}: StatListProps<T>) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-black/60 p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">
            {title}
          </p>
          <h3 className="text-lg font-semibold">Top {title}</h3>
        </div>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">{emptyLabel}</p>
        ) : (
          items.map((item, index) => {
            const maxCount = items[0]?.count ?? 1;
            const percent = Math.round((item.count / maxCount) * 100);

            return (
              <div
                key={index}
                className="rounded-lg border border-zinc-900 bg-black/40 px-3 py-2"
              >
                <div className="flex items-center justify-between text-sm text-zinc-200">
                  {renderLabel(item)}
                  <span className="text-xs text-zinc-400">
                    {formatNumber(item.count)}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-zinc-900">
                  <div
                    className="h-2 rounded-full bg-[#ed9c5a]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
