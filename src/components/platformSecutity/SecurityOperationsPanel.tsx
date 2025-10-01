"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Trash2,
  UserX,
  Database,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
} from "lucide-react";
import { useComingSoon } from "@/hooks/useComingSoonModal";

interface CleanupOperation {
  id: string;
  type: "data_cleanup" | "user_deactivation" | "url_removal";
  timestamp: string;
  recordsAffected: number;
  status: "completed" | "pending" | "failed";
}

interface SecurityOperations {
  cleanupHistory: CleanupOperation[];
}

interface SecurityOperationsPanelProps {
  operations?: SecurityOperations;
  theme: string;
  loading?: boolean;
  isAdmin?: boolean;
}

/**
 * Security operations panel component
 * Provides administrative tools for security maintenance and cleanup operations
 * with operation history tracking and role-based access control
 */
export const SecurityOperationsPanel: FC<SecurityOperationsPanelProps> = ({
  operations,
  theme,
  loading = false,
  isAdmin = false,
}) => {
  const { showComingSoon } = useComingSoon();

  /**
   * Get icon component for operation type
   */
  const getOperationIcon = (type: string) => {
    switch (type) {
      case "data_cleanup":
        return Database;
      case "user_deactivation":
        return UserX;
      case "url_removal":
        return Trash2;
      default:
        return Settings;
    }
  };

  /**
   * Get human-readable label for operation type
   */
  const getOperationLabel = (type: string): string => {
    switch (type) {
      case "data_cleanup":
        return "Data Cleanup";
      case "user_deactivation":
        return "User Deactivation";
      case "url_removal":
        return "URL Removal";
      default:
        return type;
    }
  };

  /**
   * Get color class for operation status
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  /**
   * Get icon component for operation status
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  /**
   * Format timestamp to relative time
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center space-x-2 mb-6">
          <Settings className="w-6 h-6 text-green-500" />
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Security Operations
          </h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6 text-green-500" />
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Security Operations
          </h3>
        </div>
        {!isAdmin && (
          <span className="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
            Demo Mode
          </span>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h4
          className={`text-sm font-medium mb-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Quick Actions
        </h4>
        <div className="grid grid-cols-1 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showComingSoon("Cleanup Analytics Data")}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              theme === "dark"
                ? "border-gray-700 hover:bg-gray-750"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <div
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Cleanup Analytics Data
                </div>
                <div
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Remove old analytics records
                </div>
              </div>
            </div>
            <Play className="w-4 h-4 text-gray-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showComingSoon("Remove Suspicious URLs")}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              theme === "dark"
                ? "border-gray-700 hover:bg-gray-750"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-orange-500" />
              <div className="text-left">
                <div
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Remove Suspicious URLs
                </div>
                <div
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Clean flagged URL entries
                </div>
              </div>
            </div>
            <Play className="w-4 h-4 text-gray-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showComingSoon("Review Suspicious Users")}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              theme === "dark"
                ? "border-gray-700 hover:bg-gray-750"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <UserX className="w-5 h-5 text-red-500" />
              <div className="text-left">
                <div
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Review Suspicious Users
                </div>
                <div
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Audit flagged user accounts
                </div>
              </div>
            </div>
            <Play className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Operation History */}
      <div>
        <h4
          className={`text-sm font-medium mb-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Recent Operations
        </h4>

        {operations?.cleanupHistory && operations.cleanupHistory.length > 0 ? (
          <div className="space-y-3">
            {operations.cleanupHistory.map((operation) => {
              const OperationIcon = getOperationIcon(operation.type);
              const StatusIcon = getStatusIcon(operation.status);

              return (
                <div
                  key={operation.id}
                  className={`p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-750 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <OperationIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <div
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {getOperationLabel(operation.type)}
                        </div>
                        <div
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {operation.recordsAffected.toLocaleString()} records •{" "}
                          {formatTimeAgo(operation.timestamp)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <StatusIcon
                        className={`w-4 h-4 ${getStatusColor(operation.status)}`}
                      />
                      <span
                        className={`text-xs font-medium ${getStatusColor(operation.status)}`}
                      >
                        {operation.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={`text-center py-8 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Settings
              className={`w-12 h-12 mx-auto mb-3 ${
                theme === "dark" ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <p className="text-sm">No recent operations</p>
          </div>
        )}
      </div>

      {/* Warning for Non-Admin Users */}
      {!isAdmin && (
        <div
          className={`mt-6 p-3 rounded-lg border-yellow-200 dark:border-yellow-800 ${
            theme === "dark" ? "bg-yellow-900/10" : "bg-yellow-50"
          }`}
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <p
              className={`text-xs ${
                theme === "dark" ? "text-yellow-300" : "text-yellow-700"
              }`}
            >
              Operations are simulated in demo mode. Admin privileges required
              for actual execution.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
