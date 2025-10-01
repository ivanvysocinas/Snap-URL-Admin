"use client";

import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Download,
  Share2,
  LinkIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import { useTheme } from "../../../../context/ThemeContext";
import api from "../../../../lib/api";
import { UrlOverviewCards } from "../../../../components/analytics/UrlOverviewCards";
import { UrlTrafficChart } from "../../../../components/analytics/UrlTrafficChart";
import { GeographicAnalytics } from "../../../../components/analytics/GeographicAnalytics";
import { DeviceAnalytics } from "../../../../components/analytics/DeviceAnalytics";
import { ReferrerAnalytics } from "../../../../components/analytics/ReferrerAnalytics";
import { QRCodeDisplay } from "../../../../components/analytics/QRCodeDisplay";
import { RealtimeStats } from "../../../../components/analytics/RealtimeStats";
import { TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";

interface UrlAnalyticsData {
  url: {
    id: string;
    originalUrl: string;
    shortUrl: string;
    shortCode: string;
    title?: string;
    createdAt: string;
    isActive: boolean;
    qrCode?: string;
  };
  overview: {
    totalClicks: number;
    uniqueClicks: number;
    uniqueVisitors: number;
    averageLoadTime: number;
    conversionRate: number;
    engagementScore: number;
  };
  geographic: {
    byCountry: Array<{
      _id: string;
      count: number;
      countryName: string;
    }>;
    topCountries: Array<{
      _id: string;
      count: number;
      countryName: string;
    }>;
  };
  technology: {
    byDevice: Array<{
      _id: string;
      count: number;
    }>;
    byBrowser: Array<{
      _id: string;
      count: number;
    }>;
    topBrowsers: Array<{
      _id: string;
      count: number;
    }>;
  };
  traffic: {
    byReferrer: Array<{
      _id: string;
      count: number;
      domain: string;
    }>;
    clicksByHour: Array<{
      hour: string;
      clicks: number;
    }>;
    clicksByDay: Array<{
      date: {
        year: number;
        month: number;
        day: number;
      };
      clicks: number;
      uniqueVisitors: number;
    }>;
  };
  performance: {
    clicksPerDay: number;
    conversionRate: number;
    engagementScore: number;
    peakHour: number;
    trendDirection: "up" | "down" | "stable";
    growthRate: number;
  };
  realTime: {
    clicksLast5Minutes: number;
    clicksLastHour: number;
    activeCountries: Array<string>;
    lastUpdated: string;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

interface UrlAnalyticsContentProps {
  urlId: string;
}

/**
 * URL Analytics Content Component
 * Comprehensive analytics dashboard for individual URLs with real-time data,
 * geographic insights, device analytics, and export capabilities
 */
const UrlAnalyticsContent: FC<UrlAnalyticsContentProps> = ({ urlId }) => {
  const { theme } = useTheme();
  const router = useRouter();

  // State management for analytics data and UI
  const [analyticsData, setAnalyticsData] = useState<UrlAnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">(
    "7d"
  );

  /**
   * Fetch analytics data for the specific URL
   * Handles data transformation from API response to component interface
   */
  const fetchAnalyticsData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      // Calculate date range based on selection
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999); // Устанавливаем конец дня

      const startDate = new Date();

      switch (timeRange) {
        case "24h":
          startDate.setHours(startDate.getHours() - 24);
          break;
        case "7d":
          startDate.setDate(startDate.getDate() - 7);
          startDate.setHours(0, 0, 0, 0); // Устанавливаем начало дня
          break;
        case "30d":
          startDate.setDate(startDate.getDate() - 30);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "90d":
          startDate.setDate(startDate.getDate() - 90);
          startDate.setHours(0, 0, 0, 0);
          break;
      }

      // Отправляем полные ISO строки с временем
      const params = {
        startDate: startDate.toISOString(), // Полная дата с временем
        endDate: endDate.toISOString(), // Полная дата с временем
        excludeBots: true,
        includeRealTime: true,
      };

      console.log("Date range params:", params); // Для отладки

      const response = await api.analytics.getUrlAnalytics(urlId, params);

      if (response.success && response.data) {
        console.log("Raw API response:", response.data); // Для отладки

        // Transform API response to match our interface
        const transformedData: UrlAnalyticsData = {
          url: {
            id: String(response.data.url._id || urlId),
            originalUrl: response.data.url.originalUrl,
            shortUrl: response.data.url.shortUrl,
            shortCode: response.data.url.shortCode || "",
            ...(response.data.url.title && { title: response.data.url.title }),
            createdAt: response.data.url.createdAt,
            isActive: response.data.url.isActive ?? true,
            ...(typeof response.data.url.qrCode === "string" && {
              qrCode: response.data.url.qrCode,
            }),
          },
          overview: {
            totalClicks: response.data.overview?.totalClicks || 0,
            uniqueClicks: response.data.overview?.uniqueClicks || 0,
            uniqueVisitors: response.data.overview?.uniqueVisitors || 0,
            averageLoadTime: response.data.overview?.averageLoadTime || 0,
            conversionRate: response.data.overview?.conversionRate || 0,
            engagementScore: response.data.overview?.engagementScore || 0,
          },
          geographic: response.data.geographic || {
            byCountry: [],
            topCountries: [],
          },
          technology: {
            byDevice: response.data.technology?.byDevice || [],
            byBrowser: response.data.technology?.byBrowser || [],
            topBrowsers: response.data.technology?.topBrowsers || [],
          },
          traffic: {
            byReferrer: response.data.traffic?.byReferrer || [],
            clicksByHour:
              response.data.traffic?.clicksByHour?.map((item: any) => ({
                hour: item.hour || item._id || String(item.time || 0),
                clicks: item.clicks || item.count || 0,
              })) || [],
            clicksByDay:
              response.data.traffic?.clicksByDay?.map((item: any) => ({
                date:
                  item.date ||
                  item._id ||
                  new Date().toISOString().split("T")[0],
                clicks: item.clicks || item.count || 0,
                uniqueVisitors: item.uniqueVisitorsCount || 0,
              })) || [],
          },
          performance: {
            clicksPerDay: response.data.performance?.clicksPerDay || 0,
            conversionRate: response.data.performance?.conversionRate || 0,
            engagementScore: response.data.performance?.engagementScore || 0,
            peakHour: response.data.performance?.peakHour || 0,
            trendDirection:
              response.data.performance?.trendDirection || "stable",
            growthRate: response.data.performance?.growthRate || 0,
          },
          realTime: response.data.realTime || {
            clicksLast5Minutes: 0,
            clicksLastHour: 0,
            activeCountries: [],
            lastUpdated: new Date().toISOString(),
          },
          dateRange: response.data.dateRange || {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        };

        console.log("Transformed data traffic:", transformedData.traffic); // Для отладки
        setAnalyticsData(transformedData);
      } else {
        throw new Error(response.message || "Failed to fetch analytics data");
      }
    } catch (err) {
      console.error("Error fetching URL analytics:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load analytics data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on mount and when time range changes
  useEffect(() => {
    fetchAnalyticsData(true);
  }, [urlId, timeRange]);

  /**
   * Manual refresh handler
   * Refreshes analytics data without showing full loading state
   */
  const handleRefresh = async () => {
    await fetchAnalyticsData(false);
  };

  /**
   * Generate and download report
   * Creates CSV export of analytics data for the current time period
   */
  const handleDownloadReport = async () => {
    if (
      !analyticsData?.dateRange.startDate ||
      !analyticsData?.dateRange.endDate
    ) {
      console.error("Date range not available for report generation");
      return;
    }

    try {
      const response = await api.analytics.generateReport({
        type: "url",
        targetId: urlId,
        startDate: analyticsData.dateRange.startDate,
        endDate: analyticsData.dateRange.endDate,
        format: "csv",
        includeCharts: false,
      });

      if (response.success) {
        // Handle CSV download
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `url-analytics-${urlId}-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error("Error downloading report:", err);
    }
  };

  /**
   * Share URL analytics
   * Uses native Web Share API or falls back to clipboard
   */
  const handleShare = async () => {
    try {
      const shareData = {
        title: `Analytics for ${analyticsData?.url.title || "URL"}`,
        text: `Check out the analytics for this URL: ${analyticsData?.overview.totalClicks} total clicks`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Loading state with skeleton UI
  if (loading && !analyticsData) {
    return (
      <DashboardLayout
        title="URL Analytics"
        description="Loading analytics data..."
      >
        <div className="space-y-6">
          {/* Loading skeleton */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  // Error state with retry options
  if (error && !analyticsData) {
    return (
      <DashboardLayout
        title="URL Analytics"
        description="Error loading analytics"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center min-h-[60vh]"
        >
          <div className="max-w-2xl w-full px-4">
            <div
              className={`card p-8 md:p-12 text-center ${
                theme === "dark"
                  ? "bg-gray-800 border-red-900/50"
                  : "bg-white border-red-200"
              } border-2`}
            >
              {/* Icon with animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div
                  className={`p-4 rounded-full ${
                    theme === "dark"
                      ? "bg-red-900/30 border-2 border-red-800"
                      : "bg-red-100 border-2 border-red-300"
                  }`}
                >
                  <AlertCircle
                    className={`w-16 h-16 ${
                      theme === "dark" ? "text-red-400" : "text-red-600"
                    }`}
                  />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl font-bold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                URL Not Found
              </motion.h3>

              {/* Info box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`p-4 rounded-lg mb-6 text-left ${
                  theme === "dark"
                    ? "bg-gray-700/50 border border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <strong>Possible reasons:</strong>
                </p>
                <ul
                  className={`text-sm mt-2 space-y-1 list-disc list-inside ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <li>The URL may have been deleted</li>
                  <li>You don't have permission to view this URL</li>
                  <li>The link you followed might be incorrect</li>
                </ul>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-center gap-3"
              >
                <button
                  onClick={() => router.back()}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </button>
                <button
                  onClick={() => router.push("/urls")}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  View All URLs
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
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
        title={analyticsData?.url.title || "URL Analytics"}
        description={`Analytics for ${analyticsData?.url.shortUrl}`}
      >
        {/* Header with URL info and controls */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* URL Info */}
            <div className="flex items-start space-x-3">
              <button
                onClick={() => router.back()}
                className={`p-2 rounded-lg border transition-colors ${
                  theme === "dark"
                    ? "border-gray-700 hover:bg-gray-800 text-gray-400"
                    : "border-gray-300 hover:bg-gray-50 text-gray-600"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="min-w-0 flex-1">
                <h1
                  className={`text-xl font-bold truncate ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {analyticsData?.url.title || "Untitled URL"}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <a
                    href={analyticsData?.url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-600 truncate flex items-center"
                  >
                    {analyticsData?.url.originalUrl}
                    <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                  </a>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      analyticsData?.url.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {analyticsData?.url.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-full sm:w-auto">
                <TimeRangeSelector
                  currentRange={timeRange}
                  onChange={setTimeRange}
                  theme={theme}
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleShare}
                  className="btn-secondary px-4 py-2 rounded-full flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>

                <button
                  onClick={handleDownloadReport}
                  className="btn-secondary px-4 py-2 rounded-full flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>

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
            </div>
          </div>
        </div>

        {/* Real-time stats */}
        <div className="mb-6">
          <RealtimeStats
            realTimeData={analyticsData?.realTime}
            theme={theme}
            loading={refreshing}
          />
        </div>

        {/* Overview cards */}
        <div className="mb-8">
          <UrlOverviewCards
            overview={analyticsData?.overview}
            performance={analyticsData?.performance}
            theme={theme}
            loading={refreshing}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Traffic chart - takes 2 columns */}
          <div className="xl:col-span-2">
            <UrlTrafficChart
              trafficData={analyticsData?.traffic}
              theme={theme}
              loading={refreshing}
            />
          </div>

          {/* QR Code display */}
          <div>
            <QRCodeDisplay url={analyticsData?.url} theme={theme} />
          </div>
        </div>

        {/* Analytics grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GeographicAnalytics
            geographicData={analyticsData?.geographic}
            theme={theme}
            loading={refreshing}
          />

          <DeviceAnalytics
            technologyData={analyticsData?.technology}
            theme={theme}
            loading={refreshing}
          />
        </div>

        {/* Referrer analytics */}
        <div className="mb-8">
          <ReferrerAnalytics
            referrerData={analyticsData?.traffic?.byReferrer}
            theme={theme}
            loading={refreshing}
          />
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default UrlAnalyticsContent;
