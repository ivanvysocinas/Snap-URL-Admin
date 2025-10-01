"use client";

import { useState, useEffect, useCallback, useRef, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Users,
  MousePointer,
  Globe,
  RefreshCw,
  Play,
  Pause,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { StatsCard } from "../../components/dashboard/StatsCards";
import { useTheme } from "../../context/ThemeContext";
import api from "../../lib/api";
import { useComingSoon } from "@/hooks/useComingSoonModal";
import { ChartCard } from "@/components/dashboard/ChartCard";

/**
 * Real-time analytics data structure
 */
interface RealTimeData {
  timeWindow: string;
  statistics: {
    recentClicks: number;
    activeUrls: number;
    activeCountries: number;
    avgClicksPerMinute: number;
  };
  activeUrls: Array<{
    shortUrl: string;
    title?: string;
    clickCount: number;
    uniqueVisitors: number;
    lastClick: string;
  }>;
  liveVisitors: number;
  lastUpdated: string;
}

/**
 * Real-time analytics dashboard component
 * Monitors live activity with auto-refresh and manual controls
 */
const RealTimeAnalyticsContent: FC = () => {
  const { theme } = useTheme();
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);
  const [timeWindow] = useState<5 | 15 | 30 | 60>(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { showComingSoon } = useComingSoon();

  // Animation variants for live indicator
  const pulseVariants = {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  /**
   * Fetches real-time analytics data from API
   */
  const fetchRealTimeData = useCallback(
    async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        }
        setError(null);

        const response = await api.analytics.getRealTime(timeWindow);

        if (response.success && response.data) {
          setRealTimeData(response.data);
          setLastUpdate(new Date());
        } else {
          throw new Error(response.message || "Failed to fetch real-time data");
        }
      } catch (err) {
        console.error("Error fetching real-time data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load real-time data"
        );
      } finally {
        setLoading(false);
      }
    },
    [timeWindow]
  );

  /**
   * Sets up auto-refresh interval
   */
  useEffect(() => {
    if (isAutoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchRealTimeData(false);
      }, 10000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRefresh, fetchRealTimeData]);

  /**
   * Initial data fetch on component mount
   */
  useEffect(() => {
    fetchRealTimeData(true);
  }, [fetchRealTimeData]);

  /**
   * Handles manual refresh button click
   */
  const handleManualRefresh = () => {
    fetchRealTimeData(false);
  };

  /**
   * Toggles auto-refresh on/off
   */
  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  /**
   * Formats timestamp to relative time string
   */
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  if (loading && !realTimeData) {
    return (
      <DashboardLayout
        title="Real-time Analytics"
        description="Monitor live activity and engagement as it happens"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout
        title="Real-time Analytics"
        description="Monitor live activity and engagement as it happens"
      >
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                    Failed to load real-time data
                  </p>
                  <p className="text-red-600 dark:text-red-500 text-xs">
                    {error}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={handleManualRefresh}
                  className="text-red-600 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 underline"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 underline"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            {/* Live Indicator */}
            <div className="flex items-center space-x-2">
              <motion.div
                variants={pulseVariants}
                initial="initial"
                animate="animate"
                className="w-3 h-3 bg-green-500 rounded-full"
              />
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {isAutoRefresh ? "Live" : "Paused"}
              </span>
            </div>

            {/* Time Window Selector */}
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Window:
              </span>
              <select
                value={timeWindow}
                onClick={(e) => {
                  e.preventDefault();
                  showComingSoon();
                }}
                onMouseDown={(e) => e.preventDefault()}
                onKeyDown={(e) => e.preventDefault()}
                className="input-base py-1 text-sm"
              >
                <option value={5}>5 min</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
              </select>
            </div>

            {/* Last Updated */}
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Updated {formatTimeAgo(lastUpdate.toISOString())}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAutoRefresh}
              className={`p-2 rounded-lg border transition-colors ${
                isAutoRefresh
                  ? "bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                  : theme === "dark"
                    ? "border-gray-700 hover:bg-gray-800 text-gray-400"
                    : "border-gray-300 hover:bg-gray-50 text-gray-600"
              }`}
              title={
                isAutoRefresh ? "Pause auto-refresh" : "Resume auto-refresh"
              }
            >
              {isAutoRefresh ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleManualRefresh}
              className={`p-2 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800 text-gray-400"
                  : "border-gray-300 hover:bg-gray-50 text-gray-600"
              }`}
              title="Refresh now"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Real-time Metrics - Only from API */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Live Visitors"
            value={realTimeData?.liveVisitors || 0}
            icon={Users}
            color="green"
            theme={theme}
          />
          <StatsCard
            title="Recent Clicks"
            value={realTimeData?.statistics?.recentClicks || 0}
            icon={MousePointer}
            color="blue"
            theme={theme}
          />
          <StatsCard
            title="Active URLs"
            value={realTimeData?.statistics?.activeUrls || 0}
            icon={Activity}
            color="purple"
            theme={theme}
          />
          <StatsCard
            title="Active Countries"
            value={realTimeData?.statistics?.activeCountries || 0}
            icon={Globe}
            color="orange"
            theme={theme}
          />
        </div>

        {/* Active URLs - Only from API */}
        {realTimeData?.activeUrls && realTimeData.activeUrls.length > 0 && (
          <div className="mb-8">
            <ChartCard title="Active URLs" theme={theme}>
              <div className="space-y-4">
                {realTimeData.activeUrls.map((url, index) => (
                  <motion.div
                    key={url.shortUrl}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm truncate ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {url.title || "Untitled"}
                      </p>
                      <p className="text-xs text-blue-500 font-mono">
                        {url.shortUrl}
                      </p>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Last click: {formatTimeAgo(url.lastClick)}
                      </p>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-semibold text-sm ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {url.clickCount}
                      </div>
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        clicks
                      </div>
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {url.uniqueVisitors} unique
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ChartCard>
          </div>
        )}

        {/* Real-time Stats Summary */}
        <div className="mb-8">
          <ChartCard title="Real-time Summary" theme={theme}>
            {/* No Data State */}
            {!realTimeData?.activeUrls?.length && !loading && (
              <div className="text-center py-20">
                <Activity
                  className={`w-16 h-16 mx-auto mb-4 ${
                    theme === "dark" ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-lg font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  No Real-time Activity
                </h3>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Waiting for live activity in the selected time window
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/20 py-2">
              <div>
                <h4
                  className={`text-sm font-medium mb-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Activity Window
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Time Window:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {realTimeData?.timeWindow || `${timeWindow} minutes`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Avg Clicks/Min:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {realTimeData?.statistics?.avgClicksPerMinute?.toFixed(
                        1
                      ) || "0"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4
                  className={`text-sm font-medium mb-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Last Updated
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Server Time:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {realTimeData?.lastUpdated
                        ? new Date(
                            realTimeData.lastUpdated
                          ).toLocaleTimeString()
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Status:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isAutoRefresh ? "text-green-500" : "text-orange-500"
                      }`}
                    >
                      {isAutoRefresh ? "Live" : "Paused"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default RealTimeAnalyticsContent;
