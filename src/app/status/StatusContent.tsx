"use client";

import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import { Clock, RefreshCw } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { SystemOverview } from "@/components/status/SystemOverview";
import { ServiceStatus } from "@/components/status/ServiceStatus";
import { UptimeChart } from "@/components/status/UptimeChart";
import { IncidentHistory } from "@/components/status/IncidentHistory";
import { useMockDataNotification } from "@/components/common/MockDataNotification";

/**
 * Health status response from API
 */
interface HealthStatus {
  success: boolean;
  message: string;
  timestamp: string;
  environment: string;
}

/**
 * System status monitoring component
 * Displays real-time health status, service monitoring, and incident history
 */
const StatusContent: FC = () => {
  const { theme } = useTheme();
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { MockDataSystem } = useMockDataNotification(theme);

  /**
   * Fetches health status from SnapURL API
   */
  const fetchHealthStatus = async () => {
    try {
      setError(null);
      const response = await fetch(
        "https://snap-url-api-production.up.railway.app/health"
      );
      const data = await response.json();
      setHealthStatus(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch health status:", err);
      setError("Failed to fetch system status");
      // Set fallback status for offline scenario
      setHealthStatus({
        success: false,
        message: "Unable to connect to SnapURL API",
        timestamp: new Date().toISOString(),
        environment: "unknown",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sets up initial fetch and auto-refresh interval
   */
  useEffect(() => {
    fetchHealthStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Handles manual refresh button click
   */
  const handleRefresh = () => {
    setLoading(true);
    fetchHealthStatus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout
        title="System Status"
        description="Real-time status of SnapURL services and infrastructure"
      >
        {/* Header with refresh */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Clock
              className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            />
            <span
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 rounded-lg border transition-colors ${
              loading ? "animate-spin" : ""
            } ${
              theme === "dark"
                ? "border-gray-700 hover:bg-gray-800 text-gray-400"
                : "border-gray-300 hover:bg-gray-50 text-gray-600"
            }`}
            title="Refresh status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <MockDataSystem message="System status demo" position="bottom-right" />
        </div>

        {/* System Overview */}
        <SystemOverview
          healthStatus={healthStatus}
          loading={loading}
          error={error}
          theme={theme}
        />

        {/* Service Status Grid */}
        <div className="mb-8">
          <ServiceStatus
            apiHealthy={healthStatus?.success ?? false}
            loading={loading}
            theme={theme}
          />
        </div>

        {/* Uptime Chart */}
        <div className="mb-8">
          <UptimeChart
            apiHealthy={healthStatus?.success ?? false}
            theme={theme}
          />
        </div>

        {/* Incident History */}
        <div className="mb-8">
          <IncidentHistory theme={theme} />
        </div>

        {/* Footer */}
        <div
          className={`card p-4 text-center ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            For real-time updates and incident notifications, follow our status
            page or contact support.
          </p>
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default StatusContent;