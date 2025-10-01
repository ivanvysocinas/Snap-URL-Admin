/**
 * Analytics component displaying device and browser statistics
 * Features pie chart visualization for device types and list view for top browsers
 * Supports loading states and empty data handling with appropriate fallbacks
 */
"use client";

import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DeviceAnalyticsProps {
  technologyData?:
    | {
        byDevice: Array<{
          _id: string;
          count: number;
        }>;
        byBrowser: Array<{
          _id: string;
          count: number;
        }>;
      }
    | undefined;
  theme: string;
  loading: boolean;
}

export const DeviceAnalytics: FC<DeviceAnalyticsProps> = ({
  technologyData,
  theme,
  loading,
}) => {
  // Transform device data for chart consumption
  const deviceData =
    technologyData?.byDevice?.map((device) => ({
      name: device._id,
      value: device.count,
    })) || [];

  // Limit browser data to top 5 for clean display
  const browserData = technologyData?.byBrowser?.slice(0, 5) || [];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Device & Browser Analytics
      </h3>

      {loading ? (
        <div className="space-y-4">
          <div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Device Distribution Chart */}
          {deviceData.length > 0 && (
            <div>
              <h4
                className={`text-sm font-medium mb-3 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Device Types
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {deviceData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      color: theme === "dark" ? "#f3f4f6" : "#111827",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Browser List */}
          {browserData.length > 0 && (
            <div>
              <h4
                className={`text-sm font-medium mb-3 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Top Browsers
              </h4>
              <div className="space-y-2">
                {browserData.map((browser) => (
                  <div
                    key={browser._id}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {browser._id}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {browser.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deviceData.length === 0 && browserData.length === 0 && (
            <div className="text-center py-8">
              <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                No device data available yet
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
