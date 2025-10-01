/**
 * Real-time analytics dashboard component with live activity tracking
 * Features animated pulse effects, data freshness indicators, and country display
 * Complex animation system that responds to data changes and shows live status
 * Includes time formatting utilities and visual feedback for data updates
 */
"use client";

import { useState, useEffect, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, Globe, Zap, TrendingUp, Users } from "lucide-react";

interface RealtimeStatsProps {
  realTimeData?:
    | {
        clicksLast5Minutes: number;
        clicksLastHour: number;
        activeCountries: Array<string>;
        lastUpdated: string;
      }
    | undefined;
  theme: string;
  loading: boolean;
}

export const RealtimeStats: FC<RealtimeStatsProps> = ({
  realTimeData,
  theme,
  loading,
}) => {
  const [pulseKey, setPulseKey] = useState(0);
  const [previousData, setPreviousData] = useState(realTimeData);

  /**
   * Trigger pulse animation when data changes
   * Compares current data with previous to detect updates
   */
  useEffect(() => {
    if (realTimeData && previousData) {
      if (
        realTimeData.clicksLast5Minutes !== previousData.clicksLast5Minutes ||
        realTimeData.clicksLastHour !== previousData.clicksLastHour
      ) {
        setPulseKey((prev) => prev + 1);
      }
    }
    setPreviousData(realTimeData);
  }, [realTimeData]);

  const stats = [
    {
      title: "Last 5 Minutes",
      value: realTimeData?.clicksLast5Minutes || 0,
      icon: Zap,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      gradient: "from-green-400 to-emerald-500",
      description: "Recent activity",
    },
    {
      title: "Last Hour",
      value: realTimeData?.clicksLastHour || 0,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      gradient: "from-blue-400 to-cyan-500",
      description: "Hourly traffic",
    },
    {
      title: "Active Countries",
      value: realTimeData?.activeCountries?.length || 0,
      icon: Globe,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      gradient: "from-purple-400 to-pink-500",
      description: "Global reach",
    },
  ];

  /**
   * Format timestamp to human-readable relative time
   * Handles seconds, minutes, and hours with proper pluralization
   */
  const formatLastUpdated = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 10) return "Just now";
      if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } catch {
      return "Unknown";
    }
  };

  /**
   * Determine if data is considered fresh (less than 5 minutes old)
   */
  const isDataFresh = (timestamp: string): boolean => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
      return diffInMinutes < 5;
    } catch {
      return false;
    }
  };

  const dataIsFresh = realTimeData?.lastUpdated
    ? isDataFresh(realTimeData.lastUpdated)
    : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card p-6 relative overflow-hidden ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"
        />
      </div>

      {/* Header with live status indicator */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <motion.div
            key={pulseKey}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Activity className="w-6 h-6 text-red-500" />
            {dataIsFresh && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              />
            )}
          </motion.div>

          <div>
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Real-time Activity
            </h3>
            <div className="flex items-center space-x-2">
              <div
                className={`flex items-center space-x-1 ${
                  dataIsFresh ? "text-green-500" : "text-yellow-500"
                }`}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`w-2 h-2 rounded-full ${
                    dataIsFresh ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                <span className="text-xs font-medium">
                  {dataIsFresh ? "Live" : "Delayed"}
                </span>
              </div>

              {realTimeData?.lastUpdated && (
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  • {formatLastUpdated(realTimeData.lastUpdated)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Overall activity indicator */}
        <div
          className={`text-right ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">
              {(realTimeData?.clicksLastHour || 0) > 0 ? "Active" : "Quiet"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid with pulse animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <AnimatePresence mode="wait">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`relative p-4 rounded-xl border ${
                theme === "dark"
                  ? "bg-gray-700/50 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              } hover:shadow-lg transition-all duration-300`}
            >
              {/* Gradient flash for value changes */}
              <AnimatePresence>
                {pulseKey > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.gradient}`}
                  />
                )}
              </AnimatePresence>

              <div className="flex items-center space-x-3 relative z-10">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`p-3 rounded-lg ${stat.bgColor}`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </motion.div>

                <div>
                  <motion.p
                    key={`${stat.value}-${pulseKey}`}
                    initial={{
                      scale: 1.2,
                      color: stat.color.replace("text-", ""),
                    }}
                    animate={{
                      scale: 1,
                      color: theme === "dark" ? "#ffffff" : "#1f2937",
                    }}
                    transition={{ duration: 0.3 }}
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </motion.p>

                  <p
                    className={`text-xs font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.title}
                  </p>

                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {stat.description}
                  </p>
                </div>
              </div>

              {/* Value change indicator */}
              {stat.value > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={`absolute top-2 right-2 p-1 rounded-full ${stat.bgColor}`}
                >
                  <TrendingUp className={`w-3 h-3 ${stat.color}`} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Active Countries List */}
      {realTimeData?.activeCountries &&
        realTimeData.activeCountries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 relative z-10"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-4 h-4 text-blue-500" />
              <p
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Active Countries Right Now
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {realTimeData.activeCountries
                .slice(0, 8)
                .map((country, index) => (
                  <motion.span
                    key={country}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`px-2 py-1 text-xs rounded-full ${
                      theme === "dark"
                        ? "bg-blue-900/30 text-blue-300"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {country}
                  </motion.span>
                ))}

              {realTimeData.activeCountries.length > 8 && (
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  +{realTimeData.activeCountries.length - 8} more
                </span>
              )}
            </div>
          </motion.div>
        )}
    </motion.div>
  );
};
