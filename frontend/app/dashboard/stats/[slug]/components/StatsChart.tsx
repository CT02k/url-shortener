"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "../utils";
import { ChartSeries } from "../types";

type StatsChartProps = {
  series: ChartSeries;
};

export function StatsChart({ series }: StatsChartProps) {
  const chartData = useMemo(
    () =>
      Array.from(
        { length: Math.max(series.clicks.length, series.uniques.length) },
        (_, index) => ({
          label: `${index + 1}`,
          clicks: series.clicks[index] ?? 0,
          uniques: series.uniques[index] ?? 0,
        }),
      ),
    [series.clicks, series.uniques],
  );

  return (
    <div className="relative h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 28, left: 0, right: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="clicksGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ed9c5a" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ed9c5a" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="uniqueGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7c8cff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#7c8cff" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#1f1f1f" strokeDasharray="4 4" />
          <XAxis dataKey="label" hide />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            tickFormatter={(value: number) => formatNumber(value)}
            width={64}
          />
          <Tooltip
            cursor={{ stroke: "#27272a" }}
            contentStyle={{
              background: "#0b0b0b",
              border: "1px solid #27272a",
              borderRadius: 12,
              color: "#e4e4e7",
            }}
            labelStyle={{ color: "#a1a1aa" }}
            formatter={(value, name) => [
              formatNumber(value as number),
              name as string,
            ]}
          />
          <Legend
            iconType="circle"
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: 12 }}
            formatter={(value: string) => (
              <span style={{ color: "#e4e4e7", fontSize: 12 }}>{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            name="Clicks"
            stroke="#ed9c5a"
            fillOpacity={1}
            fill="url(#clicksGradient)"
            strokeWidth={2.5}
            activeDot={{ r: 4, stroke: "#ed9c5a", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="uniques"
            name="Uniques"
            stroke="#8aa0ff"
            fillOpacity={1}
            fill="url(#uniqueGradient)"
            strokeWidth={2}
            activeDot={{ r: 4, stroke: "#8aa0ff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
