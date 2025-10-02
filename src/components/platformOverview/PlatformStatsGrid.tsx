"use client";

import { FC, ElementType } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Link,
  MousePointer,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Plus,
  Activity,
} from "lucide-react";

interface PlatformOverview {
  users: {
    totalUsers: number;
    active: number;
    new: number;
    growth: number;
  };
  urls: {
    totalUrls: number;
    active: number;
    new: number;
    growth: number;
  };
  clicks: {
    totalClicks: number;
    today: number;
    growth: number;
  };
}

interface PlatformStatsGridProps {
  overview?: PlatformOverview;
  theme: string;
  loading?: boolean;
}

/**
 * Platform statistics grid component with animated cards
 * Displays key platform metrics in responsive grid layout with trend indicators
 */
export const PlatformStatsGrid: FC<PlatformStatsGridProps> = ({
  overview,
  theme,
  loading = false,
}) => {
  /**
   * Format large numbers with appropriate suffixes
   */
  const formatNumber = (num?: number): string => {
    if (num === undefined || num === null) return "0";
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  /**
   * Get trend indicator component with color and icon
   */
  const getTrendIndicator = (growth?: number) => {
    if (growth === undefined || growth === null) return null;
    
    const isPositive = growth >= 0;
    return (
      <div
        className={`flex items-center space-x-1 text-sm ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span className="font-medium">
          {isPositive ? "+" : ""}
          {growth.toFixed(1)}%
        </span>
      </div>
    );
  };

  if (!overview && !loading) {
    return <EmptyState theme={theme} />;
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-6 h-6 text-blue-500" />
        <h2
          className={`text-xl font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Platform Statistics
        </h2>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={overview?.users.totalUsers ?? 0}
          subtitle="Registered accounts"
          icon={Users}
          color="blue"
          {...(overview?.users.growth !== undefined && { growth: overview.users.growth })}
          {...(overview?.users.active && { additionalInfo: `${formatNumber(overview.users.active)} active` })}
          theme={theme}
          loading={loading}
          formatNumber={formatNumber}
          getTrendIndicator={getTrendIndicator}
        />

        <StatsCard
          title="Total URLs"
          value={overview?.urls.totalUrls ?? 0}
          subtitle="Shortened links"
          icon={Link}
          color="green"
          {...(overview?.urls.growth !== undefined && { growth: overview.urls.growth })}
          {...(overview?.urls.active && { additionalInfo: `${formatNumber(overview.urls.active)} active` })}
          theme={theme}
          loading={loading}
          formatNumber={formatNumber}
          getTrendIndicator={getTrendIndicator}
        />

        <StatsCard
          title="Total Clicks"
          value={overview?.clicks.totalClicks ?? 0}
          subtitle="All-time clicks"
          icon={MousePointer}
          color="purple"
          {...(overview?.clicks.growth !== undefined && { growth: overview.clicks.growth })}
          {...(overview?.clicks.today && { additionalInfo: `${formatNumber(overview.clicks.today)} today` })}
          theme={theme}
          loading={loading}
          formatNumber={formatNumber}
          getTrendIndicator={getTrendIndicator}
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="New Users"
          value={overview?.users.new ?? 0}
          subtitle="This period"
          icon={UserPlus}
          color="orange"
          theme={theme}
          loading={loading}
          formatNumber={formatNumber}
          getTrendIndicator={getTrendIndicator}
        />

        <StatsCard
          title="New URLs"
          value={overview?.urls.new ?? 0}
          subtitle="This period"
          icon={Plus}
          color="indigo"
          theme={theme}
          loading={loading}
          formatNumber={formatNumber}
          getTrendIndicator={getTrendIndicator}
        />

        <StatsCard
          title="Active Users"
          value={overview?.users.active ?? 0}
          subtitle="Recent activity"
          icon={Activity}
          color="teal"
          theme={theme}
          loading={loading}
          formatNumber={formatNumber}
          getTrendIndicator={getTrendIndicator}
        />
      </div>
    </div>
  );
};

/**
 * Individual statistics card component
 */
interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: ElementType;
  color: string;
  growth?: number;
  additionalInfo?: string;
  theme: string;
  loading: boolean;
  formatNumber: (num?: number) => string;
  getTrendIndicator: (growth?: number) => JSX.Element | null;
}

const StatsCard: FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  growth,
  additionalInfo,
  theme,
  loading,
  formatNumber,
  getTrendIndicator,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>

      {growth !== undefined && getTrendIndicator(growth)}
    </div>

    <div className="space-y-2">
      <h3
        className={`text-2xl font-bold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {loading ? "..." : formatNumber(value)}
      </h3>

      <p
        className={`text-sm font-medium ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {title}
      </p>

      <p
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {subtitle}
      </p>

      {additionalInfo && (
        <p
          className={`text-xs ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {additionalInfo}
        </p>
      )}
    </div>
  </motion.div>
);

/**
 * Empty state when no data is available
 */
interface EmptyStateProps {
  theme: string;
}

const EmptyState: FC<EmptyStateProps> = ({ theme }) => (
  <div
    className={`card p-8 text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
  >
    <Activity
      className={`w-12 h-12 mx-auto mb-4 ${
        theme === "dark" ? "text-gray-600" : "text-gray-400"
      }`}
    />
    <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
      No platform statistics available
    </p>
  </div>
);