"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface TrendData {
  date: string;
  users: number;
  urls: number;
  clicks: number;
}

interface GrowthChartProps {
  trends: TrendData[];
  theme: string;
  timeRange: "24h" | "7d" | "30d" | "all";
  loading?: boolean;
}

/**
 * Growth trends chart component with interactive area charts
 * Features responsive design, custom tooltips, and period-specific formatting
 */
export const GrowthChart: FC<GrowthChartProps> = ({
  trends,
  theme,
  timeRange,
  loading = false,
}) => {
  /**
   * Format date for display based on time range
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    switch (timeRange) {
      case "24h":
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "7d":
        return date.toLocaleDateString("en-US", {
          weekday: "short",
        });
      case "30d":
      case "all":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      default:
        return date.toLocaleDateString();
    }
  };

  /**
   * Format number for tooltip display
   */
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat().format(value);
  };

  /**
   * Get period label for display
   */
  const getPeriodLabel = (): string => {
    switch (timeRange) {
      case "24h":
        return "Last 24 Hours";
      case "7d":
        return "Last 7 Days";
      case "30d":
        return "Last 30 Days";
      case "all":
        return "All days";
      default:
        return "Growth Trends";
    }
  };

  if (loading) {
    return <ChartLoadingState theme={theme} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Chart Header */}
      <ChartHeader theme={theme} periodLabel={getPeriodLabel()} />

      {/* Chart Content */}
      {trends.length > 0 ? (
        <>
          <ChartContainer
            trends={trends}
            theme={theme}
            formatDate={formatDate}
            formatNumber={formatNumber}
          />
          <GrowthSummary
            trends={trends}
            theme={theme}
            formatNumber={formatNumber}
          />
        </>
      ) : (
        <EmptyState theme={theme} />
      )}
    </motion.div>
  );
};

/**
 * Loading state with animated skeleton
 */
interface ChartLoadingStateProps {
  theme: string;
}

const ChartLoadingState: FC<ChartLoadingStateProps> = ({ theme }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
  >
    <div className="flex items-center space-x-2 mb-6">
      <TrendingUp className="w-6 h-6 text-green-500" />
      <h3
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Growth Trends
      </h3>
    </div>
    <div className="h-80 flex items-center justify-center">
      <div className="animate-pulse space-y-3 w-full">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </motion.div>
);

/**
 * Chart header with title and period label
 */
interface ChartHeaderProps {
  theme: string;
  periodLabel: string;
}

const ChartHeader: FC<ChartHeaderProps> = ({ theme, periodLabel }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-2">
      <TrendingUp className="w-6 h-6 text-green-500" />
      <h3
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Growth Trends
      </h3>
    </div>
    <span
      className={`text-sm ${
        theme === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      {periodLabel}
    </span>
  </div>
);

/**
 * Main chart container with responsive area chart
 */
interface ChartContainerProps {
  trends: TrendData[];
  theme: string;
  formatDate: (dateString: string) => string;
  formatNumber: (value: number) => string;
}

const ChartContainer: FC<ChartContainerProps> = ({
  trends,
  theme,
  formatDate,
  formatNumber,
}) => {
  /**
   * Custom tooltip component
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg border shadow-lg ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          <p className="font-medium mb-2">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%" className={"ml-[-30px]"}>
        <AreaChart data={trends}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorUrls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
          />

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
            fontSize={12}
          />

          <YAxis
            stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
            fontSize={12}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend />

          <Area
            type="monotone"
            dataKey="users"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorUsers)"
            strokeWidth={2}
            name="Users"
          />

          <Area
            type="monotone"
            dataKey="urls"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorUrls)"
            strokeWidth={2}
            name="URLs"
          />

          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorClicks)"
            strokeWidth={2}
            name="Clicks"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Growth summary section with current metrics
 */
interface GrowthSummaryProps {
  trends: TrendData[];
  theme: string;
  formatNumber: (value: number) => string;
}

const GrowthSummary: FC<GrowthSummaryProps> = ({
  trends,
  theme,
  formatNumber,
}) => (
  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center">
        <div
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {formatNumber(trends[trends.length - 1]?.users || 0)}
        </div>
        <div
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Current Users
        </div>
      </div>

      <div className="text-center">
        <div
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {formatNumber(trends[trends.length - 1]?.urls || 0)}
        </div>
        <div
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Current URLs
        </div>
      </div>

      <div className="text-center">
        <div
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {formatNumber(trends[trends.length - 1]?.clicks || 0)}
        </div>
        <div
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Current Clicks
        </div>
      </div>
    </div>
  </div>
);

/**
 * Empty state when no data is available
 */
interface EmptyStateProps {
  theme: string;
}

const EmptyState: FC<EmptyStateProps> = ({ theme }) => (
  <div className="h-80 flex items-center justify-center">
    <div className="text-center">
      <TrendingUp
        className={`w-16 h-16 mx-auto mb-4 ${
          theme === "dark" ? "text-gray-600" : "text-gray-400"
        }`}
      />
      <h4
        className={`text-lg font-medium mb-2 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        No Growth Data
      </h4>
      <p
        className={`text-sm ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Trend data will appear here as the platform grows
      </p>
    </div>
  </div>
);
