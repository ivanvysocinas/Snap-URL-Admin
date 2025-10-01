"use client";

import { useState, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  Trash2,
  Plus,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import api from "../../lib/api";
import { ChartCard } from "@/components/dashboard/ChartCard";

/**
 * Report configuration for generating custom reports
 */
interface ReportConfig {
  type: "url" | "user" | "platform";
  targetId?: string;
  startDate: string;
  endDate: string;
  format: "json" | "csv";
  includeCharts: boolean;
}

/**
 * Generated report with metadata and status tracking
 */
interface GeneratedReport {
  id: string;
  name: string;
  type: "url" | "user" | "platform";
  format: "json" | "csv";
  status: "generating" | "completed" | "failed";
  createdAt: string;
  downloadUrl?: string;
  error?: string;
  metadata?: {
    type: string;
    targetId?: string;
    generatedAt: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    format: string;
  };
}

/**
 * Analytics reports management component
 * Handles report generation, downloading, and lifecycle management
 */
const ReportsContent: FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [currentReportConfig, setCurrentReportConfig] = useState<ReportConfig>({
    type: "user",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    format: "json",
    includeCharts: false,
  });

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Animation variants for modal transitions
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  /**
   * Generates a new report based on current configuration
   */
  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.analytics.generateReport(currentReportConfig);

      if (response.success && response.data) {
        // Create a new report entry
        const newReport: GeneratedReport = {
          id: `report-${Date.now()}`,
          name: `${currentReportConfig.type} Report - ${new Date().toLocaleDateString()}`,
          type: currentReportConfig.type,
          format: currentReportConfig.format,
          status: "completed",
          createdAt: new Date().toISOString(),
          metadata: response.data.metadata,
        };

        // Create download blob from response data
        let content: string;
        if (currentReportConfig.format === "csv") {
          // Convert to CSV if needed
          if (typeof response.data.data === "object") {
            content = JSON.stringify(response.data.data);
          } else {
            content = response.data.data;
          }
        } else {
          content = JSON.stringify(response.data.data, null, 2);
        }

        const blob = new Blob([content], {
          type:
            currentReportConfig.format === "csv"
              ? "text/csv"
              : "application/json",
        });
        newReport.downloadUrl = URL.createObjectURL(blob);

        setReports((prev) => [newReport, ...prev]);
        setShowCreateModal(false);
      } else {
        throw new Error(response.message || "Failed to generate report");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate report"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Downloads a generated report file
   */
  const handleDownloadReport = (report: GeneratedReport) => {
    if (report.downloadUrl) {
      const link = document.createElement("a");
      link.href = report.downloadUrl;
      link.download = `${report.name.replace(/\s+/g, "_")}.${report.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /**
   * Deletes a report and cleans up its blob URL
   */
  const handleDeleteReport = (reportId: string) => {
    setReports((prev) => {
      const reportToDelete = prev.find((r) => r.id === reportId);
      if (reportToDelete?.downloadUrl) {
        URL.revokeObjectURL(reportToDelete.downloadUrl);
      }
      return prev.filter((r) => r.id !== reportId);
    });
  };

  /**
   * Returns appropriate status icon based on report status
   */
  const getStatusIcon = (status: GeneratedReport["status"]) => {
    switch (status) {
      case "generating":
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  /**
   * Formats ISO date string for display
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout
        title="Analytics Reports"
        description="Generate and download comprehensive analytics reports"
      >
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                    Report Generation Failed
                  </p>
                  <p className="text-red-600 dark:text-red-500 text-xs">
                    {error}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-600 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              <span>Generate Report</span>
            </motion.button>
          </div>

          <div className="flex items-center space-x-3">
            <span
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {reports.length} reports generated
            </span>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          <ChartCard title="Generated Reports" theme={theme}>
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-750 border-gray-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-lg ${
                            theme === "dark" ? "bg-blue-900/20" : "bg-blue-100"
                          }`}
                        >
                          <FileText className="w-5 h-5 text-blue-500" />
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <h3
                              className={`font-medium ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {report.name}
                            </h3>
                            {getStatusIcon(report.status)}
                          </div>

                          <div className="flex items-center space-x-4 mt-1">
                            <span
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              Type: {report.type}
                            </span>
                            <span
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              Format: {report.format.toUpperCase()}
                            </span>
                            <span
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatDate(report.createdAt)}
                            </span>
                          </div>

                          {report.metadata?.dateRange && (
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span
                                className={`text-xs ${
                                  theme === "dark"
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {new Date(
                                  report.metadata.dateRange.startDate
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  report.metadata.dateRange.endDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {report.status === "completed" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownloadReport(report)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === "dark"
                                ? "hover:bg-gray-700 text-gray-400"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                            title="Download Report"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteReport(report.id)}
                          className={`p-2 rounded-lg transition-colors text-red-500 ${
                            theme === "dark"
                              ? "hover:bg-red-900/20"
                              : "hover:bg-red-50"
                          }`}
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {report.error && (
                      <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
                        Error: {report.error}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3
                  className={`w-16 h-16 mx-auto mb-4 ${
                    theme === "dark" ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-lg font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  No Reports Generated
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Create your first analytics report to get started
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate First Report</span>
                </motion.button>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Create Report Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`w-full max-w-lg rounded-lg shadow-xl ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } max-h-[90vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`flex items-center justify-between p-6 border-b ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h2
                    className={`text-xl font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Generate Analytics Report
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCreateModal(false)}
                    className={`p-1 rounded-lg ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Report Type */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Report Type
                    </label>
                    <select
                      value={currentReportConfig.type}
                      onChange={(e) =>
                        setCurrentReportConfig((prev) => ({
                          ...prev,
                          type: e.target.value as "url" | "user" | "platform",
                        }))
                      }
                      className="input-base"
                    >
                      <option value="user">User Report</option>
                      <option value="url">URL Report</option>
                      <option value="platform">Platform Report</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={currentReportConfig.startDate}
                        onChange={(e) =>
                          setCurrentReportConfig((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        value={currentReportConfig.endDate}
                        onChange={(e) =>
                          setCurrentReportConfig((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                        className="input-base"
                      />
                    </div>
                  </div>

                  {/* Format */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Export Format
                    </label>
                    <select
                      value={currentReportConfig.format}
                      onChange={(e) =>
                        setCurrentReportConfig((prev) => ({
                          ...prev,
                          format: e.target.value as "json" | "csv",
                        }))
                      }
                      className="input-base"
                    >
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        id="includeCharts"
                        checked={currentReportConfig.includeCharts}
                        onChange={(e) =>
                          setCurrentReportConfig((prev) => ({
                            ...prev,
                            includeCharts: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <label
                        htmlFor="includeCharts"
                        className={`ml-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Include Chart Configuration Data
                      </label>
                    </motion.div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCreateModal(false)}
                      className="btn-secondary px-4 py-2 rounded-lg"
                      disabled={loading}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerateReport}
                      className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          <span>Generate Report</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </motion.div>
  );
};

export default ReportsContent;
