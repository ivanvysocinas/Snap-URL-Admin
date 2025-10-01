"use client";

import { FC } from "react";

interface TimeRangeSelectorProps {
  currentRange: "24h" | "7d" | "30d" | "90d";
  onChange: (range: "24h" | "7d" | "30d" | "90d") => void;
  theme: string;
}

/**
 * Time range selector component for filtering analytics data
 * Provides a segmented control interface for selecting time periods
 */
export const TimeRangeSelector: FC<TimeRangeSelectorProps> = ({
  currentRange,
  onChange,
  theme,
}) => {
  const ranges = [
    { value: "24h" as const, label: "24H" },
    { value: "7d" as const, label: "7D" },
    { value: "30d" as const, label: "30D" },
    { value: "90d" as const, label: "90D" },
  ];

  return (
    <div
      className={`inline-flex rounded-lg border ${
        theme === "dark"
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-white"
      } p-1`}
    >
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            currentRange === range.value
              ? "bg-blue-600 text-white shadow-sm"
              : theme === "dark"
                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};
