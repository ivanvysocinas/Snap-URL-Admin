"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  UserX,
  Settings,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface SecurityOverview {
  totalThreats: number;
  blockedAttempts: number;
  suspiciousUsers: number;
  cleanupOperations: number;
  securityScore: number; // 0-100
  lastIncident: string | null;
}

interface SecurityOverviewGridProps {
  overview?: SecurityOverview;
  theme: string;
  loading?: boolean;
}

/**
 * Security overview grid component
 * Displays key security metrics and overall platform security health with
 * visual indicators, trends, and status assessment
 */
export const SecurityOverviewGrid: FC<SecurityOverviewGridProps> = ({
  overview,
  theme,
  loading = false,
}) => {
  /**
   * Format number with appropriate units for display
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  /**
   * Get security score status based on numerical score
   */
  const getSecurityStatus = (
    score: number
  ): { text: string; color: string } => {
    if (score >= 90) return { text: "Excellent", color: "text-green-500" };
    if (score >= 80) return { text: "Good", color: "text-green-500" };
    if (score >= 70) return { text: "Fair", color: "text-yellow-500" };
    if (score >= 60) return { text: "Warning", color: "text-orange-500" };
    return { text: "Critical", color: "text-red-500" };
  };

  /**
   * Format timestamp to relative time display
   */
  const formatTimeAgo = (isoString: string): string => {
    const now = new Date();
    const time = new Date(isoString);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  /**
   * Security metric card component with trend indicators
   */
  const SecurityCard: FC<{
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    description: string;
    trend?: number;
  }> = ({ title, value, icon: Icon, color, description, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-lg ${
            color === "red"
              ? "bg-red-100 dark:bg-red-900/20"
              : color === "orange"
                ? "bg-orange-100 dark:bg-orange-900/20"
                : color === "blue"
                  ? "bg-blue-100 dark:bg-blue-900/20"
                  : color === "green"
                    ? "bg-green-100 dark:bg-green-900/20"
                    : "bg-gray-100 dark:bg-gray-700"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              color === "red"
                ? "text-red-500"
                : color === "orange"
                  ? "text-orange-500"
                  : color === "blue"
                    ? "text-blue-500"
                    : color === "green"
                      ? "text-green-500"
                      : "text-gray-500"
            }`}
          />
        </div>

        {trend !== undefined && (
          <div
            className={`flex items-center space-x-1 text-sm ${
              trend >= 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-medium">
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {loading ? "..." : value}
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

  if (!overview && !loading) {
    return (
      <div
        className={`card p-8 text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <Shield
          className={`w-12 h-12 mx-auto mb-4 ${
            theme === "dark" ? "text-gray-600" : "text-gray-400"
          }`}
        />
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          No security data available
        </p>
      </div>
    );
  }

  const securityStatus = overview
    ? getSecurityStatus(overview.securityScore)
    : { text: "Unknown", color: "text-gray-500" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-red-500" />
          <h2
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Security Overview
          </h2>
        </div>

        {overview && (
          <div className="text-right">
            <div className={`text-lg font-bold ${securityStatus.color}`}>
              {overview.securityScore}/100
            </div>
            <div className={`text-sm ${securityStatus.color}`}>
              {securityStatus.text}
            </div>
          </div>
        )}
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Threats */}
        <SecurityCard
          title="Active Threats"
          value={overview ? formatNumber(overview.totalThreats) : 0}
          icon={AlertTriangle}
          color="red"
          description="Current security threats detected"
          {...(overview && overview.totalThreats > 0 && { trend: 15 })}
          {...(overview && overview.totalThreats === 0 && { trend: -5 })}
        />

        {/* Blocked Attempts */}
        <SecurityCard
          title="Blocked Attempts"
          value={overview ? formatNumber(overview.blockedAttempts) : 0}
          icon={Shield}
          color="orange"
          description="Malicious attempts blocked"
          {...(overview && { trend: 8 })}
        />

        {/* Suspicious Users */}
        <SecurityCard
          title="Suspicious Users"
          value={overview ? formatNumber(overview.suspiciousUsers) : 0}
          icon={UserX}
          color="blue"
          description="Users flagged for review"
          {...(overview && { trend: -2 })}
        />

        {/* Cleanup Operations */}
        <SecurityCard
          title="Cleanup Operations"
          value={overview ? formatNumber(overview.cleanupOperations) : 0}
          icon={Settings}
          color="green"
          description="Completed maintenance tasks"
        />
      </div>

      {/* Security Score Progress */}
      {overview && (
        <div
          className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Overall Security Health
            </h3>
            <span className={`text-2xl font-bold ${securityStatus.color}`}>
              {overview.securityScore}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            className={`w-full h-3 rounded-full ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            } mb-4`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overview.securityScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-3 rounded-full ${
                overview.securityScore >= 90
                  ? "bg-green-500"
                  : overview.securityScore >= 80
                    ? "bg-green-500"
                    : overview.securityScore >= 70
                      ? "bg-yellow-500"
                      : overview.securityScore >= 60
                        ? "bg-orange-500"
                        : "bg-red-500"
              }`}
            />
          </div>

          {/* Security Status Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Security Status
              </div>
              <div className={`text-lg font-semibold ${securityStatus.color}`}>
                {securityStatus.text}
              </div>
            </div>

            <div>
              <div
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Last Incident
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {overview.lastIncident
                  ? formatTimeAgo(overview.lastIncident)
                  : "No recent incidents"}
              </div>
            </div>

            <div>
              <div
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Threat Level
              </div>
              <div
                className={`text-sm font-medium ${
                  overview.totalThreats === 0
                    ? "text-green-500"
                    : overview.totalThreats < 3
                      ? "text-yellow-500"
                      : "text-red-500"
                }`}
              >
                {overview.totalThreats === 0
                  ? "Low"
                  : overview.totalThreats < 3
                    ? "Medium"
                    : "High"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Recommendations */}
      {overview && overview.securityScore < 90 && (
        <div
          className={`card p-4 border-yellow-200 dark:border-yellow-800 ${
            theme === "dark" ? "bg-yellow-900/10" : "bg-yellow-50"
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h4
              className={`font-medium ${
                theme === "dark" ? "text-yellow-200" : "text-yellow-800"
              }`}
            >
              Security Recommendations
            </h4>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-yellow-300" : "text-yellow-700"
            }`}
          >
            {overview.securityScore < 70
              ? "Multiple security issues detected. Immediate attention required."
              : "Some security improvements needed. Review suspicious activities and strengthen monitoring."}
          </p>
        </div>
      )}
    </div>
  );
};
