"use client";

import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertCircle } from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/api";
import { PerformanceMetricsGrid } from "../../../components/platformPerformance/PerformanceMetricsGrid";
import { GeographicPerformanceMap } from "../../../components/platformPerformance/GeographicPerformanceMap";
import { ApiLoadChart } from "../../../components/platformPerformance/ApiLoadChart";
import { RateLimitingStats } from "../../../components/platformPerformance/RateLimitingStats";
import { ResponseTimeChart } from "@/components/platformPerformance/ReponseTimeChart";
import { useMockDataNotification } from "@/components/common/MockDataNotification";

// Interface for performance data computed from existing APIs
interface PerformanceData {
  metrics: {
    averageResponseTime: number;
    requestsPerMinute: number;
    errorRate: number;
    throughput: number;
    activeConnections: number;
    cacheHitRate: number;
  };
  responseTime: {
    hourly: Array<{
      time: string;
      avgTime: number;
      p95Time: number;
      p99Time: number;
    }>;
    trends: Array<{
      date: string;
      responseTime: number;
    }>;
  };
  geographic: {
    regions: Array<{
      country: string;
      avgResponseTime: number;
      requestCount: number;
      errorRate: number;
    }>;
    distribution: Array<{
      region: string;
      clicks: number;
      users: number;
      performance: number;
    }>;
  };
  apiLoad: {
    current: number;
    peak: number;
    average: number;
    timeline: Array<{
      time: string;
      requests: number;
      errors: number;
    }>;
  };
  rateLimiting: {
    totalUsers: number;
    limitHits: number;
    averageUsage: number;
    topUsers: Array<{
      userId: string;
      requestCount: number;
      limitHits: number;
      lastActivity: string;
    }>;
  };
}

/**
 * Platform performance content component
 * Computes performance metrics from existing analytics APIs
 */
