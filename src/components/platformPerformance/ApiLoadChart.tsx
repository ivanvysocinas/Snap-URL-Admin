"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { Activity, TrendingUp, AlertTriangle } from "lucide-react";

interface ApiLoadData {
  time: string;
  requests: number;
  errors: number;
}

interface ApiLoadChartProps {
  data: ApiLoadData[];
  current: number;
  peak: number;
  theme: string;
  loading?: boolean;
}

/**
 * API load chart component with real-time metrics and error tracking
 * Always uses mock data for demo purposes with realistic patterns
 */
export const ApiLoadChart: FC<ApiLoadChartProps> = ({
  theme,
  loading = false,
}) => {
  /**
   * Generate realistic mock data for demo
   */
  const generateMockData = (): ApiLoadData[] => {
    const mockData: ApiLoadData[] = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseRequests = Math.floor(Math.random() * 100) + 50;
      const requests = Math.floor(baseRequests + Math.sin(i * 0.3) * 40);
      const errors = Math.floor(requests * (Math.random() * 0.08 + 0.01));

      mockData.push({
        time: time.toISOString(),
        requests: Math.max(10, requests),
        errors: Math.max(0, errors),
      });
    }

    return mockData;
  };

  const chartData = generateMockData();
  const currentLoad = Math.floor(Math.random() * 120) + 80;
  const peakLoad = Math.floor(Math.random() * 180) + 150;

  /**
   * Format time for display
   */
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Format number with K/M suffixes
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  /**
   * Get load status based on current vs peak
   */
  const getLoadStatus = (): { text: string; color: string; level: number } => {
    const percentage = peakLoad > 0 ? (currentLoad / peakLoad) * 100 : 0;

    if (percentage < 50) {
      return { text: "Low", color: "text-green-500", level: percentage };
    }
    if (percentage < 80) {
      return { text: "Medium", color: "text-yellow-500", level: percentage };
    }
    return { text: "High", color: "text-red-500", level: percentage };
  };

  /**
   * Calculate mock error rate
   */
  const getErrorRate = (): number => {
    return Math.random() * 2;
  };

  if (loading) {
    return <LoadingState theme={theme} />;
  }

  const loadStatus = getLoadStatus();
  const errorRate = getErrorRate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Header */}
      <ChartHeader theme={theme} loadStatus={loadStatus} />

      {/* Load Summary */}
      <LoadSummary
        theme={theme}
        currentLoad={currentLoad}
        peakLoad={peakLoad}
        errorRate={errorRate}
        formatNumber={formatNumber}
      />

      {/* Chart */}
      <ChartContainer
        chartData={chartData}
        theme={theme}
        formatTime={formatTime}
        formatNumber={formatNumber}
      />

      {/* Load Status Bar */}
      <LoadStatusBar theme={theme} loadStatus={loadStatus} />
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
      <Activity className="w-6 h-6 text-purple-500" />
      <h3
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        API Load
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
 * Chart header with load status
 */
interface ChartHeaderProps {
  theme: string;
  loadStatus: { text: string; color: string; level: number };
}

const ChartHeader: FC<ChartHeaderProps> = ({ theme, loadStatus }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-2">
      <Activity className="w-6 h-6 text-purple-500" />
      <h3
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        API Load
      </h3>
    </div>
    <div className="text-right">
      <div className={`text-sm font-medium ${loadStatus.color}`}>
        {loadStatus.text} Load
      </div>
      <div
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {Math.round(loadStatus.level)}% of peak
      </div>
    </div>
  </div>
);

/**
 * Load summary metrics grid
 */
interface LoadSummaryProps {
  theme: string;
  currentLoad: number;
  peakLoad: number;
  errorRate: number;
  formatNumber: (num: number) => string;
}

const LoadSummary: FC<LoadSummaryProps> = ({
  theme,
  currentLoad,
  peakLoad,
  errorRate,
  formatNumber,
}) => (
  <div className="grid grid-cols-3 gap-4 mb-6 p-4 dark:bg-gray-750 rounded-lg ml-[-30px]">
    <div className="text-center">
      <div className="flex items-center justify-center space-x-1 mb-1">
        <Activity className="w-4 h-4 text-blue-500" />
        <span
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {formatNumber(currentLoad)}
        </span>
      </div>
      <div
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Current Load
      </div>
    </div>

    <div className="text-center">
      <div className="flex items-center justify-center space-x-1 mb-1">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <span
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {formatNumber(peakLoad)}
        </span>
      </div>
      <div
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Peak Load
      </div>
    </div>

    <div className="text-center">
      <div className="flex items-center justify-center space-x-1 mb-1">
        <AlertTriangle
          className={`w-4 h-4 ${
            errorRate > 2
              ? "text-red-500"
              : errorRate > 1
                ? "text-yellow-500"
                : "text-green-500"
          }`}
        />
        <span
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {errorRate.toFixed(2)}%
        </span>
      </div>
      <div
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Error Rate
      </div>
    </div>
  </div>
);

/**
 * Chart container with composed chart
 */
interface ChartContainerProps {
  chartData: ApiLoadData[];
  theme: string;
  formatTime: (timeString: string) => string;
  formatNumber: (num: number) => string;
}

const ChartContainer: FC<ChartContainerProps> = ({
  chartData,
  theme,
  formatTime,
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
          <p className="font-medium mb-2">{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatNumber(entry.value)}
              {entry.dataKey === "errors" &&
                payload[0]?.payload?.requests > 0 &&
                ` (${((entry.value / payload[0].payload.requests) * 100).toFixed(1)}%)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" className={"ml-[-30px]"}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
            tickFormatter={formatNumber}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="requests"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorRequests)"
            strokeWidth={2}
            name="Requests"
          />

          <Line
            type="monotone"
            dataKey="errors"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
            name="Errors"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Load status progress bar
 */
interface LoadStatusBarProps {
  theme: string;
  loadStatus: { text: string; color: string; level: number };
}

const LoadStatusBar: FC<LoadStatusBarProps> = ({ theme, loadStatus }) => (
  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <span
        className={`text-sm font-medium ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Current Load Level
      </span>
      <span className={`text-sm ${loadStatus.color}`}>
        {Math.round(loadStatus.level)}%
      </span>
    </div>
    <div
      className={`w-full h-2 rounded-full ${
        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
      }`}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${loadStatus.level}%` }}
        transition={{ duration: 1 }}
        className={`h-2 rounded-full ${
          loadStatus.level < 50
            ? "bg-green-500"
            : loadStatus.level < 80
              ? "bg-yellow-500"
              : "bg-red-500"
        }`}
      />
    </div>
  </div>
);
