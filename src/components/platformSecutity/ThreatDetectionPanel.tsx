"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  Activity,
  Clock,
  MapPin,
  Zap,
} from "lucide-react";

interface Threat {
  id: string;
  type: "bruteforce" | "api_abuse" | "suspicious_url" | "rate_limit_violation";
  severity: "low" | "medium" | "high" | "critical";
  source: string;
  target: string;
  timestamp: string;
  status: "active" | "mitigated" | "investigating";
}

interface ThreatDetectionPanelProps {
  threats?: Threat[];
  theme: string;
  loading?: boolean;
}

/**
 * Threat detection panel component with responsive design
 * Displays current security threats with real-time monitoring indicators,
 * severity classification, and mobile-optimized layout
 */
export const ThreatDetectionPanel: FC<ThreatDetectionPanelProps> = ({
  threats = [],
  theme,
  loading = false,
}) => {
  /**
   * Get threat type display information and styling
   */
  const getThreatTypeInfo = (type: string) => {
    const typeMap = {
      bruteforce: { label: "Brute Force", icon: Shield, color: "text-red-500" },
      api_abuse: { label: "API Abuse", icon: Zap, color: "text-orange-500" },
      suspicious_url: {
        label: "Suspicious URL",
        icon: Activity,
        color: "text-yellow-500",
      },
      rate_limit_violation: {
        label: "Rate Limit",
        icon: Clock,
        color: "text-purple-500",
      },
    };
    return (
      typeMap[type as keyof typeof typeMap] || {
        label: type,
        icon: AlertTriangle,
        color: "text-gray-500",
      }
    );
  };

  /**
   * Get color class for threat severity level
   */
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "high":
        return "text-red-500 bg-red-50 dark:bg-red-900/10";
      case "medium":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/10";
      case "low":
        return "text-green-500 bg-green-50 dark:bg-green-900/10";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-800";
    }
  };

  /**
   * Get color class for threat status
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "text-red-500";
      case "investigating":
        return "text-yellow-500";
      case "mitigated":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  /**
   * Format timestamp to relative time display
   */
  const formatTimeAgo = (isoString: string): string => {
    const now = new Date();
    const time = new Date(isoString);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  /**
   * Truncate long strings for mobile display
   */
  const truncateString = (str: string, maxLength: number = 20): string => {
    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`card p-4 sm:p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center space-x-2 mb-4 sm:mb-6">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          <h3
            className={`text-base sm:text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Threat Detection
          </h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex items-center space-x-3 sm:space-x-4"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-4 sm:p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          <h3
            className={`text-base sm:text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Threat Detection
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              threats.length > 0 ? "bg-red-500 animate-pulse" : "bg-green-500"
            }`}
          />
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {threats.length} active
          </span>
        </div>
      </div>

      {threats.length > 0 ? (
        <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
          {threats.map((threat, index) => {
            const typeInfo = getThreatTypeInfo(threat.type);
            const TypeIcon = typeInfo.icon;

            return (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 sm:p-4 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-750 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  <div className="flex items-start space-x-3 mb-3">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        threat.severity === "critical"
                          ? "bg-red-100 dark:bg-red-900/20"
                          : threat.severity === "high"
                            ? "bg-orange-100 dark:bg-orange-900/20"
                            : threat.severity === "medium"
                              ? "bg-yellow-100 dark:bg-yellow-900/20"
                              : "bg-green-100 dark:bg-green-900/20"
                      }`}
                    >
                      <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-medium text-sm ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {typeInfo.label}
                        </h4>
                        <span
                          className={`text-xs font-medium ${getStatusColor(threat.status)}`}
                        >
                          {threat.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityColor(threat.severity)}`}
                        >
                          {threat.severity.toUpperCase()}
                        </span>
                        <span
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {formatTimeAgo(threat.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile threat details */}
                  <div className="space-y-1 pl-11">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span
                        className={`text-xs truncate ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                      >
                        From: {truncateString(threat.source, 15)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span
                        className={`text-xs truncate ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Target: {truncateString(threat.target, 15)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        threat.severity === "critical"
                          ? "bg-red-100 dark:bg-red-900/20"
                          : threat.severity === "high"
                            ? "bg-orange-100 dark:bg-orange-900/20"
                            : threat.severity === "medium"
                              ? "bg-yellow-100 dark:bg-yellow-900/20"
                              : "bg-green-100 dark:bg-green-900/20"
                      }`}
                    >
                      <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Threat Header */}
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {typeInfo.label}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(threat.severity)}`}
                          >
                            {threat.severity.toUpperCase()}
                          </span>
                          <span
                            className={`text-xs font-medium ${getStatusColor(threat.status)}`}
                          >
                            {threat.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Threat Details */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span
                              className={
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            >
                              From: {threat.source}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="w-3 h-3 text-gray-400" />
                            <span
                              className={
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            >
                              Target: {threat.target}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-gray-500"
                                : "text-gray-500"
                            }`}
                          >
                            Detected: {formatTimeAgo(threat.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <Shield
            className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${
              theme === "dark" ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <h4
            className={`text-base sm:text-lg font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No Active Threats
          </h4>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            All systems secure. No threats detected in the current monitoring
            window.
          </p>
        </div>
      )}

      {/* Threat Summary - Responsive Grid */}
      {threats.length > 0 && (
        <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div>
              <div
                className={`text-base sm:text-lg font-semibold text-red-500`}
              >
                {threats.filter((t) => t.severity === "critical").length}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Critical
              </div>
            </div>
            <div>
              <div
                className={`text-base sm:text-lg font-semibold text-orange-500`}
              >
                {threats.filter((t) => t.severity === "high").length}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                High
              </div>
            </div>
            <div>
              <div
                className={`text-base sm:text-lg font-semibold text-yellow-500`}
              >
                {threats.filter((t) => t.severity === "medium").length}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Medium
              </div>
            </div>
            <div>
              <div
                className={`text-base sm:text-lg font-semibold text-green-500`}
              >
                {threats.filter((t) => t.severity === "low").length}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Low
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
