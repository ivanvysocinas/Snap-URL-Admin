"use client";

import { useState, useEffect, FC } from "react";
import {
  TrendingUp,
  Users,
  Link,
  MousePointer,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { StatsCard } from "../../components/dashboard/StatsCards";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import type { DashboardData } from "../../types";
import { TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { TopUrlsTable } from "@/components/dashboard/TopUrlsTable";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

/**
 * Main dashboard content component with real API analytics
 * Displays key metrics, charts, and recent activity with time range filtering
 */
const DashboardContent: FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">(
    "all"
  );

  /**
   * Fetch dashboard data from API
   */
  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      // Calculate date range based on selection
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date();

      switch (timeRange) {
        case "24h":
          startDate.setHours(startDate.getHours() - 24);
          break;
        case "7d":
          startDate.setDate(startDate.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "30d":
          startDate.setDate(startDate.getDate() - 30);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "all":
          startDate.setDate(startDate.getDate() - 3650);
          startDate.setHours(0, 0, 0, 0);
          break;
      }

      const params: { startDate?: string; endDate?: string; limit: number } = {
        limit: 20,
      };

      // Отправляем полные ISO строки с временем
      const startDateString = startDate.toISOString();
      const endDateString = endDate.toISOString();

      if (startDateString) {
        params.startDate = startDateString;
      }
      if (endDateString) {
        params.endDate = endDateString;
      }

      console.log("Dashboard date range params:", params); // Для отладки

      const response = await api.analytics.getDashboard(params);

      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );

      // Set fallback empty data to prevent crashes
      setDashboardData({
        userId: user?.id || "1",
        overview: {
          totalClicks: 0,
          uniqueClicks: 0,
          uniqueVisitors: 0,
          averageLoadTime: 0,
          conversionRate: 0,
          engagementScore: 0,
        },
        trends: [],
        geographic: { topCountries: [] },
        topUrls: [],
        recentActivity: [],
        performance: {
          clicksPerDay: 0,
          conversionRate: 0,
          engagementScore: 0,
          peakHour: 14,
          trendDirection: "stable",
          growthRate: 0,
        },
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on mount and when time range changes
  useEffect(() => {
    fetchDashboardData(true);
  }, [timeRange]);

  /**
   * Manual refresh handler
   */
  const handleRefresh = async () => {
    await fetchDashboardData(false);
  };

  // Loading skeleton
  if (loading && !dashboardData) {
    return (
      <DashboardLayout
        title="Dashboard"
        description="Welcome back! Here's what's happening with your URLs."
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
    <DashboardLayout
      title="Dashboard"
      description={`Welcome back, ${user?.name || "User"}! Here's what's happening with your URLs.`}
    >
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                Failed to load dashboard data
              </p>
              <p className="text-red-600 dark:text-red-500 text-xs">{error}</p>
            </div>
          </div>
          <div className="mt-3 flex space-x-3">
            <button
              onClick={handleRefresh}
              className="text-red-600 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 underline"
              disabled={refreshing}
            >
              {refreshing ? "Retrying..." : "Try Again"}
            </button>
            <button
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <TimeRangeSelector
          currentRange={timeRange}
          onChange={setTimeRange}
          theme={theme}
        />

        <button
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
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Clicks"
          value={dashboardData?.overview.totalClicks || 0}
          icon={MousePointer}
          color="blue"
          theme={theme}
        />
        <StatsCard
          title="Unique Visitors"
          value={dashboardData?.overview.uniqueVisitors || 0}
          icon={Users}
          color="green"
          theme={theme}
        />
        <StatsCard
          title="Total URLs"
          value={dashboardData?.topUrls.length || 0}
          icon={Link}
          color="purple"
          theme={theme}
        />
        <StatsCard
          title="Conversion Rate"
          value={dashboardData?.overview.conversionRate || 0}
          icon={TrendingUp}
          color="orange"
          suffix="%"
          theme={theme}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Traffic Trends Chart */}
        <ChartCard title="Traffic Trends" theme={theme}>
          {dashboardData?.trends && dashboardData.trends.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={300}
              className={"ml-[-30px]"}
            >
              <AreaChart data={dashboardData?.trends || []}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="date"
                  stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  fontSize={12}
                />
                <YAxis
                  stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: theme === "dark" ? "#f3f4f6" : "#111827",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                No traffic trend data available
              </p>
            </div>
          )}
        </ChartCard>

        {/* Top Countries Chart */}
        <ChartCard title="Top Countries" theme={theme}>
          {dashboardData?.geographic.topCountries &&
          dashboardData.geographic.topCountries.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={dashboardData.geographic.topCountries
                    .filter((country) => country.countryName)
                    .map((country) => ({
                      name: country.countryName,
                      value: country.count,
                    }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name }) => `${name}`}
                >
                  {dashboardData.geographic.topCountries.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: theme === "dark" ? "#f3f4f6" : "#111827",
                  }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                No geographic data available
              </p>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top URLs */}
        {dashboardData?.topUrls && dashboardData.topUrls.length > 0 && (
          <div className="lg:col-span-2">
            <TopUrlsTable urls={dashboardData?.topUrls || []} theme={theme} />
          </div>
        )}

        {/* Recent Activity */}
        {dashboardData?.recentActivity &&
          dashboardData.recentActivity.length > 0 && (
            <div>
              <RecentActivity
                activities={dashboardData?.recentActivity || []}
                theme={theme}
              />
            </div>
          )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardContent;
