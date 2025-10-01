"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Zap,
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface SystemHealthProps {
  performance?: {
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
    requestsPerMinute: number;
  };
  theme: string;
  loading?: boolean;
}

interface HealthStatus {
  status: string;
  color: string;
  icon: typeof CheckCircle;
}

/**
 * System health monitoring card with real-time metrics
 * Features health status indicators and performance monitoring
 */
export const SystemHealthCard: FC<SystemHealthProps> = ({
  performance,
  theme,
  loading = false,
}) => {
  /**
   * Determine health status based on performance metrics
   */
  const getHealthStatus = (): HealthStatus => {
    if (!performance)
      return { status: "unknown", color: "gray", icon: Activity };

    const { errorRate, uptime, averageResponseTime } = performance;

    if (errorRate > 5 || uptime < 95 || averageResponseTime > 1000) {
      return { status: "critical", color: "red", icon: XCircle };
    }

    if (errorRate > 1 || uptime < 99 || averageResponseTime > 500) {
      return { status: "warning", color: "yellow", icon: AlertTriangle };
    }

    return { status: "healthy", color: "green", icon: CheckCircle };
  };

  /**
   * Format uptime percentage
   */
  const formatUptime = (uptime: number): string => {
    return `${uptime.toFixed(2)}%`;
  };

  /**
   * Format response time in milliseconds
   */
  const formatResponseTime = (time: number): string => {
    return `${time}ms`;
  };

  /**
   * Format error rate as percentage
   */
  const formatErrorRate = (rate: number): string => {
    return `${(rate * 100).toFixed(3)}%`;
  };

  /**
   * Format requests per minute with K suffix
   */
  const formatRPM = (rpm: number): string => {
    if (rpm >= 1000) {
      return `${(rpm / 1000).toFixed(1)}k/min`;
    }
    return `${rpm}/min`;
  };

  const healthStatus = getHealthStatus();
  const StatusIcon = healthStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Header */}
      <HealthHeader
        theme={theme}
        healthStatus={healthStatus}
        StatusIcon={StatusIcon}
        loading={loading}
      />

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Shield}
          iconColor="text-green-500"
          label="Uptime"
          value={
            loading
              ? "..."
              : performance
                ? formatUptime(performance.uptime)
                : "N/A"
          }
          subtitle="Last 30 days"
          theme={theme}
        />

        <MetricCard
          icon={Zap}
          iconColor="text-blue-500"
          label="Response Time"
          value={
            loading
              ? "..."
              : performance
                ? formatResponseTime(performance.averageResponseTime)
                : "N/A"
          }
          subtitle="Average"
          theme={theme}
        />

        <MetricCard
          icon={AlertTriangle}
          iconColor="text-orange-500"
          label="Error Rate"
          value={
            loading
              ? "..."
              : performance
                ? formatErrorRate(performance.errorRate)
                : "N/A"
          }
          subtitle="Last 24h"
          theme={theme}
        />

        <MetricCard
          icon={Activity}
          iconColor="text-purple-500"
          label="Requests"
          value={
            loading
              ? "..."
              : performance
                ? formatRPM(performance.requestsPerMinute)
                : "N/A"
          }
          subtitle="Current rate"
          theme={theme}
        />
      </div>

      {/* Status Summary */}
      <StatusSummary
        theme={theme}
        healthStatus={healthStatus}
        loading={loading}
      />
    </motion.div>
  );
};

/**
 * Health header section with icon and title
 */
interface HealthHeaderProps {
  theme: string;
  healthStatus: HealthStatus;
  StatusIcon: typeof CheckCircle;
  loading: boolean;
}

const HealthHeader: FC<HealthHeaderProps> = ({
  theme,
  healthStatus,
  StatusIcon,
  loading,
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-3">
      <div
        className={`p-3 rounded-lg ${
          theme === "dark" ? "bg-blue-900/20" : "bg-blue-100"
        }`}
      >
        <Server className="w-6 h-6 text-blue-500" />
      </div>
      <div>
        <h3
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          System Health
        </h3>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Real-time platform status
        </p>
      </div>
    </div>

    {/* Health Status Indicator */}
    <div className="flex items-center space-x-2">
      <StatusIcon className={`w-6 h-6 text-${healthStatus.color}-500`} />
      <span
        className={`text-sm font-medium capitalize text-${healthStatus.color}-500`}
      >
        {loading ? "Checking..." : healthStatus.status}
      </span>
    </div>
  </div>
);

/**
 * Individual metric card component
 */
interface MetricCardProps {
  icon: typeof Shield;
  iconColor: string;
  label: string;
  value: string;
  subtitle: string;
  theme: string;
}

const MetricCard: FC<MetricCardProps> = ({
  icon: Icon,
  iconColor,
  label,
  value,
  subtitle,
  theme,
}) => (
  <div
    className={`p-4 rounded-lg border ${
      theme === "dark"
        ? "bg-gray-750 border-gray-700"
        : "bg-gray-50 border-gray-200"
    }`}
  >
    <div className="flex items-center space-x-2 mb-2">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span
        className={`text-sm font-medium ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </div>
    <div
      className={`text-xl font-bold ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}
    >
      {value}
    </div>
    <div
      className={`text-xs ${
        theme === "dark" ? "text-gray-500" : "text-gray-400"
      }`}
    >
      {subtitle}
    </div>
  </div>
);

/**
 * Status summary section
 */
interface StatusSummaryProps {
  theme: string;
  healthStatus: HealthStatus;
  loading: boolean;
}

const StatusSummary: FC<StatusSummaryProps> = ({
  theme,
  healthStatus,
  loading,
}) => {
  const getStatusMessage = (): string => {
    if (loading) return "Checking system health...";

    switch (healthStatus.status) {
      case "healthy":
        return "All systems operational";
      case "warning":
        return "Minor issues detected";
      case "critical":
        return "Critical issues detected";
      default:
        return "System status unknown";
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <span
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          System Status:
        </span>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full bg-${healthStatus.color}-500 ${
              healthStatus.status === "healthy" ? "animate-pulse" : ""
            }`}
          />
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {getStatusMessage()}
          </span>
        </div>
      </div>
    </div>
  );
};
