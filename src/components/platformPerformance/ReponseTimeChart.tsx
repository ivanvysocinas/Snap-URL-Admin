"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import { Clock } from "lucide-react";

interface ResponseTimeData {
  time: string;
  avgTime: number;
  p95Time: number;
  p99Time: number;
}

interface ResponseTimeChartProps {
  data: ResponseTimeData[];
  theme: string;
  timeRange: "1h" | "6h" | "24h" | "7d";
  loading?: boolean;
}

/**
 * Response time chart component with percentile tracking
 * Displays API response time metrics with average, 95th, and 99th percentiles
 */
export const ResponseTimeChart: FC<ResponseTimeChartProps> = ({
  data,
  theme,
  timeRange,
  loading = false,
}) => {
  /**
   * Format time for display based on time range
   */
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);

    switch (timeRange) {
      case "1h":
      case "6h":
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "24h":
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "7d":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      default:
        return date.toLocaleTimeString();
    }
  };

  /**
   * Get time range label for display
   */
  const getPeriodLabel = (): string => {
    switch (timeRange) {
      case "1h":
        return "Last Hour";
      case "6h":
        return "Last 6 Hours";
      case "24h":
        return "Last 24 Hours";
      case "7d":
        return "Last 7 Days";
      default:
        return "Response Time Trends";
    }
  };

  /**
   * Calculate average response time
   */
  const getAverageResponseTime = (): number => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item.avgTime, 0);
    return Math.round(sum / data.length);
  };

  /**
   * Get performance status based on average response time
   */
  const getPerformanceStatus = (): { text: string; color: string } => {
    const avg = getAverageResponseTime();
    if (avg < 100) return { text: "Excellent", color: "text-green-500" };
    if (avg < 200) return { text: "Good", color: "text-yellow-500" };
    return { text: "Needs Attention", color: "text-red-500" };
  };

  if (loading) {
    return <LoadingState theme={theme} />;
  }

  const performanceStatus = getPerformanceStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Header */}
      <ChartHeader
        theme={theme}
        periodLabel={getPeriodLabel()}
        performanceStatus={performanceStatus}
        averageResponseTime={getAverageResponseTime()}
      />

      {/* Chart Content */}
      {data.length > 0 ? (
        <>
          <ChartContainer data={data} theme={theme} formatTime={formatTime} />
          <ResponseTimeInsights
            data={data}
            theme={theme}
            performanceStatus={performanceStatus}
          />
        </>
      ) : (
        <EmptyState theme={theme} />
      )}
    </motion.div>
  );
};

/**
 * Loading skeleton state
 */
interface LoadingStateProps {
  theme: string;
}

const LoadingState: FC<LoadingStateProps> = ({ theme }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
  >
    <div className="flex items-center space-x-2 mb-6">
      <Clock className="w-6 h-6 text-blue-500" />
      <h3
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Response Time Trends
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
 * Chart header with performance status
 */
interface ChartHeaderProps {
  theme: string;
  periodLabel: string;
  performanceStatus: { text: string; color: string };
  averageResponseTime: number;
}

const ChartHeader: FC<ChartHeaderProps> = ({
  theme,
  periodLabel,
  performanceStatus,
  averageResponseTime,
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-2">
      <Clock className="w-6 h-6 text-blue-500" />
      <h3
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Response Time Trends
      </h3>
    </div>
    <div className="text-right">
      <div
        className={`text-sm ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {periodLabel}
      </div>
      <div className="flex items-center space-x-2 mt-1">
        <span className={`text-xs font-medium ${performanceStatus.color}`}>
          {performanceStatus.text}
        </span>
        <span
          className={`text-xs ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Avg: {averageResponseTime}ms
        </span>
      </div>
    </div>
  </div>
);

/**
 * Chart container with composed chart
 */
interface ChartContainerProps {
  data: ResponseTimeData[];
  theme: string;
  formatTime: (timeString: string) => string;
}

const ChartContainer: FC<ChartContainerProps> = ({
  data,
  theme,
  formatTime,
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
          <p className="font-medium mb-2">{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {Math.round(entry.value)}ms
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%" className={"ml-[-20px]"}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorAvgTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
          />

          <XAxis
            dataKey="time"
            tickFormatter={formatTime}
            stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
            fontSize={12}
          />

          <YAxis
            stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            domain={["auto", "auto"]}
            tickFormatter={(value) => `${value}ms`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend />

          {/* Average response time area */}
          <Area
            type="monotone"
            dataKey="avgTime"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorAvgTime)"
            strokeWidth={2}
            name="Average"
          />

          {/* 95th percentile line */}
          <Line
            type="monotone"
            dataKey="p95Time"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="95th Percentile"
          />

          {/* 99th percentile line */}
          <Line
            type="monotone"
            dataKey="p99Time"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="2 2"
            dot={false}
            name="99th Percentile"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Response time insights grid
 */
interface ResponseTimeInsightsProps {
  data: ResponseTimeData[];
  theme: string;
  performanceStatus: { text: string; color: string };
}

const ResponseTimeInsights: FC<ResponseTimeInsightsProps> = ({
  data,
  theme,
  performanceStatus,
}) => {
  const getAverageResponseTime = (): number => {
    const sum = data.reduce((acc, item) => acc + item.avgTime, 0);
    return Math.round(sum / data.length);
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div>
          <div
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {getAverageResponseTime()}ms
          </div>
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Average
          </div>
        </div>

        <div>
          <div
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {data.length > 0
              ? Math.round(data[data.length - 1]?.p95Time ?? 0)
              : 0}
            ms
          </div>
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            95th Percentile
          </div>
        </div>

        <div>
          <div
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {data.length > 0
              ? Math.round(data[data.length - 1]?.p99Time ?? 0)
              : 0}
            ms
          </div>
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            99th Percentile
          </div>
        </div>

        <div>
          <div className={`text-lg font-semibold ${performanceStatus.color}`}>
            {performanceStatus.text}
          </div>
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Performance
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Empty state when no data available
 */
interface EmptyStateProps {
  theme: string;
}

const EmptyState: FC<EmptyStateProps> = ({ theme }) => (
  <div className="h-80 flex items-center justify-center">
    <div className="text-center">
      <Clock
        className={`w-16 h-16 mx-auto mb-4 ${
          theme === "dark" ? "text-gray-600" : "text-gray-400"
        }`}
      />
      <h4
        className={`text-lg font-medium mb-2 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        No Response Time Data
      </h4>
      <p
        className={`text-sm ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Response time metrics will appear here as requests are processed
      </p>
    </div>
  </div>
);
