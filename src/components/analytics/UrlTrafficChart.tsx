/**
 * Traffic visualization component using Recharts area chart
 * Features dual data series for total clicks and unique visitors with gradient fills
 * Handles date formatting and responsive design with theme-aware styling
 */
"use client";

import { motion } from "framer-motion";
import { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UrlTrafficChartProps {
  trafficData?:
    | {
        clicksByDay: Array<{
          date: {
            year: number;
            month: number;
            day: number;
          };
          clicks: number;
          uniqueVisitors: number;
        }>;
        clicksByHour: Array<{
          hour: string;
          clicks: number;
        }>;
      }
    | undefined;
  theme: string;
  loading: boolean;
}

export const UrlTrafficChart: FC<UrlTrafficChartProps> = ({
  trafficData,
  theme,
  loading,
}) => {
  /**
   * Transform API data for chart consumption with formatted dates
   * Converts ISO date strings to readable format for chart labels
   */
  const chartData =
    trafficData?.clicksByDay
      ?.map((item) => ({
        date: new Date(
          item.date.year,
          item.date.month - 1,
          item.date.day
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        clicks: item.clicks,
        uniqueVisitors: item.uniqueVisitors,
      }))
      ?.filter((item) => item.date !== "Invalid Date") || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 h-full ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Traffic Trends
      </h3>

      {loading ? (
        <div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
      ) : (
        <ResponsiveContainer width="100%" height={300} className={"ml-[-20px]"}>
          <AreaChart data={chartData}>
            {/* Gradient definitions for area fills */}
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Chart grid with theme-aware colors */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
            />

            {/* X-axis with date labels */}
            <XAxis
              dataKey="date"
              stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
              fontSize={12}
            />

            {/* Y-axis with numeric values */}
            <YAxis
              stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
              fontSize={12}
            />

            {/* Tooltip with theme-aware styling */}
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                borderRadius: "8px",
                color: theme === "dark" ? "#f3f4f6" : "#111827",
              }}
            />

            {/* Total clicks area with blue gradient */}
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorClicks)"
              strokeWidth={2}
              name="Total Clicks"
            />

            {/* Unique visitors area with green gradient */}
            <Area
              type="monotone"
              dataKey="uniqueVisitors"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorVisitors)"
              strokeWidth={2}
              name="Unique Visitors"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};
