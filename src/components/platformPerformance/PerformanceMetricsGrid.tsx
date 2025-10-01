"use client";

import { FC, ElementType } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Zap,
  Activity,
  Users,
  Database,
  TrendingUp,
} from "lucide-react";

interface PerformanceMetrics {
  averageResponseTime: number;
  requestsPerMinute: number;
  errorRate: number;
  throughput: number;
  activeConnections: number;
  cacheHitRate: number;
}

interface PerformanceMetricsGridProps {
  metrics?: PerformanceMetrics;
  theme: string;
  loading?: boolean;
}

/**
 * Performance metrics grid with system health indicators
 * Displays response times, throughput, error rates, and cache performance
 */
export const PerformanceMetricsGrid: FC<PerformanceMetricsGridProps> = ({
  metrics,
  theme,
  loading = false,
}) => {
  /**
   * Format metric values with appropriate units
   */
  const formatMetric = (
    value: number,
    type: "time" | "rate" | "count" | "percentage"
  ): string => {
    switch (type) {
      case "time":
        return `${Math.round(value)}ms`;
      case "rate":
        return value < 1000
          ? `${Math.round(value)}`
          : `${(value / 1000).toFixed(1)}k`;
      case "count":
        return value < 1000
          ? `${Math.round(value)}`
          : `${(value / 1000).toFixed(1)}k`;
      case "percentage":
        return `${(value * 100).toFixed(1)}%`;
      default:
        return value.toString();
    }
  };

  /**
   * Get status color based on metric performance
   */
  const getStatusColor = (
    value: number,
    type: "responseTime" | "errorRate" | "cacheHit"
  ): string => {
    switch (type) {
      case "responseTime":
        if (value < 100) return "text-green-500";
        if (value < 200) return "text-yellow-500";
        return "text-red-500";
      case "errorRate":
        if (value < 0.01) return "text-green-500";
        if (value < 0.05) return "text-yellow-500";
        return "text-red-500";
      case "cacheHit":
        if (value > 0.9) return "text-green-500";
        if (value > 0.8) return "text-yellow-500";
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (!metrics && !loading) {
    return <EmptyState theme={theme} />;
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-6 h-6 text-blue-500" />
        <h2
          className={`text-xl font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Performance Metrics
        </h2>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Avg Response Time"
          value={metrics?.averageResponseTime || 0}
          format="time"
          icon={Clock}
          color="blue"
          status="responseTime"
          description="API endpoint response time"
          theme={theme}
          loading={loading}
          formatMetric={formatMetric}
          getStatusColor={getStatusColor}
        />

        <MetricCard
          title="Requests/Min"
          value={metrics?.requestsPerMinute || 0}
          format="rate"
          icon={Activity}
          color="green"
          description="Current request rate"
          theme={theme}
          loading={loading}
          formatMetric={formatMetric}
          getStatusColor={getStatusColor}
        />

        <MetricCard
          title="Error Rate"
          value={metrics?.errorRate || 0}
          format="percentage"
          icon={TrendingUp}
          color="red"
          status="errorRate"
          description="Failed requests percentage"
          theme={theme}
          loading={loading}
          formatMetric={formatMetric}
          getStatusColor={getStatusColor}
        />

        <MetricCard
          title="Throughput"
          value={metrics?.throughput || 0}
          format="count"
          icon={Zap}
          color="purple"
          description="Requests per hour"
          theme={theme}
          loading={loading}
          formatMetric={formatMetric}
          getStatusColor={getStatusColor}
        />

        <MetricCard
          title="Active Connections"
          value={metrics?.activeConnections || 0}
          format="count"
          icon={Users}
          color="orange"
          description="Current active connections"
          theme={theme}
          loading={loading}
          formatMetric={formatMetric}
          getStatusColor={getStatusColor}
        />

        <MetricCard
          title="Cache Hit Rate"
          value={metrics?.cacheHitRate || 0}
          format="percentage"
          icon={Database}
          color="teal"
          status="cacheHit"
          description="Cache efficiency percentage"
          theme={theme}
          loading={loading}
          formatMetric={formatMetric}
          getStatusColor={getStatusColor}
        />
      </div>

      {/* Performance Summary */}
      {metrics && (
        <PerformanceSummary
          metrics={metrics}
          theme={theme}
          formatMetric={formatMetric}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
};

/**
 * Individual metric card component
 */
interface MetricCardProps {
  title: string;
  value: number;
  format: "time" | "rate" | "count" | "percentage";
  icon: ElementType;
  color: string;
  status?: "responseTime" | "errorRate" | "cacheHit";
  description: string;
  theme: string;
  loading: boolean;
  formatMetric: (
    value: number,
    type: "time" | "rate" | "count" | "percentage"
  ) => string;
  getStatusColor: (
    value: number,
    type: "responseTime" | "errorRate" | "cacheHit"
  ) => string;
}

const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  format,
  icon: Icon,
  color,
  status,
  description,
  theme,
  loading,
  formatMetric,
  getStatusColor,
}) => {
  const getStatusText = (): string => {
    if (!status) return "";

    switch (status) {
      case "responseTime":
        if (value < 100) return "Excellent";
        if (value < 200) return "Good";
        return "Slow";
      case "errorRate":
        if (value < 0.01) return "Excellent";
        if (value < 0.05) return "Warning";
        return "Critical";
      case "cacheHit":
        if (value > 0.9) return "Excellent";
        if (value > 0.8) return "Good";
        return "Poor";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-lg ${
            color === "blue"
              ? "bg-blue-100 dark:bg-blue-900/20"
              : color === "green"
                ? "bg-green-100 dark:bg-green-900/20"
                : color === "red"
                  ? "bg-red-100 dark:bg-red-900/20"
                  : color === "purple"
                    ? "bg-purple-100 dark:bg-purple-900/20"
                    : color === "orange"
                      ? "bg-orange-100 dark:bg-orange-900/20"
                      : color === "teal"
                        ? "bg-teal-100 dark:bg-teal-900/20"
                        : "bg-gray-100 dark:bg-gray-700"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              color === "blue"
                ? "text-blue-500"
                : color === "green"
                  ? "text-green-500"
                  : color === "red"
                    ? "text-red-500"
                    : color === "purple"
                      ? "text-purple-500"
                      : color === "orange"
                        ? "text-orange-500"
                        : color === "teal"
                          ? "text-teal-500"
                          : "text-gray-500"
            }`}
          />
        </div>

        {status && (
          <div
            className={`text-xs font-medium ${getStatusColor(value, status)}`}
          >
            {getStatusText()}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {loading ? "..." : formatMetric(value, format)}
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
          {description}
        </p>
      </div>
    </motion.div>
  );
};

/**
 * Performance summary section with detailed analysis
 */
interface PerformanceSummaryProps {
  metrics: PerformanceMetrics;
  theme: string;
  formatMetric: (
    value: number,
    type: "time" | "rate" | "count" | "percentage"
  ) => string;
  getStatusColor: (
    value: number,
    type: "responseTime" | "errorRate" | "cacheHit"
  ) => string;
}

const PerformanceSummary: FC<PerformanceSummaryProps> = ({
  metrics,
  theme,
  formatMetric,
  getStatusColor,
}) => (
  <div className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
    <h3
      className={`text-lg font-semibold mb-4 ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}
    >
      Performance Summary
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* System Health */}
      <div className="space-y-2">
        <div
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          System Health
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              Response Time:
            </span>
            <span
              className={getStatusColor(
                metrics.averageResponseTime,
                "responseTime"
              )}
            >
              {metrics.averageResponseTime < 100
                ? "Excellent"
                : metrics.averageResponseTime < 200
                  ? "Good"
                  : "Needs Attention"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              Error Rate:
            </span>
            <span className={getStatusColor(metrics.errorRate, "errorRate")}>
              {metrics.errorRate < 0.01
                ? "Excellent"
                : metrics.errorRate < 0.05
                  ? "Warning"
                  : "Critical"}
            </span>
          </div>
        </div>
      </div>

      {/* Load Status */}
      <div className="space-y-2">
        <div
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Load Status
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              Current Load:
            </span>
            <span
              className={`font-medium ${
                metrics.requestsPerMinute < 500
                  ? "text-green-500"
                  : metrics.requestsPerMinute < 1000
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            >
              {metrics.requestsPerMinute < 500
                ? "Low"
                : metrics.requestsPerMinute < 1000
                  ? "Medium"
                  : "High"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              Connections:
            </span>
            <span
              className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
            >
              {formatMetric(metrics.activeConnections, "count")} active
            </span>
          </div>
        </div>
      </div>

      {/* Efficiency */}
      <div className="space-y-2">
        <div
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Efficiency
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              Cache Performance:
            </span>
            <span className={getStatusColor(metrics.cacheHitRate, "cacheHit")}>
              {formatMetric(metrics.cacheHitRate, "percentage")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              Throughput:
            </span>
            <span
              className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
            >
              {formatMetric(metrics.throughput, "count")}/hr
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Empty state when no metrics available
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
      No performance metrics available
    </p>
  </div>
);
