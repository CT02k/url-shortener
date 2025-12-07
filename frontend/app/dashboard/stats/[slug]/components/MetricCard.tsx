import { type ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string;
  helper?: string;
  icon: ReactNode;
};

export function MetricCard({ title, value, helper, icon }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-black/60 p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">
            {title}
          </p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          {helper && <p className="text-xs text-zinc-400 mt-1">{helper}</p>}
        </div>
        <div className="flex size-10 items-center justify-center rounded-full border border-zinc-900 bg-zinc-950">
          {icon}
        </div>
      </div>
    </div>
  );
}
