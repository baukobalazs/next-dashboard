"use client";

import { useContext } from "react";
import { ThemeContext } from "@/app/ThemeRegistry";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { generateYAxis } from "@/app/lib/utils";

type RevenueItem = {
  month: string;
  revenue: number;
};

export default function RevenueChartClient({
  revenue,
}: {
  revenue: RevenueItem[];
}) {
  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";

  const chartHeight = 350;
  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2
        className={`${lusitana.className} mb-4 text-xl md:text-2xl ${
          isDark ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Recent Revenue
      </h2>

      <div
        className={`rounded-xl p-4 transition-colors ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md p-4 md:gap-4 transition-colors ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className="mb-6 hidden flex-col justify-between text-sm sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p
                key={label}
                className={isDark ? "text-gray-400" : "text-gray-400"}
              >
                {label}
              </p>
            ))}
          </div>

          {revenue.map((month: any) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                  backgroundColor: isDark ? "#3b82f6" : "#93c5fd", // blue-300 light, blue-500 dark
                }}
              ></div>
              <p
                className={`-rotate-90 text-sm sm:rotate-0 ${
                  isDark ? "text-gray-400" : "text-gray-400"
                }`}
              >
                {month.month}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon
            className={`h-5 w-5 transition-colors ${
              isDark ? "text-gray-300" : "text-gray-500"
            }`}
          />
          <h3
            className={`ml-2 text-sm transition-colors ${
              isDark ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Last 12 months
          </h3>
        </div>
      </div>
    </div>
  );
}
