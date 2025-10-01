"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader } from "lucide-react";

interface SystemOverviewProps {
  healthStatus: {
    success: boolean;
    message: string;
    timestamp: string;
    environment: string;
  } | null;
  loading: boolean;
  error: string | null;
  theme: string;
}

/**
 * System overview component
 * Displays high-level system health status with environment info and last check timestamp
 */
export const SystemOverview: FC<SystemOverviewProps> = ({
  healthStatus,
  loading,
  error,
  theme,
}) => {
  /**
   * Get status display configuration based on current state
   */
  const getStatusDisplay = () => {
    if (loading) {
      return {
        icon: Loader,
        text: "Checking System Status...",
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
        description: "Please wait while we check all services",
      };
    }

    if (error || !healthStatus) {
      return {
        icon: XCircle,
        text: "Unable to Check Status",
        color: "text-red-500",
        bgColor: "bg-red-100 dark:bg-red-900/20",
        description: "Connection to monitoring services failed",
      };
    }

    if (healthStatus.success) {
      return {
        icon: CheckCircle,
        text: "All Systems Operational",
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900/20",
        description: "All SnapURL services are running normally",
      };
    }

    return {
      icon: XCircle,
      text: "Service Disruption Detected",
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      description: "Some services may be experiencing issues",
    };
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`card p-8 text-center mb-8 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${statusDisplay.bgColor}`}
      >
        <StatusIcon
          className={`w-8 h-8 ${statusDisplay.color} ${loading ? "animate-spin" : ""}`}
        />
      </div>

      <h2 className={`text-2xl font-bold mb-2 ${statusDisplay.color}`}>
        {statusDisplay.text}
      </h2>

      <p
        className={`text-lg mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
      >
        {statusDisplay.description}
      </p>

      {healthStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div
            className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <h4
              className={`font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Environment
            </h4>
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              {healthStatus.environment}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <h4
              className={`font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              API Status
            </h4>
            <p
              className={`text-sm ${healthStatus.success ? "text-green-500" : "text-red-500"}`}
            >
              {healthStatus.success ? "Healthy" : "Unhealthy"}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <h4
              className={`font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Last Check
            </h4>
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              {new Date(healthStatus.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
