"use client";

import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertCircle } from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/api";
import { LoginAttemptsChart } from "@/components/platformSecutity/LoginAttemptsChart";
import { SuspiciousActivityList } from "@/components/platformSecutity/SuspiciousActivityList";
import { SecurityOverviewGrid } from "@/components/platformSecutity/SecurityOverviewGrid";
import { ThreatDetectionPanel } from "@/components/platformSecutity/ThreatDetectionPanel";
import { SecurityOperationsPanel } from "@/components/platformSecutity/SecurityOperationsPanel";
import { useMockDataNotification } from "@/components/common/MockDataNotification";

// Interface for security data computed from existing APIs and mock data
interface SecurityData {
  overview: {
    totalThreats: number;
    blockedAttempts: number;
    suspiciousUsers: number;
    cleanupOperations: number;
    securityScore: number; // 0-100
    lastIncident: string | null;
  };
  threats: {
    current: Array<{
      id: string;
      type:
        | "bruteforce"
        | "api_abuse"
        | "suspicious_url"
        | "rate_limit_violation";
      severity: "low" | "medium" | "high" | "critical";
      source: string;
      target: string;
      timestamp: string;
      status: "active" | "mitigated" | "investigating";
    }>;
    timeline: Array<{
      date: string;
      threats: number;
      blocked: number;
    }>;
  };
  authentication: {
    failedLogins: Array<{
      timestamp: string;
      ip: string;
      attempts: number;
      location?: string;
    }>;
    trends: Array<{
      hour: string;
      failed: number;
      successful: number;
    }>;
  };
  suspiciousActivity: Array<{
    id: string;
    userId: string;
    activity: string;
    severity: "low" | "medium" | "high";
    timestamp: string;
    details: string;
  }>;
  operations: {
    cleanupHistory: Array<{
      id: string;
      type: "data_cleanup" | "user_deactivation" | "url_removal";
      timestamp: string;
      recordsAffected: number;
      status: "completed" | "pending" | "failed";
    }>;
  };
}

/**
 * Platform security content component
 * Monitors security threats, authentication failures, and suspicious activities with simulated data
 */
