"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Shield,
  Check,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import api from "../../lib/api";

/**
 * Data & Privacy tab component
 * Handles data export and privacy settings with GDPR compliance information
 */
export const DataPrivacyTab: FC = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<Record<string, boolean>>({});

  /**
   * Export user data in specified format
   */
  const exportData = async (format: "json" | "csv") => {
    setLoading((prev) => ({ ...prev, [`export_${format}`]: true }));
    try {
      const response = await api.urls.export({
        format,
        includeAnalytics: true,
        includeInactive: true,
      });

      // Create download
      const blob = new Blob(
        [
          typeof response === "string"
            ? response
            : JSON.stringify(response, null, 2),
        ],
        {
          type: format === "csv" ? "text/csv" : "application/json",
        }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `snapurl-data-${new Date().toISOString().split("T")[0]}.${format}`;
      link.click();
      URL.revokeObjectURL(url);

      setSuccess((prev) => ({ ...prev, [`export_${format}`]: true }));
      setTimeout(
        () => setSuccess((prev) => ({ ...prev, [`export_${format}`]: false })),
        3000
      );
    } catch (error) {
      console.error(`Failed to export ${format}:`, error);
      setErrors({ export: `Failed to export data as ${format.toUpperCase()}` });
    } finally {
      setLoading((prev) => ({ ...prev, [`export_${format}`]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Download className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold dark:text-white">Data Export</h3>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Export all your data including URLs, analytics, and settings in your
            preferred format.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium dark:text-white mb-2">JSON Format</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Complete data export including all metadata and analytics.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData("json")}
                disabled={loading.export_json}
                className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2 w-full justify-center"
              >
                {loading.export_json ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : success.export_json ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export JSON</span>
                  </>
                )}
              </motion.button>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium dark:text-white mb-2">CSV Format</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Spreadsheet-friendly format for easy analysis.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData("csv")}
                disabled={loading.export_csv}
                className="btn-secondary px-4 py-2 rounded-lg flex items-center space-x-2 w-full justify-center"
              >
                {loading.export_csv ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : success.export_csv ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {errors.export && (
            <div className="flex items-center space-x-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.export}</span>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-semibold dark:text-white">
            Privacy & Data
          </h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Data Retention
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Your data is stored securely and you can export or delete it
                  at any time. URL analytics are kept for statistical purposes
                  but can be anonymized upon request.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium dark:text-white mb-2">
              Data Processing
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Account Data:
                </span>
                <span className="dark:text-white">Stored securely</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  URL Analytics:
                </span>
                <span className="dark:text-white">Anonymized</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  API Logs:
                </span>
                <span className="dark:text-white">30 days retention</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              GDPR Compliance
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              We comply with GDPR regulations. You have the right to access,
              rectify, erase, and port your personal data. Contact support for
              any privacy-related requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
