"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { useComingSoon } from "@/hooks/useComingSoonModal";

interface IncidentHistoryProps {
  theme: string;
}

/**
 * Incident history component
 * Displays past system incidents with status, severity, and timeline information
 */
export const IncidentHistory: FC<IncidentHistoryProps> = ({ theme }) => {
  const incidents = [
    {
      id: "1",
      title: "Temporary API Rate Limiting",
      description:
        "Increased rate limiting was applied to prevent service overload during high traffic period.",
      status: "resolved",
      severity: "minor",
      startTime: "2025-09-10T14:30:00Z",
      endTime: "2025-09-10T15:45:00Z",
      duration: "1h 15m",
      affectedServices: ["API Gateway"],
    },
    {
      id: "2",
      title: "Database Maintenance",
      description:
        "Scheduled database maintenance completed successfully with minimal service impact.",
      status: "resolved",
      severity: "maintenance",
      startTime: "2025-09-08T02:00:00Z",
      endTime: "2025-09-08T03:30:00Z",
      duration: "1h 30m",
      affectedServices: ["Database", "Analytics Engine"],
    },
    {
      id: "3",
      title: "Redirect Service Degradation",
      description:
        "Some users experienced slower redirect times due to increased traffic load.",
      status: "resolved",
      severity: "minor",
      startTime: "2025-09-05T09:15:00Z",
      endTime: "2025-09-05T09:45:00Z",
      duration: "30m",
      affectedServices: ["URL Redirection"],
    },
  ];

  const { showComingSoon } = useComingSoon();

  /**
   * Get severity color class for text
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500";
      case "major":
        return "text-orange-500";
      case "minor":
        return "text-yellow-500";
      case "maintenance":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  /**
   * Get severity background color class
   */
  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 dark:bg-red-900/20";
      case "major":
        return "bg-orange-100 dark:bg-orange-900/20";
      case "minor":
        return "bg-yellow-100 dark:bg-yellow-900/20";
      case "maintenance":
        return "bg-blue-100 dark:bg-blue-900/20";
      default:
        return "bg-gray-100 dark:bg-gray-900/20";
    }
  };

  /**
   * Format ISO date string to readable format
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3
          className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Recent Incidents
        </h3>
        <button className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center space-x-1">
          <span onClick={() => showComingSoon()}>View All</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {incidents.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p
            className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            No recent incidents to report
          </p>
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            All systems have been running smoothly
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${getSeverityBg(incident.severity)}`}
                  >
                    {incident.status === "resolved" ? (
                      <CheckCircle className={`w-4 h-4 text-green-500`} />
                    ) : (
                      <AlertTriangle
                        className={`w-4 h-4 ${getSeverityColor(incident.severity)}`}
                      />
                    )}
                  </div>

                  <div>
                    <h4
                      className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      {incident.title}
                    </h4>
                    <p
                      className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}
                    >
                      {incident.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      incident.status === "resolved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {incident.status === "resolved" ? "Resolved" : "Ongoing"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <Clock
                    className={`w-3 h-3 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <span
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    {formatDate(incident.startTime)} -{" "}
                    {formatDate(incident.endTime)}
                  </span>
                </div>

                <span
                  className={`px-2 py-1 rounded ${getSeverityBg(incident.severity)} ${getSeverityColor(incident.severity)} font-medium`}
                >
                  {incident.severity}
                </span>

                <span
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }
                >
                  Duration: {incident.duration}
                </span>
              </div>

              <div className="mt-2">
                <span
                  className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                >
                  Affected: {incident.affectedServices.join(", ")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
