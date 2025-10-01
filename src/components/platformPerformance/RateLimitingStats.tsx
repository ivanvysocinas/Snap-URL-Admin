"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  AlertTriangle,
  Activity,
  TrendingDown,
} from "lucide-react";

interface RateLimitingData {
  totalUsers: number;
  limitHits: number;
  averageUsage: number; // percentage 0-1
  topUsers: Array<{
    userId: string;
    requestCount: number;
    limitHits: number;
    lastActivity: string;
  }>;
}

interface RateLimitingStatsProps {
  data?: RateLimitingData;
  theme: string;
  loading?: boolean;
}

/**
 * Rate limiting statistics component with user behavior analysis
 * Displays API rate limiting metrics, usage patterns, and high-usage user tracking
 */
export const RateLimitingStats: FC<RateLimitingStatsProps> = ({
  data,
  theme,
  loading = false,
}) => {
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
   * Format relative time from ISO string
   */
  const formatTimeAgo = (isoString: string): string => {
    const now = new Date();
    const time = new Date(isoString);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - time.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  /**
   * Get usage status color based on percentage
   */
  const getUsageStatusColor = (usage: number): string => {
    if (usage < 0.5) return "text-green-500";
    if (usage < 0.8) return "text-yellow-500";
    return "text-red-500";
  };

  /**
   * Calculate overall rate limiting health
   */
  const getRateLimitingHealth = () => {
    if (!data) return { status: "Unknown", color: "text-gray-500" };

    const hitRate = data.totalUsers > 0 ? data.limitHits / data.totalUsers : 0;

    if (hitRate < 0.01) return { status: "Excellent", color: "text-green-500" };
    if (hitRate < 0.05) return { status: "Good", color: "text-yellow-500" };
    return { status: "Needs Attention", color: "text-red-500" };
  };

  if (loading) {
    return <LoadingState theme={theme} />;
  }

  const health = getRateLimitingHealth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Header */}
      <RateLimitingHeader theme={theme} health={health} />

      {/* Overview Metrics */}
      <OverviewMetrics
        data={data}
        theme={theme}
        formatNumber={formatNumber}
        getUsageStatusColor={getUsageStatusColor}
        health={health}
      />

      {/* Usage Distribution */}
      <UsageDistribution data={data} theme={theme} />

      {/* Top Users List */}
      <TopUsersList
        data={data}
        theme={theme}
        formatNumber={formatNumber}
        formatTimeAgo={formatTimeAgo}
      />

      {/* Health Summary */}
      <HealthSummary theme={theme} health={health} />
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
      <Shield className="w-6 h-6 text-orange-500" />
      <h3
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Rate Limiting Statistics
      </h3>
    </div>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

/**
 * Rate limiting header with system health indicator
 */
interface RateLimitingHeaderProps {
  theme: string;
  health: { status: string; color: string };
}

const RateLimitingHeader: FC<RateLimitingHeaderProps> = ({ theme, health }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-2">
      <Shield className="w-6 h-6 text-orange-500" />
      <h3
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Rate Limiting Statistics
      </h3>
    </div>
    <div className="text-right">
      <div className={`text-sm font-medium ${health.color}`}>
        {health.status}
      </div>
      <div
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        System Health
      </div>
    </div>
  </div>
);

/**
 * Overview metrics grid
 */
interface OverviewMetricsProps {
  data?: RateLimitingData | undefined;
  theme: string;
  formatNumber: (num: number) => string;
  getUsageStatusColor: (usage: number) => string;
  health: { status: string; color: string };
}

const OverviewMetrics: FC<OverviewMetricsProps> = ({
  data,
  theme,
  formatNumber,
  getUsageStatusColor,
  health,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div
      className={`p-4 rounded-lg ${
        theme === "dark" ? "bg-gray-750" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-2 mb-2">
        <Users className="w-4 h-4 text-blue-500" />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Total Users
        </span>
      </div>
      <div
        className={`text-xl font-bold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {data ? formatNumber(data.totalUsers) : "0"}
      </div>
    </div>

    <div
      className={`p-4 rounded-lg ${
        theme === "dark" ? "bg-gray-750" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Limit Hits
        </span>
      </div>
      <div
        className={`text-xl font-bold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {data ? formatNumber(data.limitHits) : "0"}
      </div>
    </div>

    <div
      className={`p-4 rounded-lg ${
        theme === "dark" ? "bg-gray-750" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-2 mb-2">
        <Activity className="w-4 h-4 text-purple-500" />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Avg Usage
        </span>
      </div>
      <div
        className={`text-xl font-bold ${
          data
            ? getUsageStatusColor(data.averageUsage)
            : theme === "dark"
              ? "text-white"
              : "text-gray-900"
        }`}
      >
        {data ? `${(data.averageUsage * 100).toFixed(1)}%` : "0%"}
      </div>
    </div>

    <div
      className={`p-4 rounded-lg ${
        theme === "dark" ? "bg-gray-750" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-2 mb-2">
        <TrendingDown className="w-4 h-4 text-green-500" />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Hit Rate
        </span>
      </div>
      <div className={`text-xl font-bold ${health.color}`}>
        {data && data.totalUsers > 0
          ? `${((data.limitHits / data.totalUsers) * 100).toFixed(2)}%`
          : "0%"}
      </div>
    </div>
  </div>
);

/**
 * Usage distribution section
 */
interface UsageDistributionProps {
  data?: RateLimitingData | undefined;
  theme: string;
}

const UsageDistribution: FC<UsageDistributionProps> = ({ data, theme }) => (
  <div className="mb-6">
    <h4
      className={`text-md font-semibold mb-4 ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}
    >
      Usage Distribution
    </h4>

    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Low Usage (&lt;50%)
          </span>
        </div>
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {data ? Math.floor(data.totalUsers * 0.7) : 0} users
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Moderate Usage (50-80%)
          </span>
        </div>
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {data ? Math.floor(data.totalUsers * 0.25) : 0} users
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            High Usage (&gt;80%)
          </span>
        </div>
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {data ? Math.floor(data.totalUsers * 0.05) : 0} users
        </span>
      </div>
    </div>
  </div>
);

/**
 * Top users list with high usage indicators
 */
interface TopUsersListProps {
  data?: RateLimitingData | undefined;
  theme: string;
  formatNumber: (num: number) => string;
  formatTimeAgo: (isoString: string) => string;
}

const TopUsersList: FC<TopUsersListProps> = ({
  data,
  theme,
  formatNumber,
  formatTimeAgo,
}) => (
  <div>
    <h4
      className={`text-md font-semibold mb-4 ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}
    >
      High Usage Users
    </h4>

    {data && data.topUsers && data.topUsers.length > 0 ? (
      <div className="space-y-3">
        {data.topUsers.map((user, index) => (
          <motion.div
            key={user.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-750 border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    user.limitHits > 5
                      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      : user.limitHits > 2
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  }`}
                >
                  U{index + 1}
                </div>

                <div>
                  <div
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    User {user.userId}
                  </div>
                  <div
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {formatNumber(user.requestCount)} requests • Last:{" "}
                    {formatTimeAgo(user.lastActivity)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-semibold ${
                    user.limitHits > 5
                      ? "text-red-500"
                      : user.limitHits > 2
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {user.limitHits} hits
                </div>
                <div
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Rate limits
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <div
        className={`text-center py-8 ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        <Shield
          className={`w-12 h-12 mx-auto mb-3 ${
            theme === "dark" ? "text-gray-600" : "text-gray-400"
          }`}
        />
        <p className="text-sm">No high-usage users detected</p>
        <p className="text-xs mt-1">All users are within normal limits</p>
      </div>
    )}
  </div>
);

/**
 * Health summary footer
 */
interface HealthSummaryProps {
  theme: string;
  health: { status: string; color: string };
}

const HealthSummary: FC<HealthSummaryProps> = ({ theme, health }) => (
  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Rate Limiting Health:
      </span>
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            health.status === "Excellent"
              ? "bg-green-500"
              : health.status === "Good"
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
        />
        <span className={`text-sm font-medium ${health.color}`}>
          {health.status}
        </span>
      </div>
    </div>
  </div>
);
