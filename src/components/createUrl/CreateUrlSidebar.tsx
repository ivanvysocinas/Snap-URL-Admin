/**
 * Sidebar component for URL creation page displaying user statistics and helpful tips
 * Features real-time data fetching from analytics API, error handling, and responsive design
 * Shows quick stats, creation tips, and recent URLs to provide context during URL creation
 */
import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import { Info, Shield, QrCode, Loader2 } from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { DashboardData, TopUrlStats } from "@/types";

interface CreateUrlSidebarProps {
  theme: string;
}

export const CreateUrlSidebar: FC<CreateUrlSidebarProps> = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch dashboard analytics data for sidebar display
   * Handles authentication checks and error states gracefully
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const dashboardResponse = await api.analytics.getDashboard({
          limit: 20,
        });

        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        } else {
          throw new Error(
            dashboardResponse.message || "Failed to fetch dashboard data"
          );
        }
      } catch (err) {
        console.error("Failed to fetch sidebar data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle unauthenticated state
  if (!user) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-4"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please log in to view your statistics
          </p>
        </motion.div>
      </div>
    );
  }

  // Calculate metrics from dashboard data
  const totalUrls = dashboardData?.topUrls?.length || 0;
  const totalClicks = dashboardData?.overview?.totalClicks || 0;

  // Calculate clicks from last 30 days using trends data
  const clicksThisMonth =
    dashboardData?.trends
      ?.filter((trend) => {
        const trendDate = new Date(trend.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return trendDate >= thirtyDaysAgo;
      })
      .reduce((sum, trend) => sum + trend.clicks, 0) || 0;

  return (
    <div className="space-y-6">
      {/* User Statistics Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-4"
      >
        <h4 className="font-medium dark:text-white mb-3">Quick Stats</h4>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                URLs Created:
              </span>
              <span className="font-medium dark:text-white">
                {totalUrls.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Total Clicks:
              </span>
              <span className="font-medium dark:text-white">
                {totalClicks.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                This Month:
              </span>
              <span className="font-medium dark:text-white">
                {clicksThisMonth.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Helpful Tips Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-4"
      >
        <h4 className="font-medium dark:text-white mb-3">Tips</h4>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p>Use descriptive titles and tags to organize your URLs better</p>
          </div>
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Password protection adds an extra layer of security</p>
          </div>
          <div className="flex items-start space-x-2">
            <QrCode className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <p>QR codes work great for offline marketing materials</p>
          </div>
        </div>
      </motion.div>

      {/* Recent URLs Display */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-4"
      >
        <h4 className="font-medium dark:text-white mb-3">Recent URLs</h4>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 dark:text-red-400">
            Failed to load recent URLs
          </div>
        ) : dashboardData?.topUrls && dashboardData.topUrls.length > 0 ? (
          <div className="space-y-2">
            {dashboardData.topUrls.map((url: TopUrlStats, index: number) => (
              <div
                key={url._id || index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium dark:text-white truncate">
                    {url.title || "Untitled"}
                  </p>
                  <p className="text-blue-500 font-mono text-xs truncate">
                    {process.env.NEXT_PUBLIC_API_URL}/{url.shortCode}
                  </p>
                </div>
                <span className="text-gray-600 dark:text-gray-400 ml-2 flex-shrink-0">
                  {url.clickCount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No URLs created yet. Create your first shortened URL above!
          </div>
        )}
      </motion.div>
    </div>
  );
};
