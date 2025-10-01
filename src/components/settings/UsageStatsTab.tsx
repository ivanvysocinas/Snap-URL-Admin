"use client";

import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Link,
  Eye,
  Calendar,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import api from "../../lib/api";

// Interface for API usage data
interface ApiUsageData {
  userId: string;
  requestCount: number;
  lastRequestAt: string;
  rateLimitResets: number;
  accountAge: number;
  totalUrls: number;
  totalClicks: number;
  activityScore: number;
}

/**
 * Stats card component for displaying usage metrics
 */
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: "blue" | "green" | "purple" | "orange" | "red";
  description?: string;
  loading?: boolean;
}

const StatsCard: FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  description,
  loading = false,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-lg border ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-8 h-8" />
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium opacity-90">{title}</p>
        <p className="text-2xl font-bold">{loading ? "..." : value}</p>
        {description && <p className="text-xs opacity-70">{description}</p>}
      </div>
    </motion.div>
  );
};

/**
 * Usage statistics tab component
 * Displays API usage, account metrics, and activity analytics with gamification
 */
export const UsageStatsTab: FC = () => {
  const [usageData, setUsageData] = useState<ApiUsageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  /**
   * Fetch usage statistics from API
   */
  const fetchUsageStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.auth.getApiUsage();
      if (response.success && response.data) {
        setUsageData(response.data.usage);
        setLastRefresh(new Date());
      } else {
        setError("Failed to load usage statistics");
      }
    } catch (err) {
      console.error("Failed to fetch usage stats:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load usage statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsageStats();
  }, []);

  /**
   * Calculate activity level based on score with 5 levels
   */
  const getActivityLevel = (
    score: number
  ): {
    level: string;
    color: "green" | "orange" | "red" | "purple" | "blue";
    progress: number;
    isMaxLevel: boolean;
    emoji: string;
  } => {
    if (score >= 2000)
      return {
        level: "Legendary",
        color: "purple",
        progress: 100,
        isMaxLevel: true,
        emoji: "👑",
      };
    if (score >= 1000)
      return {
        level: "Expert",
        color: "blue",
        progress: Math.min(((score - 1000) / 1000) * 100, 100),
        isMaxLevel: false,
        emoji: "🔥",
      };
    if (score >= 500)
      return {
        level: "Advanced",
        color: "green",
        progress: ((score - 500) / 500) * 100,
        isMaxLevel: false,
        emoji: "⚡",
      };
    if (score >= 200)
      return {
        level: "Intermediate",
        color: "orange",
        progress: ((score - 200) / 300) * 100,
        isMaxLevel: false,
        emoji: "🚀",
      };
    if (score >= 100)
      return {
        level: "Beginner",
        color: "green",
        progress: ((score - 100) / 100) * 100,
        isMaxLevel: false,
        emoji: "🌱",
      };
    return {
      level: "New User",
      color: "red",
      progress: score,
      isMaxLevel: false,
      emoji: "🐣",
    };
  };

  /**
   * Format account age in a readable format
   */
  const formatAccountAge = (days: number): string => {
    if (days < 30) {
      return `${days} day${days !== 1 ? "s" : ""}`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(days / 365);
      const remainingMonths = Math.floor((days % 365) / 30);
      if (remainingMonths === 0) {
        return `${years} year${years !== 1 ? "s" : ""}`;
      }
      return `${years}y ${remainingMonths}m`;
    }
  };

  /**
   * Format number with commas for better readability
   */
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const activityLevel = usageData
    ? getActivityLevel(usageData.activityScore)
    : {
        level: "Unknown",
        color: "red" as const,
        progress: 0,
        isMaxLevel: false,
        emoji: "⏳",
      };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-semibold dark:text-white">
              Usage Statistics
            </h3>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">
                Error Loading Statistics
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchUsageStats}
              className="ml-auto btn-secondary px-3 py-1 rounded"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold dark:text-white">
              Usage Statistics
            </h3>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchUsageStats}
            disabled={loading}
            className="btn-secondary px-3 py-2 rounded-lg flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </motion.button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Last updated: {lastRefresh.toLocaleString()}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="API Requests"
          value={usageData ? formatNumber(usageData.requestCount) : 0}
          icon={Activity}
          color="blue"
          description="Total API calls made"
          loading={loading}
        />

        <StatsCard
          title="Total URLs"
          value={usageData ? formatNumber(usageData.totalUrls) : 0}
          icon={Link}
          color="green"
          description="URLs created"
          loading={loading}
        />

        <StatsCard
          title="Total Clicks"
          value={usageData ? formatNumber(usageData.totalClicks) : 0}
          icon={Eye}
          color="purple"
          description="Total URL visits"
          loading={loading}
        />

        <StatsCard
          title="Account Age"
          value={usageData ? formatAccountAge(usageData.accountAge) : "N/A"}
          icon={Calendar}
          color="orange"
          description="Member since"
          loading={loading}
        />
      </div>

      {/* Activity Overview */}
      <div className="card p-6">
        <h4 className="font-semibold dark:text-white mb-4">
          Activity Overview
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Level with beautiful animation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium dark:text-gray-300">
                Activity Level
              </span>
              <div className="flex items-center space-x-2">
                <motion.span
                  className="text-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.3,
                  }}
                >
                  {loading ? "⏳" : activityLevel.emoji}
                </motion.span>
                <span
                  className={`text-sm font-semibold ${
                    activityLevel.color === "purple"
                      ? "text-purple-600 dark:text-purple-400"
                      : activityLevel.color === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : activityLevel.color === "green"
                          ? "text-green-600 dark:text-green-400"
                          : activityLevel.color === "orange"
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {loading ? "..." : activityLevel.level}
                </span>
              </div>
            </div>

            {/* Level Progress Bar with Glow Effect */}
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0, boxShadow: "0 0 0px rgba(0,0,0,0)" }}
                  animate={{
                    width: loading ? 0 : `${activityLevel.progress}%`,
                    boxShadow: loading
                      ? "0 0 0px rgba(0,0,0,0)"
                      : `0 0 8px ${
                          activityLevel.color === "purple"
                            ? "rgba(147, 51, 234, 0.4)"
                            : activityLevel.color === "blue"
                              ? "rgba(59, 130, 246, 0.4)"
                              : activityLevel.color === "green"
                                ? "rgba(34, 197, 94, 0.4)"
                                : activityLevel.color === "orange"
                                  ? "rgba(251, 146, 60, 0.4)"
                                  : "rgba(239, 68, 68, 0.4)"
                        }`,
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut",
                    delay: 0.5,
                  }}
                  className={`h-3 rounded-full relative ${
                    activityLevel.color === "purple"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600"
                      : activityLevel.color === "blue"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : activityLevel.color === "green"
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : activityLevel.color === "orange"
                            ? "bg-gradient-to-r from-orange-500 to-orange-600"
                            : "bg-gradient-to-r from-red-500 to-red-600"
                  }`}
                >
                  {/* Sparkle effect for max level */}
                  {activityLevel.isMaxLevel && !loading && (
                    <>
                      <motion.div
                        className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full"
                        animate={{
                          scale: [0, 1.5, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 0.5,
                        }}
                      />
                      <motion.div
                        className="absolute top-1/4 right-1/3 w-1 h-1 bg-white rounded-full"
                        animate={{
                          scale: [0, 1.5, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                      <motion.div
                        className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-white rounded-full"
                        animate={{
                          scale: [0, 1.5, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 1.5,
                        }}
                      />
                    </>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Score Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp
                  className={`w-4 h-4 ${
                    activityLevel.color === "purple"
                      ? "text-purple-500"
                      : activityLevel.color === "blue"
                        ? "text-blue-500"
                        : activityLevel.color === "green"
                          ? "text-green-500"
                          : activityLevel.color === "orange"
                            ? "text-orange-500"
                            : "text-red-500"
                  }`}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Score:{" "}
                  {loading
                    ? "..."
                    : formatNumber(usageData?.activityScore || 0)}
                </span>
              </div>

              {activityLevel.isMaxLevel && !loading ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-medium"
                >
                  MAX LEVEL REACHED!
                </motion.div>
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {loading
                    ? ""
                    : `Next: ${
                        !usageData?.activityScore ||
                        usageData.activityScore < 100
                          ? 100
                          : usageData.activityScore < 200
                            ? 200
                            : usageData.activityScore < 500
                              ? 500
                              : usageData.activityScore < 1000
                                ? 1000
                                : usageData.activityScore < 2000
                                  ? 2000
                                  : "MAX"
                      }`}
                </span>
              )}
            </div>

            {/* Level Milestones */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span>500</span>
              <span>1K</span>
              <span>2K+</span>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Rate Limit Resets:
              </span>
              <span className="text-sm font-medium dark:text-white">
                {loading
                  ? "..."
                  : formatNumber(usageData?.rateLimitResets || 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Last API Request:
              </span>
              <span className="text-sm font-medium dark:text-white">
                {loading
                  ? "..."
                  : usageData?.lastRequestAt
                    ? new Date(usageData.lastRequestAt).toLocaleDateString()
                    : "Never"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Avg. Clicks per URL:
              </span>
              <span className="text-sm font-medium dark:text-white">
                {loading
                  ? "..."
                  : usageData && usageData.totalUrls > 0
                    ? Math.round(usageData.totalClicks / usageData.totalUrls)
                    : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="card p-6">
        <h4 className="font-semibold dark:text-white mb-4">Usage Tips</h4>

        <div className="space-y-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> Regular API usage helps maintain a higher
              activity score, which may unlock additional features in the
              future.
            </p>
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>Performance:</strong> Your URLs have an average of{" "}
              {usageData && usageData.totalUrls > 0
                ? Math.round(usageData.totalClicks / usageData.totalUrls)
                : 0}{" "}
              clicks each. Consider optimizing your most popular links.
            </p>
          </div>

          {usageData && usageData.rateLimitResets > 5 && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-orange-700 dark:text-orange-300">
                <strong>Rate Limits:</strong> You've hit rate limits{" "}
                {usageData.rateLimitResets} times. Consider implementing request
                batching for better performance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
