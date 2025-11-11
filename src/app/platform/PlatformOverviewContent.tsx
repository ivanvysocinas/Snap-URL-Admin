"use client";

import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import { SystemHealthCard } from "../../components/platformOverview/SystemHealthCard";
import { PlatformStatsGrid } from "../../components/platformOverview/PlatformStatsGrid";
import { TopUsersTable } from "../../components/platformOverview/TopUsersTable";
import { GrowthChart } from "../../components/platformOverview/GrowthChart";
import { useMockDataNotification } from "@/components/common/MockDataNotification";

// Interface for platform analytics data
interface PlatformData {
  overview: {
    users: {
      totalUsers: number;
      active: number;
      new: number;
      growth: number;
    };
    urls: {
      totalUrls: number;
      active: number;
      new: number;
      growth: number;
    };
    clicks: {
      totalClicks: number;
      today: number;
      growth: number;
    };
  };
  growth: {
    users: {
      daily: Array<{ date: string; count: number }>;
      weekly: Array<{ date: string; count: number }>;
      monthly: Array<{ date: string; count: number }>;
    };
    urls: {
      daily: Array<{ date: string; count: number }>;
      weekly: Array<{ date: string; count: number }>;
      monthly: Array<{ date: string; count: number }>;
    };
    clicks: {
      daily: Array<{ date: string; count: number }>;
      weekly: Array<{ date: string; count: number }>;
      monthly: Array<{ date: string; count: number }>;
    };
  };
  performance: {
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
    requestsPerMinute: number;
  };
  trends: Array<{
    date: string;
    users: number;
    urls: number;
    clicks: number;
  }>;
  topUsers?: Array<{
    id: string;
    name: string;
    email: string;
    totalUrls: number;
    totalClicks: number;
    lastActive: string;
  }>;
}

/**
 * Platform overview content component
 * Displays comprehensive platform-wide analytics and system health with mock data fallback
 */
const PlatformOverviewContent: FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">(
    "30d"
  );

  const { MockDataSystem } = useMockDataNotification(theme);

  /**
   * Fetch platform analytics data with fallback to mock data
   */
  const fetchPlatformData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      // Calculate date range
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
        case "all":
          startDate.setDate(startDate.getDate() - 3650);
          break;
      }

      // Format dates properly
      const startDateString = startDate.toISOString().substring(0, 10);
      const endDateString = endDate.toISOString().substring(0, 10);

      // Build params object with known string types
      const params: { startDate: string; endDate: string } = {
        startDate: startDateString,
        endDate: endDateString,
      };

      // Fetch real platform analytics data
      const response = await api.analytics.getPlatformAnalytics(params);

      if (response.success && response.data) {
        setPlatformData(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch platform data");
      }
    } catch (err) {
      console.error("Error fetching platform data:", err);
      setPlatformData(generateMockPlatformData());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Generate mock platform data for demo purposes
   */
  const generateMockPlatformData = (): PlatformData => {
    const mockTrends = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateString = date.toISOString().split("T")[0];

      // Ensure we have a valid date string
      if (!dateString) {
        throw new Error("Failed to generate mock date");
      }

      return {
        date: dateString,
        users: Math.floor(Math.random() * 50) + 150,
        urls: Math.floor(Math.random() * 200) + 300,
        clicks: Math.floor(Math.random() * 1000) + 2000,
      };
    });

    return {
      overview: {
        users: {
          totalUsers: 1247,
          active: 892,
          new: 23,
          growth: 12.5,
        },
        urls: {
          totalUrls: 8934,
          active: 7245,
          new: 156,
          growth: 8.3,
        },
        clicks: {
          totalClicks: 234567,
          today: 1834,
          growth: 15.7,
        },
      },
      growth: {
        users: {
          daily: mockTrends.map((t) => ({
            date: t.date,
            count: Math.floor(t.users / 10),
          })),
          weekly: [],
          monthly: [],
        },
        urls: {
          daily: mockTrends.map((t) => ({
            date: t.date,
            count: Math.floor(t.urls / 5),
          })),
          weekly: [],
          monthly: [],
        },
        clicks: {
          daily: mockTrends.map((t) => ({
            date: t.date,
            count: t.clicks,
          })),
          weekly: [],
          monthly: [],
        },
      },
      performance: {
        averageResponseTime: 145,
        errorRate: 0.02,
        uptime: 99.8,
        requestsPerMinute: 234,
      },
      trends: mockTrends,
      topUsers: [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          totalUrls: 145,
          totalClicks: 3421,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          totalUrls: 98,
          totalClicks: 2134,
          lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike@example.com",
          totalUrls: 76,
          totalClicks: 1876,
          lastActive: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ],
    };
  };

  // Load data on mount and when time range changes
  useEffect(() => {
    fetchPlatformData(true);
  }, [timeRange]);

  /**
   * Manual refresh handler
   */
  const handleRefresh = async () => {
    await fetchPlatformData(false);
  };

  /**
   * Time range selector component
   */
  const TimeRangeSelector = () => {
    const ranges = [
      { value: "24h" as const, label: "24H" },
      { value: "7d" as const, label: "7D" },
      { value: "30d" as const, label: "30D" },
      { value: "all" as const, label: "All" },
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
                ? "bg-blue-600 text-white shadow-sm"
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

  // Loading skeleton
  if (loading && !platformData) {
    return (
      <DashboardLayout
        title="Platform Overview"
        description="Monitor system health, user activity, and platform-wide metrics"
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
        title="Platform Overview"
        description="Monitor system health, user activity, and platform-wide metrics"
      >
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <MockDataSystem message="Overview demo" position="bottom-right" />
          <TimeRangeSelector />

          <div className="flex items-center space-x-3">
            {!user ||
              (user.role !== "admin" && (
                <span className="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                  Demo Mode
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

        {/* System Health Overview */}
        <div className="mb-8">
          <SystemHealthCard
            {...(platformData?.performance && {
              performance: platformData.performance,
            })}
            theme={theme}
            loading={refreshing}
          />
        </div>

        {/* Platform Statistics Grid */}
        <div className="mb-8">
          <PlatformStatsGrid
            {...(platformData?.overview && { overview: platformData.overview })}
            theme={theme}
            loading={refreshing}
          />
        </div>

        {/* Growth Trends Chart */}
        <div className="mb-8">
          <GrowthChart
            trends={platformData?.trends || []}
            theme={theme}
            timeRange={timeRange}
            loading={refreshing}
          />
        </div>

        {/* Top Users Table */}
        <div className="mb-8">
          <TopUsersTable
            users={platformData?.topUsers || []}
            theme={theme}
            loading={refreshing}
          />
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default PlatformOverviewContent;
