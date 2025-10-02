"use client";

import { useState, useEffect, useCallback, useMemo, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import api from "../../lib/api";
import type {
  ShortUrl,
  PaginationMeta,
  UpdateUrlRequest,
  QRCode,
} from "../../types";
import { useComingSoon } from "@/hooks/useComingSoonModal";
import { useAuth } from "@/context/AuthContext";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";
import { EmptyState } from "@/components/urls/EmptyState";
import { URLCard } from "@/components/urls/URLCard";
import { CreateURLModal } from "@/components/urls/CreateURLModal";

/**
 * Debounce hook for search input
 * Delays execution until after specified delay
 */
const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Main URLs management component with comprehensive features
 * Handles URL listing, creation, editing, analytics, and bulk operations
 */
const URLsContent: FC = () => {
  const { theme } = useTheme();

  // State management
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters and sorting
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "clickCount" | "title" | "lastClickedAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination with 5 URLs per page
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUrls, setTotalUrls] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const itemsPerPage = 5;

  // UI state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());

  // Debounced search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Hook integrations
  const { showComingSoon } = useComingSoon();
  const { showDemoRestriction } = useDemoRestriction()
  const { user } = useAuth()

  // Animation variants for smooth transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  /**
   * Fetches URLs from API with enhanced error handling and loading states
   */
  const fetchUrls = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        // Show search loading for search queries
        if (debouncedSearchQuery && !showLoading) {
          setSearchLoading(true);
        }

        setError(null);

        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy,
          sortOrder,
          ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
          ...(filterStatus !== "all" && {
            isActive: filterStatus === "active",
          }),
        };

        const response = await api.urls.getAll(params);

        if (response.success) {
          setUrls(response.data || []);

          if (response.pagination) {
            setPagination(response.pagination);
            setTotalPages(response.pagination.totalPages || 1);
            setTotalUrls(response.pagination.totalUrls || 0);
          }
        } else {
          throw new Error(response.message || "Failed to fetch URLs");
        }
      } catch (err) {
        console.error("Error fetching URLs:", err);
        setError(err instanceof Error ? err.message : "Failed to load URLs");
        setUrls([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setSearchLoading(false);
      }
    },
    [
      currentPage,
      sortBy,
      sortOrder,
      debouncedSearchQuery,
      filterStatus,
      itemsPerPage,
    ]
  );

  /**
   * Initial load and refresh when dependencies change
   */
  useEffect(() => {
    fetchUrls(true);
  }, [fetchUrls]);

  /**
   * Resets page to 1 when filters change
   */
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, filterStatus, sortBy, sortOrder]);

  /**
   * Calculates pagination info for display
   */
  const paginationInfo = useMemo(() => {
    const start = totalUrls > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const end = Math.min(currentPage * itemsPerPage, totalUrls);
    return { start, end };
  }, [currentPage, itemsPerPage, totalUrls]);

  /**
   * Handles individual URL selection for bulk operations
   */
  const handleSelectUrl = (urlId: string) => {
    const newSelected = new Set(selectedUrls);
    if (newSelected.has(urlId)) {
      newSelected.delete(urlId);
    } else {
      newSelected.add(urlId);
    }
    setSelectedUrls(newSelected);
  };

  /**
   * Handles select/deselect all URLs
   */
  const handleSelectAll = () => {
    if (selectedUrls.size === urls.length) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(urls.map((url) => url._id)));
    }
  };

  /**
   * Handles URL deletion with optimistic updates
   */
  const handleDeleteUrl = async (urlId: string, hardDelete = false) => {
    try {
      // Optimistic update
      setUrls((prev) => prev.filter((url) => url._id !== urlId));

      await api.urls.delete(urlId, hardDelete);

      // Remove from selected if it was selected
      setSelectedUrls((prev) => {
        const newSelected = new Set(prev);
        newSelected.delete(urlId);
        return newSelected;
      });

      // Refresh data to get updated counts
      fetchUrls(false);
    } catch (err) {
      console.error("Error deleting URL:", err);
      setError(err instanceof Error ? err.message : "Failed to delete URL");
      // Revert optimistic update on error
      fetchUrls(false);
    }
  };

  /**
   * Handles bulk delete of selected URLs with demo restrictions
   */
  const handleBulkDelete = async () => {
    if (selectedUrls.size === 0) return;

    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "This action is not available in demo mode. Please use a full account to access all features.",
        "Delete urls"
      );
      return;
    }

    try {
      setRefreshing(true);

      // Delete all selected URLs
      const deletePromises = Array.from(selectedUrls).map((urlId) =>
        api.urls.delete(urlId, false)
      );

      await Promise.allSettled(deletePromises);

      // Clear selection and refresh
      setSelectedUrls(new Set());
      await fetchUrls(false);
    } catch (err) {
      console.error("Error deleting URLs:", err);
      setError("Some URLs could not be deleted");
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Updates URL with fresh data refetch
   */
  const handleUpdateUrl = async (urlId: string, updates: UpdateUrlRequest) => {
    try {
      const response = await api.urls.update(urlId, updates);

      if (response.success) {
        // Refetch the specific URL to get the latest data
        const refetchResponse = await api.urls.getById(urlId);

        if (refetchResponse.success && refetchResponse.data) {
          // Update local state with fresh data
          setUrls((prev) =>
            prev.map((url) => {
              if (url._id === urlId) {
                const updatedUrl = { ...url, ...refetchResponse.data };
                return updatedUrl;
              }
              return url;
            })
          );
        } else {
          // Fallback to response data if refetch fails
          setUrls((prev) =>
            prev.map((url) =>
              url._id === urlId ? { ...url, ...updates } : url
            )
          );
        }
      } else {
        throw new Error(response.message || "Failed to update URL");
      }
    } catch (err) {
      console.error("Error updating URL:", err);
      setError(err instanceof Error ? err.message : "Failed to update URL");
    }
  };

  /**
   * Copies URL to clipboard with error handling
   */
  const handleCopyUrl = async (shortUrl: string) => {
    try {
      const success = await api.utils.copyToClipboard(shortUrl);
      if (!success) {
        setError("Failed to copy URL to clipboard");
      }
    } catch (err) {
      console.error("Error copying URL:", err);
      setError("Failed to copy URL to clipboard");
    }
  };

  /**
   * Generates QR code for URL and updates local state
   */
  const handleGenerateQR = async (urlId: string) => {
    try {
      const response = await api.urls.generateQR(urlId);

      if (response.success) {
        // Update URL with QR code
        setUrls((prev) =>
          prev.map((url) => {
            if (url._id === urlId) {
              const updatedUrl: ShortUrl = {
                ...url,
                qrCode: response.data?.qrCode || ({} as QRCode),
              };
              return updatedUrl;
            }
            return url;
          })
        );
      } else {
        throw new Error(response.message || "Failed to generate QR code");
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate QR code"
      );
    }
  };

  /**
   * Exports URLs in specified format with proper file handling
   */
  const handleExport = async (format: "json" | "csv" = "json") => {
    try {
      setRefreshing(true);

      let exportData;

      if (selectedUrls.size > 0) {
        // Export only selected URLs
        const selectedUrlsData = urls.filter((url) =>
          selectedUrls.has(url._id)
        );
        exportData = selectedUrlsData;
      } else {
        // Export all URLs via API
        const response = await api.urls.export({
          format,
          includeAnalytics: true,
        });

        let actualData: any;
        let isSuccessful: boolean;

        if (Array.isArray(response)) {
          actualData = response;
          isSuccessful = true;
        } else if (
          response &&
          typeof response === "object" &&
          "success" in response
        ) {
          actualData = response.data;
          isSuccessful = response.success;

          if (!isSuccessful) {
            throw new Error(response.message || "Failed to export URLs");
          }
        } else if (typeof response === "string") {
          actualData = response;
          isSuccessful = true;
        } else {
          throw new Error("Unexpected response format");
        }

        exportData = actualData;
      }

      if (exportData) {
        let content: string;
        let mimeType: string;
        let filename: string;

        if (format === "csv") {
          // Convert to CSV if needed
          if (Array.isArray(exportData)) {
            const headers = Object.keys(exportData[0] || {});
            const csvContent = [
              headers.join(","),
              ...exportData.map((item) =>
                headers
                  .map((header) => JSON.stringify(item[header] || ""))
                  .join(",")
              ),
            ].join("\n");
            content = csvContent;
          } else {
            content =
              typeof exportData === "string"
                ? exportData
                : JSON.stringify(exportData);
          }
          mimeType = "text/csv;charset=utf-8";
          filename = `urls_export_${new Date().toISOString().split("T")[0]}.csv`;
        } else {
          // JSON format
          content = JSON.stringify(exportData, null, 2);
          mimeType = "application/json;charset=utf-8";
          filename = `urls_export_${new Date().toISOString().split("T")[0]}.json`;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`Export completed successfully: ${filename}`);
      } else {
        throw new Error("No data to export");
      }
    } catch (err) {
      console.error("Error exporting URLs:", err);
      setError(err instanceof Error ? err.message : "Failed to export URLs");
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Handles pagination navigation with smooth scrolling
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Generates page numbers for pagination with ellipsis
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
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
        title="URL Management"
        description="Manage your shortened URLs, view analytics, and organize your links"
      >
        {/* Error Message with Animation */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 text-sm underline mt-1"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar with Enhanced Animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              <span>Create URL</span>
            </motion.button>

            <AnimatePresence>
              {selectedUrls.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-2"
                >
                  <span
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {selectedUrls.size} selected
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleExport("json")}
                    className="btn-secondary p-2 rounded-lg"
                    disabled={refreshing}
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBulkDelete}
                    className="btn-danger p-2 rounded-lg"
                    disabled={refreshing}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchUrls(false)}
              className={`btn-ghost p-2 rounded-lg ${refreshing ? "animate-spin" : ""}`}
              disabled={loading || refreshing}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport("csv")}
              className="btn-ghost p-2 rounded-lg"
              disabled={refreshing}
            >
              <Download className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-ghost p-2 rounded-lg"
              onClick={() => showComingSoon()}
            >
              <Upload className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          {/* Search with Loading Indicator */}
          <div className="relative md:col-span-2">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search URLs, titles, or domains..."
              className="input-base"
              style={{ paddingLeft: "2.5rem" }}
              disabled={loading}
            />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
            )}
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "active" | "inactive")
            }
            className="input-base"
            disabled={loading}
          >
            <option value="all">All URLs</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "createdAt"
                    | "clickCount"
                    | "title"
                    | "lastClickedAt"
                )
              }
              className="input-base flex-1"
              disabled={loading}
            >
              <option value="createdAt">Created Date</option>
              <option value="clickCount">Clicks</option>
              <option value="title">Title</option>
              <option value="lastClickedAt">Last Clicked</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="btn-ghost p-2 rounded-lg"
              disabled={loading}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </motion.button>
          </div>
        </motion.div>

        {/* Fixed Pagination Info */}
        <AnimatePresence>
          {pagination && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-between items-center text-sm"
            >
              <span
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                Showing {paginationInfo.start} to {paginationInfo.end} of{" "}
                {totalUrls} URLs
              </span>
              <span
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                Page {currentPage} of {totalPages}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* URLs List with Enhanced Loading and Animations */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-4"
              >
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="flex space-x-4">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : urls.length === 0 ? (
          <EmptyState
            searchQuery={debouncedSearchQuery}
            onCreateClick={() => setShowCreateModal(true)}
          />
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Select All */}
            <motion.div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedUrls.size === urls.length && urls.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 dark:border-gray-600"
                disabled={loading}
              />
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Select all ({urls.length} URLs)
              </span>
            </motion.div>

            {/* URLs Grid */}
            <AnimatePresence mode="popLayout">
              {urls.map((url, index) => (
                <motion.div
                  key={url._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <URLCard
                    url={url}
                    isSelected={selectedUrls.has(url._id)}
                    onSelect={() => handleSelectUrl(url._id)}
                    onDelete={() => handleDeleteUrl(url._id)}
                    onUpdate={(updates: UpdateUrlRequest) =>
                      handleUpdateUrl(url._id, updates)
                    }
                    onCopy={() => handleCopyUrl(`${process.env.NEXT_PUBLIC_API_URL}/${url.shortCode}`)}
                    onGenerateQR={() => handleGenerateQR(url._id)}
                    theme={theme}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <motion.div className="flex justify-center items-center space-x-1 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="flex items-center px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </motion.button>

                {/* Page numbers */}
                {getPageNumbers().map((pageNum, index) => {
                  if (pageNum === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 py-2 text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }

                  const isCurrentPage = pageNum === currentPage;
                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: isCurrentPage ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pageNum as number)}
                      disabled={loading}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        isCurrentPage
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="flex items-center px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Create URL Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateURLModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onSuccess={(newUrl) => {
                setUrls((prev) => [newUrl, ...prev]);
                setShowCreateModal(false);
                fetchUrls(false); // Refresh to get updated pagination
              }}
              theme={theme}
            />
          )}
        </AnimatePresence>
      </DashboardLayout>
    </motion.div>
  );
};

export default URLsContent;