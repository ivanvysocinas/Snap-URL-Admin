/**
 * Geographic analytics component showing country-based traffic distribution
 * Features animated progress bars with percentage calculations
 * Handles data normalization for country names and displays top 8 countries
 */
"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { FC } from "react";

interface GeographicAnalyticsProps {
  geographicData?:
    | {
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
      }
    | undefined;
  theme: string;
  loading: boolean;
}

export const GeographicAnalytics: FC<GeographicAnalyticsProps> = ({
  geographicData,
  theme,
  loading,
}) => {
  const countries = geographicData?.topCountries || [];
  const totalClicks = countries.reduce(
    (sum, country) => sum + country.count,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="w-5 h-5 text-blue-500" />
        <h3
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Geographic Distribution
        </h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {countries.slice(0, 8).map((country, index) => {
            const percentage =
              totalClicks > 0 ? (country.count / totalClicks) * 100 : 0;

            return (
              <div key={country._id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    {country.countryName || country._id}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {country.count} clicks
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Animated progress bar with gradient fill */}
                <div
                  className={`w-full h-2 rounded-full overflow-hidden ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}

          {countries.length === 0 && (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                No geographic data available yet
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