const PlatformPerformanceContent: FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h" | "7d">("24h");
  const { MockDataSystem } = useMockDataNotification(theme);

  /**
   * Fetch and compute performance data from existing APIs
   */
  const fetchPerformanceData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();

      switch (timeRange) {
        case "1h":
          startDate.setHours(startDate.getHours() - 1);
          break;
        case "6h":
          startDate.setHours(startDate.getHours() - 6);
          break;
        case "24h":
          startDate.setHours(startDate.getHours() - 24);
          break;
        case "7d":
          startDate.setDate(startDate.getDate() - 7);
          break;
      }

      const dateParams = {
        startDate: startDate.toISOString().substring(0, 10),
        endDate: endDate.toISOString().substring(0, 10),
      };

      // Fetch data from multiple APIs in parallel
      const [clickAnalytics, geographicData, realTimeData, dashboardData] =
        await Promise.allSettled([
          api.analytics.getClickAnalytics({
            period: timeRange === "7d" ? "7d" : "1d",
            groupBy: timeRange === "1h" || timeRange === "6h" ? "hour" : "day",
          }),
          api.analytics.getGeographicAnalytics(dateParams),
          api.analytics.getRealTime(timeRange === "1h" ? 60 : 360),
          api.analytics.getDashboard({ limit: 20, ...dateParams }),
        ]);

      // Process and compute performance metrics
      const computedData = computePerformanceMetrics({
        clickAnalytics:
          clickAnalytics.status === "fulfilled" ? clickAnalytics.value : null,
        geographicData:
          geographicData.status === "fulfilled" ? geographicData.value : null,
        realTimeData:
          realTimeData.status === "fulfilled" ? realTimeData.value : null,
        dashboardData:
          dashboardData.status === "fulfilled" ? dashboardData.value : null,
      });

      setPerformanceData(computedData);
    } catch (err) {
      console.error("Error fetching performance data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load performance data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Compute performance metrics from API responses
   */
  const computePerformanceMetrics = (apiData: any): PerformanceData => {
    const { geographicData, realTimeData, dashboardData } = apiData;

    // Base metrics computation
    const currentRequests =
      realTimeData?.data?.statistics?.avgClicksPerMinute || 0;
    const totalClicks = dashboardData?.data?.overview?.totalClicks || 0;
    const activeUrls = realTimeData?.data?.statistics?.activeUrls || 0;

    // Compute virtual response time based on click patterns
    const computeResponseTime = () => {
      if (currentRequests > 1000) return 250; // High load
      if (currentRequests > 500) return 180; // Medium load
      if (currentRequests > 100) return 120; // Low load
      return 80; // Very low load
    };

    // Generate response time timeline
    const generateResponseTimeline = () => {
      const timeline = [];
      const now = new Date();
      const intervals = timeRange === "1h" ? 12 : timeRange === "6h" ? 24 : 24;

      for (let i = intervals; i >= 0; i--) {
        const time = new Date(now);
        if (timeRange === "1h") {
          time.setMinutes(time.getMinutes() - i * 5);
        } else {
          time.setHours(time.getHours() - i);
        }

        const baseTime = computeResponseTime();
        const variance = Math.random() * 40 - 20;

        timeline.push({
          time: time.toISOString(),
          avgTime: Math.max(50, baseTime + variance),
          p95Time: Math.max(80, baseTime + variance + 30),
          p99Time: Math.max(120, baseTime + variance + 60),
        });
      }
      return timeline;
    };

    // Process geographic data
    const processGeographicData = () => {
      const geoData = geographicData?.data;
      if (!geoData) return { regions: [], distribution: [] };

      // Mock regional performance based on geography
      const regions = [
        {
          country: "United States",
          avgResponseTime: 95,
          requestCount: totalClicks * 0.4,
          errorRate: 0.01,
        },
        {
          country: "United Kingdom",
          avgResponseTime: 120,
          requestCount: totalClicks * 0.15,
          errorRate: 0.008,
        },
        {
          country: "Germany",
          avgResponseTime: 110,
          requestCount: totalClicks * 0.12,
          errorRate: 0.009,
        },
        {
          country: "Japan",
          avgResponseTime: 180,
          requestCount: totalClicks * 0.08,
          errorRate: 0.015,
        },
        {
          country: "Australia",
          avgResponseTime: 200,
          requestCount: totalClicks * 0.05,
          errorRate: 0.012,
        },
      ];

      const distribution = regions.map((region) => ({
        region: region.country,
        clicks: Math.floor(region.requestCount),
        users: Math.floor(region.requestCount * 0.15),
        performance: Math.max(0, 100 - (region.avgResponseTime - 80) / 2),
      }));

      return { regions, distribution };
    };

    // Generate API load timeline
    const generateApiLoadTimeline = () => {
      const timeline = [];
      const now = new Date();
      const intervals = 24;

      for (let i = intervals; i >= 0; i--) {
        const time = new Date(now);
        time.setHours(time.getHours() - i);

        const baseLoad = currentRequests * (0.8 + Math.random() * 0.4);
        const errorRate = Math.random() * 0.02; // 0-2% error rate

        timeline.push({
          time: time.toISOString(),
          requests: Math.floor(baseLoad),
          errors: Math.floor(baseLoad * errorRate),
        });
      }
      return timeline;
    };

    return {
      metrics: {
        averageResponseTime: computeResponseTime(),
        requestsPerMinute: currentRequests,
        errorRate: Math.random() * 0.015,
        throughput: Math.floor(currentRequests * 60),
        activeConnections: activeUrls * 2,
        cacheHitRate: 0.85 + Math.random() * 0.1,
      },
      responseTime: {
        hourly: generateResponseTimeline(),
        trends: [],
      },
      geographic: processGeographicData(),
      apiLoad: {
        current: currentRequests,
        peak: Math.floor(currentRequests * 1.5),
        average: Math.floor(currentRequests * 0.8),
        timeline: generateApiLoadTimeline(),
      },
      rateLimiting: {
        totalUsers: dashboardData?.data?.overview?.users?.total || 0,
        limitHits: Math.floor(Math.random() * 50),
        averageUsage: currentRequests / 100,
        topUsers: [],
      },
    };
  };

  // Load data on mount and when time range changes
  useEffect(() => {
    fetchPerformanceData(true);
  }, [timeRange]);

  /**
   * Manual refresh handler
   */
  const handleRefresh = async () => {
    await fetchPerformanceData(false);
  };

  /**
   * Time range selector component
   */
  const TimeRangeSelector = () => {
    const ranges = [
      { value: "1h" as const, label: "1H" },
      { value: "6h" as const, label: "6H" },
      { value: "24h" as const, label: "24H" },
      { value: "7d" as const, label: "7D" },
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

  if (loading && !performanceData) {
    return (
      <DashboardLayout
        title="Platform Performance"
        description="Monitor API performance, response times, and system load metrics"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
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
        title="Platform Performance"
        description="Monitor API performance, response times, and system load metrics"
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
                  Performance data unavailable
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
          <MockDataSystem message="Performance demo" position="bottom-right" />
          <TimeRangeSelector />

          <div className="flex items-center space-x-3">
            {!user ||
              (user.role !== "admin" && (
                <span className="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                  Computed Metrics
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

        {/* Performance Metrics Grid */}
        <div className="mb-8">
          <PerformanceMetricsGrid
            {...(performanceData?.metrics && {
              metrics: performanceData.metrics,
            })}
            theme={theme}
            loading={refreshing}
          />
        </div>

        {/* Response Time Chart */}
        <div className="mb-8">
          <ResponseTimeChart
            data={performanceData?.responseTime?.hourly || []}
            theme={theme}
            timeRange={timeRange}
            loading={refreshing}
          />
        </div>

        {/* Geographic Performance & API Load */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GeographicPerformanceMap
            data={performanceData?.geographic?.distribution || []}
            theme={theme}
            loading={refreshing}
          />

          <ApiLoadChart
            data={performanceData?.apiLoad?.timeline || []}
            current={performanceData?.apiLoad?.current || 0}
            peak={performanceData?.apiLoad?.peak || 0}
            theme={theme}
            loading={refreshing}
          />
        </div>

        {/* Rate Limiting Statistics */}
        <div className="mb-8">
          <RateLimitingStats
            {...(performanceData?.rateLimiting && {
              data: performanceData.rateLimiting,
            })}
            theme={theme}
            loading={refreshing}
          />
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default PlatformPerformanceContent;
