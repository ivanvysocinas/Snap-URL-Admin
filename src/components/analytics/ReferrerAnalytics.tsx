/**
 * Traffic source analytics component showing referrer data
 * Features URL parsing to extract clean domain names and percentage calculations
 * Handles direct traffic identification and provides animated list rendering
 */
"use client";

import { motion } from "framer-motion";
import { ExternalLink, TrendingUp } from "lucide-react";
import { FC } from "react";

interface ReferrerAnalyticsProps {
  referrerData?:
    | Array<{
        _id: string;
        count: number;
        domain?: string;
      }>
    | undefined;
  theme: string;
  loading: boolean;
}

export const ReferrerAnalytics: FC<ReferrerAnalyticsProps> = ({
  referrerData,
  theme,
  loading,
}) => {
  const referrers = referrerData || [];
  const totalReferrals = referrers.reduce((sum, ref) => sum + ref.count, 0);

  /**
   * Format referrer URL to display clean domain name
   * Handles direct traffic and URL parsing with fallback
   */
  const formatReferrer = (referrer: string): string => {
    if (!referrer || referrer === "direct") return "Direct Traffic";

    try {
      const url = new URL(referrer);
      return url.hostname.replace("www.", "");
    } catch {
      return referrer;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex items-center space-x-2 mb-4">
        <ExternalLink className="w-5 h-5 text-blue-500" />
        <h3
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Traffic Sources
        </h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex items-center justify-between"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {referrers.slice(0, 10).map((referrer, index) => {
            const percentage =
              totalReferrals > 0 ? (referrer.count / totalReferrals) * 100 : 0;

            return (
              <motion.div
                key={referrer._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className={`w-2 h-2 rounded-full bg-blue-500`} />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium truncate ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatReferrer(referrer._id)}
                    </p>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {percentage.toFixed(1)}% of traffic
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {referrer.count}
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </motion.div>
            );
          })}

          {referrers.length === 0 && (
            <div className="text-center py-8">
              <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                No referrer data available yet
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
