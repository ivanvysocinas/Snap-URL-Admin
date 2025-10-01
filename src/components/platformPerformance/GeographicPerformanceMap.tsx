"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Globe, TrendingUp, Users, MousePointer } from "lucide-react";

interface GeographicData {
  region: string;
  clicks: number;
  users: number;
  performance: number; // 0-100 performance score
}

interface GeographicPerformanceMapProps {
  data: GeographicData[];
  theme: string;
  loading?: boolean;
}

/**
 * Geographic performance map component with regional metrics
 * Displays performance data, user distribution, and click analytics by region
 */
export const GeographicPerformanceMap: FC<GeographicPerformanceMapProps> = ({
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
   * Get performance color based on score
   */
  const getPerformanceColor = (score: number): string => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  /**
   * Get performance badge text
   */
  const getPerformanceBadge = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    return "Poor";
  };

  /**
   * Calculate total metrics from all regions
   */
  const getTotalMetrics = () => {
    if (!data || data.length === 0)
      return { totalClicks: 0, totalUsers: 0, avgPerformance: 0 };

    const totalClicks = data.reduce((sum, region) => sum + region.clicks, 0);
    const totalUsers = data.reduce((sum, region) => sum + region.users, 0);
    const avgPerformance =
      data.reduce((sum, region) => sum + region.performance, 0) / data.length;

    return { totalClicks, totalUsers, avgPerformance };
  };

  if (loading) {
    return <LoadingState theme={theme} />;
  }

  const totalMetrics = getTotalMetrics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Header */}
      <MapHeader
        theme={theme}
        totalMetrics={totalMetrics}
        getPerformanceColor={getPerformanceColor}
        getPerformanceBadge={getPerformanceBadge}
      />

      {/* Global Summary */}
      <GlobalSummary
        theme={theme}
        totalMetrics={totalMetrics}
        formatNumber={formatNumber}
      />

      {/* Regional Performance List */}
      {data.length > 0 ? (
        <RegionalList
          data={data}
          theme={theme}
          formatNumber={formatNumber}
          getPerformanceColor={getPerformanceColor}
          getPerformanceBadge={getPerformanceBadge}
        />
      ) : (
        <EmptyState theme={theme} />
      )}

      {/* Performance Legend */}
      {data.length > 0 && <PerformanceLegend theme={theme} />}
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
      <Globe className="w-6 h-6 text-green-500" />
      <h3
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Geographic Performance
      </h3>
    </div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

/**
 * Map header with performance overview
 */
interface MapHeaderProps {
  theme: string;
  totalMetrics: {
    totalClicks: number;
    totalUsers: number;
    avgPerformance: number;
  };
  getPerformanceColor: (score: number) => string;
  getPerformanceBadge: (score: number) => string;
}

const MapHeader: FC<MapHeaderProps> = ({
  theme,
  totalMetrics,
  getPerformanceColor,
  getPerformanceBadge,
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-2">
      <Globe className="w-6 h-6 text-green-500" />
      <h3
        className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Geographic Performance
      </h3>
    </div>
    <div className="text-right">
      <div
        className={`text-sm font-medium ${getPerformanceColor(totalMetrics.avgPerformance)}`}
      >
        {getPerformanceBadge(totalMetrics.avgPerformance)}
      </div>
      <div
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Global Average
      </div>
    </div>
  </div>
);

/**
 * Global metrics summary grid
 */
interface GlobalSummaryProps {
  theme: string;
  totalMetrics: {
    totalClicks: number;
    totalUsers: number;
    avgPerformance: number;
  };
  formatNumber: (num: number) => string;
}

const GlobalSummary: FC<GlobalSummaryProps> = ({
  theme,
  totalMetrics,
  formatNumber,
}) => (
  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-750 rounded-lg">
    <div className="text-center">
      <div className="flex items-center justify-center space-x-1 mb-1">
        <MousePointer className="w-4 h-4 text-blue-500" />
        <span
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {formatNumber(totalMetrics.totalClicks)}
        </span>
      </div>
      <div
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Total Clicks
      </div>
    </div>

    <div className="text-center">
      <div className="flex items-center justify-center space-x-1 mb-1">
        <Users className="w-4 h-4 text-purple-500" />
        <span
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {formatNumber(totalMetrics.totalUsers)}
        </span>
      </div>
      <div
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Total Users
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
          {Math.round(totalMetrics.avgPerformance)}%
        </span>
      </div>
      <div
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Avg Performance
      </div>
    </div>
  </div>
);

/**
 * Regional performance list with animated cards
 */
interface RegionalListProps {
  data: GeographicData[];
  theme: string;
  formatNumber: (num: number) => string;
  getPerformanceColor: (score: number) => string;
  getPerformanceBadge: (score: number) => string;
}

const RegionalList: FC<RegionalListProps> = ({
  data,
  theme,
  formatNumber,
  getPerformanceColor,
  getPerformanceBadge,
}) => (
  <div className="space-y-3">
    {data.map((region, index) => (
      <motion.div
        key={region.region}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`p-4 rounded-lg border ${
          theme === "dark"
            ? "bg-gray-750 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Country Flag Placeholder */}
            <div
              className={`w-8 h-6 rounded ${
                theme === "dark" ? "bg-gray-600" : "bg-gray-300"
              } flex items-center justify-center`}
            >
              <span className="text-xs font-bold">
                {region.region.substring(0, 2).toUpperCase()}
              </span>
            </div>

            <div>
              <div
                className={`font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {region.region}
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formatNumber(region.clicks)} clicks •{" "}
                {formatNumber(region.users)} users
              </div>
            </div>
          </div>

          <div className="text-right">
            <div
              className={`text-lg font-semibold ${getPerformanceColor(region.performance)}`}
            >
              {Math.round(region.performance)}%
            </div>
            <div
              className={`text-xs ${getPerformanceColor(region.performance)}`}
            >
              {getPerformanceBadge(region.performance)}
            </div>
          </div>
        </div>

        {/* Performance Progress Bar */}
        <div className="mt-3">
          <div
            className={`w-full h-2 rounded-full ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${region.performance}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`h-2 rounded-full ${
                region.performance >= 80
                  ? "bg-green-500"
                  : region.performance >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

/**
 * Empty state when no geographic data
 */
interface EmptyStateProps {
  theme: string;
}

const EmptyState: FC<EmptyStateProps> = ({ theme }) => (
  <div className="text-center py-12">
    <Globe
      className={`w-16 h-16 mx-auto mb-4 ${
        theme === "dark" ? "text-gray-600" : "text-gray-400"
      }`}
    />
    <h4
      className={`text-lg font-medium mb-2 ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}
    >
      No Geographic Data
    </h4>
    <p
      className={`text-sm ${
        theme === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      Regional performance data will appear here as users interact with your
      URLs
    </p>
  </div>
);

/**
 * Performance legend with color codes
 */
interface PerformanceLegendProps {
  theme: string;
}

const PerformanceLegend: FC<PerformanceLegendProps> = ({ theme }) => (
  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
    <div className="space-y-3">
      <h4
        className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
      >
        Performance Score Legend:
      </h4>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500 flex-shrink-0"></div>
          <span
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            80%+ Excellent
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500 flex-shrink-0"></div>
          <span
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            60-79% Good
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500 flex-shrink-0"></div>
          <span
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            &lt;60% Needs Improvement
          </span>
        </div>
      </div>
    </div>
  </div>
);