const PlatformSecurityContent: FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const { MockDataSystem } = useMockDataNotification(theme);

  /**
   * Fetch and compute security data from existing APIs + mock security data
   */
  const fetchSecurityData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      const endDate = new Date();
      const startDate = new Date();

      switch (timeRange) {
        case "24h":
          startDate.setHours(startDate.getHours() - 24);
          break;
        case "7d":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(startDate.getDate() - 30);
          break;
      }

      const dateParams = {
        startDate: startDate.toISOString().substring(0, 10),
        endDate: endDate.toISOString().substring(0, 10),
      };

      // Fetch real data from available APIs
      const [dashboardData, realTimeData] = await Promise.allSettled([
        api.analytics.getDashboard({ limit: 10, ...dateParams }),
        api.analytics.getRealTime(60),
      ]);

      // Compute security metrics from real data + generate realistic security data
      const computedData = computeSecurityMetrics({
        dashboardData:
          dashboardData.status === "fulfilled" ? dashboardData.value : null,
        realTimeData:
          realTimeData.status === "fulfilled" ? realTimeData.value : null,
      });

      setSecurityData(computedData);
    } catch (err) {
      console.error("Error fetching security data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load security data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Compute security metrics from API responses and generate realistic security data
   */
  const computeSecurityMetrics = (apiData: any): SecurityData => {
    const { dashboardData } = apiData;

    const totalUsers = dashboardData?.data?.overview?.users?.total || 0;

    // Generate realistic security metrics based on platform activity
    const generateSecurityOverview = () => {
      const baseThreats = Math.floor(totalUsers * 0.001);
      const currentThreats = Math.max(
        0,
        baseThreats + Math.floor(Math.random() * 5)
      );

      return {
        totalThreats: currentThreats,
        blockedAttempts: currentThreats * 3 + Math.floor(Math.random() * 10),
        suspiciousUsers: Math.floor(totalUsers * 0.002),
        cleanupOperations: Math.floor(Math.random() * 3) + 1,
        securityScore: Math.max(85, 95 - currentThreats * 2),
        lastIncident:
          currentThreats > 0
            ? new Date(Date.now() - Math.random() * 86400000).toISOString()
            : null,
      };
    };

    // Generate current threats
    const generateCurrentThreats = () => {
      const threatTypes = [
        "bruteforce",
        "api_abuse",
        "suspicious_url",
        "rate_limit_violation",
      ] as const;
      const severities = ["low", "medium", "high", "critical"] as const;
      const statuses = ["active", "mitigated", "investigating"] as const;

      const threats = [];
      const threatCount = Math.floor(Math.random() * 5);

      for (let i = 0; i < threatCount; i++) {
        threats.push({
          id: `threat_${Date.now()}_${i}`,
          type: threatTypes[Math.floor(Math.random() * threatTypes.length)]!,
          severity: severities[Math.floor(Math.random() * severities.length)]!,
          source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          target: Math.random() > 0.5 ? "API Endpoint" : "Login Page",
          timestamp: new Date(
            Date.now() - Math.random() * 3600000
          ).toISOString(),
          status: statuses[Math.floor(Math.random() * statuses.length)]!,
        });
      }

      return threats;
    };

    // Generate authentication failure data
    const generateAuthFailures = () => {
      const failures = [];
      const failureCount = Math.floor(Math.random() * 10) + 5;

      for (let i = 0; i < failureCount; i++) {
        const locationOptions = [
          "Unknown",
          "United States",
          "China",
          "Russia",
          "Germany",
        ];
        const location =
          locationOptions[Math.floor(Math.random() * locationOptions.length)]!;

        failures.push({
          timestamp: new Date(
            Date.now() - Math.random() * 86400000
          ).toISOString(),
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          attempts: Math.floor(Math.random() * 20) + 1,
          location: location,
        });
      }

      return failures;
    };

    // Generate hourly authentication trends
    const generateAuthTrends = () => {
      const trends = [];
      for (let i = 23; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);

        trends.push({
          hour: hour.toISOString(),
          failed: Math.floor(Math.random() * 50),
          successful: Math.floor(Math.random() * 200) + 100,
        });
      }
      return trends;
    };

    // Generate suspicious activity
    const generateSuspiciousActivity = () => {
      const activities = [
        "Excessive URL creation",
        "Unusual API usage pattern",
        "Multiple failed login attempts",
        "Suspicious click patterns",
        "Potential bot behavior",
        "Geographic anomaly detected",
      ] as const;

      const suspiciousActivities = [];
      const activityCount = Math.floor(Math.random() * 8) + 2;

      for (let i = 0; i < activityCount; i++) {
        const activity =
          activities[Math.floor(Math.random() * activities.length)]!;

        suspiciousActivities.push({
          id: `activity_${Date.now()}_${i}`,
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          activity: activity,
          severity: ["low", "medium", "high"][
            Math.floor(Math.random() * 3)
          ]! as "low" | "medium" | "high",
          timestamp: new Date(
            Date.now() - Math.random() * 86400000
          ).toISOString(),
          details: `Detected anomalous behavior pattern. Requires investigation.`,
        });
      }

      return suspiciousActivities;
    };

    return {
      overview: generateSecurityOverview(),
      threats: {
        current: generateCurrentThreats(),
        timeline: [],
      },
      authentication: {
        failedLogins: generateAuthFailures(),
        trends: generateAuthTrends(),
      },
      suspiciousActivity: generateSuspiciousActivity(),
      operations: {
        cleanupHistory: [
          {
            id: "cleanup_1",
            type: "data_cleanup" as const,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            recordsAffected: 1234,
            status: "completed" as const,
          },
          {
            id: "cleanup_2",
            type: "url_removal" as const,
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            recordsAffected: 45,
            status: "completed" as const,
          },
        ],
      },
    };
  };

  // Load data on mount and when time range changes
  useEffect(() => {
    fetchSecurityData(true);
  }, [timeRange]);

  /**
   * Manual refresh handler
   */
  const handleRefresh = async () => {
    await fetchSecurityData(false);
  };

  /**
   * Time range selector component
   */
  const TimeRangeSelector = () => {
    const ranges = [
      { value: "24h" as const, label: "24H" },
      { value: "7d" as const, label: "7D" },
      { value: "30d" as const, label: "30D" },
    ];

    return (
      <div
        className={`inline-flex rounded-lg border ${
          theme === "dark"
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        } p-1`}
      >
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              timeRange === range.value
                ? "bg-red-600 text-white shadow-sm"
                : theme === "dark"
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    );
  };

  // Loading state
  if (loading && !securityData) {
    return (
      <DashboardLayout
        title="Platform Security"
        description="Monitor security threats, authentication failures, and suspicious activities"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout
        title="Platform Security"
        description="Monitor security threats, authentication failures, and suspicious activities"
      >
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                  Security data unavailable
                </p>
                <p className="text-red-600 dark:text-red-500 text-xs">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <MockDataSystem message="Security demo" position="bottom-right" />
          <TimeRangeSelector />

          <div className="flex items-center space-x-3">
            {!user ||
              (user.role !== "admin" && (
                <span className="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                  Security Simulation
                </span>
              ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-2 rounded-lg border transition-colors ${
                refreshing ? "animate-spin" : ""
              } ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800 text-gray-400"
                  : "border-gray-300 hover:bg-gray-50 text-gray-600"
              }`}
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Security Overview Grid */}
        <div className="mb-8">
          <SecurityOverviewGrid
            {...(securityData?.overview && { overview: securityData.overview })}
            theme={theme}
            loading={refreshing}
          />
        </div>

        {/* Threat Detection & Login Attempts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ThreatDetectionPanel
            {...(securityData?.threats && {
              threats: securityData.threats.current,
            })}
            theme={theme}
            loading={refreshing}
          />

          <LoginAttemptsChart
            {...(securityData?.authentication && {
              data: securityData.authentication.trends,
            })}
            theme={theme}
            loading={refreshing}
          />
        </div>

        {/* Suspicious Activity & Security Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SuspiciousActivityList
            {...(securityData?.suspiciousActivity && {
              activities: securityData.suspiciousActivity,
            })}
            theme={theme}
            loading={refreshing}
          />

          <SecurityOperationsPanel
            {...(securityData?.operations && {
              operations: securityData.operations,
            })}
            theme={theme}
            loading={refreshing}
            isAdmin={user?.role === "admin"}
          />
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default PlatformSecurityContent;
