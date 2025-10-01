"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface ActivityItem {
  type: "click" | "create" | "update" | "delete";
  timestamp: string;
  location?: string;
  device?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  theme: string;
}

/**
 * Recent activity component for displaying user actions timeline
 * Shows a chronological list of user activities with icons and timestamps
 */
export const RecentActivity: FC<RecentActivityProps> = ({
  activities,
  theme,
}) => {
  /**
   * Get appropriate icon for different activity types
   */
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case "click":
        return "👆";
      case "create":
        return "✨";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      default:
        return "📊";
    }
  };

  /**
   * Generate human-readable text for activity items
   */
  const getActivityText = (activity: ActivityItem): string => {
    switch (activity.type) {
      case "click":
        return `Click from ${activity.location || "Unknown location"}`;
      case "create":
        return "New URL created";
      case "update":
        return "URL updated";
      case "delete":
        return "URL deleted";
      default:
        return "Unknown activity";
    }
  };

  /**
   * Format timestamp to relative time (e.g., "2h ago", "Just now")
   */
  const formatTime = (timestamp: string): string => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - activityTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Card header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Recent Activity
        </h3>
      </div>

      {/* Activity list */}
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <ActivityItem
              key={index}
              activity={activity}
              theme={theme}
              getActivityIcon={getActivityIcon}
              getActivityText={getActivityText}
              formatTime={formatTime}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Individual activity item component
 * Displays a single activity with icon, description, and metadata
 */
interface ActivityItemComponentProps {
  activity: ActivityItem;
  theme: string;
  getActivityIcon: (type: string) => string;
  getActivityText: (activity: ActivityItem) => string;
  formatTime: (timestamp: string) => string;
}

const ActivityItem: FC<ActivityItemComponentProps> = ({
  activity,
  theme,
  getActivityIcon,
  getActivityText,
  formatTime,
}) => {
  return (
    <div className="flex items-start space-x-3">
      {/* Activity icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
        <span className="text-sm">{getActivityIcon(activity.type)}</span>
      </div>

      {/* Activity details */}
      <div className="flex-1 min-w-0">
        {/* Activity description */}
        <p
          className={`text-sm ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {getActivityText(activity)}
        </p>

        {/* Activity metadata (timestamp and device) */}
        <div className="flex items-center space-x-2 mt-1">
          <span
            className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {formatTime(activity.timestamp)}
          </span>

          {/* Device info if available */}
          {activity.device && (
            <>
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                •
              </span>
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {activity.device}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
