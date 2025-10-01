"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { UserX, Clock, Eye, MoreVertical } from "lucide-react";
import { useComingSoon } from "@/hooks/useComingSoonModal";

interface SuspiciousActivity {
  id: string;
  userId: string;
  activity: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
  details: string;
}

interface SuspiciousActivityListProps {
  activities?: SuspiciousActivity[];
  theme: string;
  loading?: boolean;
}

/**
 * Suspicious activity list component
 * Displays detected suspicious user behaviors for investigation with
 * severity-based categorization and action buttons
 */
export const SuspiciousActivityList: FC<SuspiciousActivityListProps> = ({
  activities = [],
  theme,
  loading = false,
}) => {
  const { showComingSoon } = useComingSoon();

  /**
   * Get color class for activity severity level
   */
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-100 dark:bg-red-900/20";
      case "medium":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
      case "low":
        return "text-green-500 bg-green-100 dark:bg-green-900/20";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800";
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center space-x-2 mb-6">
          <UserX className="w-6 h-6 text-blue-500" />
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Suspicious Activity
          </h3>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
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
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <UserX className="w-6 h-6 text-blue-500" />
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Suspicious Activity
          </h3>
        </div>
        <span
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {activities.length} detected
        </span>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                theme === "dark"
                  ? "bg-gray-750 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      activity.severity === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : activity.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    }`}
                  >
                    {activity.userId.slice(-2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {activity.activity}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(activity.severity)}`}
                      >
                        {activity.severity.toUpperCase()}
                      </span>
                    </div>

                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } mb-2`}
                    >
                      User: {activity.userId}
                    </p>

                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {activity.details}
                    </p>

                    <div className="flex items-center space-x-1 mt-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                    onClick={() => showComingSoon()}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                    onClick={() => showComingSoon()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UserX
            className={`w-16 h-16 mx-auto mb-4 ${
              theme === "dark" ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <h4
            className={`text-lg font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No Suspicious Activity
          </h4>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            All user behavior appears normal
          </p>
        </div>
      )}

      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-lg font-semibold text-red-500`}>
                {activities.filter((a) => a.severity === "high").length}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                High Risk
              </div>
            </div>
            <div>
              <div className={`text-lg font-semibold text-yellow-500`}>
                {activities.filter((a) => a.severity === "medium").length}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Medium Risk
              </div>
            </div>
            <div>
              <div className={`text-lg font-semibold text-green-500`}>
                {activities.filter((a) => a.severity === "low").length}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Low Risk
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
