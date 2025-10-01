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
import { Lock } from "lucide-react";

interface AuthTrend {
  hour: string;
  failed: number;
  successful: number;
}

interface LoginAttemptsChartProps {
  data?: AuthTrend[];
  theme: string;
  loading?: boolean;
}

/**
 * Login attempts chart component
 * Displays authentication success/failure trends over time using area chart visualization
 */
export const LoginAttemptsChart: FC<LoginAttemptsChartProps> = ({
  data = [],
  theme,
  loading = false,
}) => {
  /**
   * Format time string to display format
   */
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Custom tooltip component for chart
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
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center space-x-2 mb-6">
          <Lock className="w-6 h-6 text-orange-500" />
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Login Attempts
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse space-y-3 w-full">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  const totalFailed = data.reduce((sum, item) => sum + item.failed, 0);
  const totalSuccessful = data.reduce((sum, item) => sum + item.successful, 0);
  const failureRate =
    totalSuccessful + totalFailed > 0
      ? (totalFailed / (totalSuccessful + totalFailed)) * 100
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Lock className="w-6 h-6 text-orange-500" />
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Login Attempts
          </h3>
        </div>
        <div className="text-right">
          <div
            className={`text-sm font-medium ${
              failureRate > 10
                ? "text-red-500"
                : failureRate > 5
                  ? "text-yellow-500"
                  : "text-green-500"
            }`}
          >
            {failureRate.toFixed(1)}% failures
          </div>
          <div
            className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Last 24 hours
          </div>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="colorSuccessful"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
              />

              <XAxis
                dataKey="hour"
                tickFormatter={formatTime}
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
                dataKey="successful"
                stackId="1"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorSuccessful)"
                strokeWidth={2}
                name="Successful"
              />

              <Area
                type="monotone"
                dataKey="failed"
                stackId="1"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorFailed)"
                strokeWidth={2}
                name="Failed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Lock
              className={`w-16 h-16 mx-auto mb-4 ${
                theme === "dark" ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <h4
              className={`text-lg font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              No Authentication Data
            </h4>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Login attempt data will appear here
            </p>
          </div>
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-lg font-semibold text-green-500`}>
                {totalSuccessful}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Successful
              </div>
            </div>
            <div>
              <div className={`text-lg font-semibold text-red-500`}>
                {totalFailed}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Failed
              </div>
            </div>
            <div>
              <div
                className={`text-lg font-semibold ${
                  failureRate > 10
                    ? "text-red-500"
                    : failureRate > 5
                      ? "text-yellow-500"
                      : "text-green-500"
                }`}
              >
                {failureRate.toFixed(1)}%
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Failure Rate
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
