"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Server,
  Globe,
  Database,
  Zap,
} from "lucide-react";

interface ServiceStatusProps {
  apiHealthy: boolean;
  loading: boolean;
  theme: string;
}

/**
 * Service status component
 * Displays operational status of individual system services with uptime percentages
 * and visual status indicators based on API health
 */
export const ServiceStatus: FC<ServiceStatusProps> = ({
  apiHealthy,
  theme,
}) => {
  const services = [
    {
      name: "API Gateway",
      icon: Server,
      status: apiHealthy ? "operational" : "degraded",
      description: "Main API endpoints and authentication",
      uptime: "99.98%",
    },
    {
      name: "URL Redirection",
      icon: Globe,
      status: apiHealthy ? "operational" : "degraded",
      description: "Short URL redirects and tracking",
      uptime: "99.99%",
    },
    {
      name: "Database",
      icon: Database,
      status: apiHealthy ? "operational" : "degraded",
      description: "Data storage and retrieval",
      uptime: "99.97%",
    },
    {
      name: "Analytics Engine",
      icon: Zap,
      status: apiHealthy ? "operational" : "degraded",
      description: "Click tracking and analytics processing",
      uptime: "99.95%",
    },
  ];

  /**
   * Get color class for service status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-500";
      case "degraded":
        return "text-yellow-500";
      case "outage":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  /**
   * Get icon component for service status
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return CheckCircle;
      case "degraded":
      case "outage":
        return XCircle;
      default:
        return CheckCircle;
    }
  };

  /**
   * Get human-readable status text
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Operational";
      case "degraded":
        return "Degraded Performance";
      case "outage":
        return "Service Outage";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
      >
        Service Status
      </h3>

      <div className="space-y-4">
        {services.map((service, index) => {
          const StatusIcon = getStatusIcon(service.status);
          const statusColor = getStatusColor(service.status);

          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    service.status === "operational"
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-red-100 dark:bg-red-900/20"
                  }`}
                >
                  <service.icon className={`w-5 h-5 ${statusColor}`} />
                </div>

                <div>
                  <h4
                    className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {service.name}
                  </h4>
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                  <span className={`text-sm font-medium ${statusColor}`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
                <p
                  className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                >
                  {service.uptime} uptime
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
