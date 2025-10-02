"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface UrlData {
  _id: string;
  originalUrl: string;
  shortCode: string;
  title?: string;
  clickCount: number;
  uniqueClicks: number;
  createdAt: string;
}

interface TopUrlsTableProps {
  urls: UrlData[];
  theme: string;
}

/**
 * Top URLs table component with responsive design
 * Displays URL analytics data in both table and card layouts
 * Automatically switches between desktop table and mobile card views
 */
export const TopUrlsTable: FC<TopUrlsTableProps> = ({ urls, theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Table header */}
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Top Performing URLs
        </h3>
      </div>

      <div>
        <div className="w-full">
          {/* Mobile Card Layout - shown on small screens */}
          <div className="block sm:hidden space-y-4">
            {urls.map((url) => (
              <UrlMobileCard key={url._id} url={url} theme={theme} />
            ))}
          </div>

          {/* Desktop Table Layout - shown on larger screens */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th
                    className={`text-left py-3 px-4 font-semibold text-sm sm:text-base ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    URL
                  </th>
                  <th
                    className={`text-right py-3 px-4 font-semibold text-sm sm:text-base ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Total Clicks
                  </th>
                  <th
                    className={`text-right py-3 px-4 font-semibold text-sm sm:text-base ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Unique Clicks
                  </th>
                  <th
                    className={`text-right py-3 px-4 font-semibold text-sm sm:text-base ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <UrlTableRow key={url._id} url={url} theme={theme} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Mobile card component for individual URL display
 * Optimized for small screens with stacked layout
 */
interface UrlMobileCardProps {
  url: UrlData;
  theme: string;
}

const UrlMobileCard: FC<UrlMobileCardProps> = ({ url, theme }) => {
  return (
    <div
      className={`p-4 rounded-lg border ${
        theme === "dark"
          ? "bg-gray-800/50 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="space-y-3">
        {/* URL information section */}
        <div>
          <h4
            className={`font-semibold text-sm ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {url.title || "Untitled"}
          </h4>
          <p
            className={`text-xs break-all mt-1 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {url.originalUrl}
          </p>
          <p className="text-xs text-blue-500 font-mono mt-1">
            {process.env.NEXT_PUBLIC_API_URL}/{url.shortCode}
          </p>
        </div>

        {/* Statistics grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div
              className={`font-bold text-lg ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {url.clickCount.toLocaleString()}
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total Clicks
            </div>
          </div>

          <div>
            <div
              className={`font-bold text-lg ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              {url.uniqueClicks.toLocaleString()}
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Unique Clicks
            </div>
          </div>

          <div>
            <div
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {new Date(url.createdAt).toLocaleDateString()}
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Created
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Desktop table row component for individual URL display
 * Optimized for larger screens with tabular layout
 */
interface UrlTableRowProps {
  url: UrlData;
  theme: string;
}

const UrlTableRow: FC<UrlTableRowProps> = ({ url, theme }) => {
  return (
    <tr
      className={`border-b ${theme === "dark" ? "border-gray-700/50" : "border-gray-100"}`}
    >
      {/* URL information column */}
      <td className="py-4 px-4 max-w-0 w-1/2">
        <div className="flex flex-col space-y-1">
          <p
            className={`font-medium text-sm sm:text-base ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {url.title || "Untitled"}
          </p>
          <p
            className={`text-xs sm:text-sm break-all ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {url.originalUrl}
          </p>
          <p className="text-xs text-blue-500 font-mono">
            {process.env.NEXT_PUBLIC_API_URL}/{url.shortCode}
          </p>
        </div>
      </td>

      {/* Total clicks column */}
      <td className="py-4 px-4 text-right">
        <span
          className={`font-bold text-base sm:text-lg ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {url.clickCount.toLocaleString()}
        </span>
      </td>

      {/* Unique clicks column */}
      <td className="py-4 px-4 text-right">
        <span
          className={`font-semibold text-base sm:text-lg ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
        >
          {url.uniqueClicks.toLocaleString()}
        </span>
      </td>

      {/* Created date column */}
      <td className="py-4 px-4 text-right">
        <span
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {new Date(url.createdAt).toLocaleDateString()}
        </span>
      </td>
    </tr>
  );
};
