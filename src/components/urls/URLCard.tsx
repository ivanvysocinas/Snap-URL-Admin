"use client";

import { useState, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  QrCode,
  BarChart3,
  ExternalLink,
  Edit2,
  Trash2,
  MoreVertical,
  Calendar,
  Eye,
  MousePointer,
  Check,
  Link as LinkIcon,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";
import { useAuth } from "@/context/AuthContext";
import api from "../../lib/api";
import type { ShortUrl, UpdateUrlRequest } from "../../types";
import { QRModal } from "./QRModal";
import { EditURLModal } from "./EditURLModal";

interface URLCardProps {
  url: ShortUrl;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (updates: UpdateUrlRequest) => void;
  onCopy: () => void;
  onGenerateQR: () => void;
  theme: string;
}

/**
 * Enhanced URL Card Component with improved animations and user experience
 * Displays individual URL with actions and stats
 */
export const URLCard: FC<URLCardProps> = ({
  url,
  isSelected,
  onSelect,
  onDelete,
  onUpdate,
  onCopy,
  onGenerateQR,
  theme,
}) => {
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { addNotification } = useNotifications();
  const { showDemoRestriction } = useDemoRestriction();
  const { user } = useAuth();

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const actionMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.1,
      },
    },
  };

  /**
   * Handle URL copy with enhanced feedback and animation
   */
  const handleCopyUrl = async () => {
    setLoading(true);
    try {
      const success = await api.utils.copyToClipboard(
        `${process.env.NEXT_PUBLIC_API_URL}/${url.shortCode}`
      );
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onCopy(); // Notify parent
      }
    } catch (error) {
      console.error("Failed to copy URL:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle QR code generation with loading state
   */
  const handleGenerateQR = async () => {
    setShowQRModal(true);
    setLoading(true);
    try {
      await onGenerateQR();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Truncate URL for display with responsive length
   */
  const truncateUrl = (urlString: string, maxLength: number = 50): string => {
    return urlString.length > maxLength
      ? `${urlString.substring(0, maxLength)}...`
      : urlString;
  };

  /**
   * Get status color based on URL state
   */
  const getStatusColor = () => {
    if (!url.isActive) return "text-red-500";
    if (url.expiresAt && new Date(url.expiresAt) < new Date())
      return "text-orange-500";
    return "text-green-500";
  };

  /**
   * Get status text based on URL state
   */
  const getStatusText = () => {
    if (!url.isActive) return "Inactive";
    if (url.expiresAt && new Date(url.expiresAt) < new Date()) return "Expired";
    return "Active";
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className={`card card-hover p-4 sm:p-6 ${
          isSelected ? "ring-2 ring-blue-500" : ""
        } ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          {/* Header with checkbox and actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <motion.input
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor()} bg-opacity-10`}
              >
                {getStatusText()}
              </motion.span>
            </div>

            <div className="flex items-center space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyUrl}
                disabled={loading}
                className={`p-2 rounded-lg transition-colors ${
                  copied
                    ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                }`}
                title={copied ? "Copied!" : "Copy URL"}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowActions(!showActions)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      variants={actionMenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-10 ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      } py-1`}
                    >
                      <motion.button
                        whileHover={{
                          backgroundColor:
                            theme === "dark" ? "#374151" : "#f3f4f6",
                        }}
                        onClick={handleGenerateQR}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>QR Code</span>
                      </motion.button>
                      <Link href={`/analytics/url/${url._id}`}>
                        <motion.button
                          whileHover={{
                            backgroundColor:
                              theme === "dark" ? "#374151" : "#f3f4f6",
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>Analytics</span>
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{
                          backgroundColor:
                            theme === "dark" ? "#374151" : "#f3f4f6",
                        }}
                        onClick={() => {
                          if (user?.role === "demo") {
                            showDemoRestriction(
                              "Demo Account Restriction",
                              "This action is not available in demo mode. Please use a full account to access all features.",
                              "Edit url"
                            );
                            return;
                          }
                          setShowEditModal(true);
                          setShowActions(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit URL</span>
                      </motion.button>
                      <motion.button
                        whileHover={{
                          backgroundColor:
                            theme === "dark" ? "#374151" : "#f3f4f6",
                        }}
                        onClick={() => window.open(url.originalUrl, "_blank")}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Visit URL</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "#fef2f2" }}
                        onClick={() => {
                          if (user?.role === "demo") {
                            showDemoRestriction(
                              "Demo Account Restriction",
                              "This action is not available in demo mode. Please use a full account to access all features.",
                              "Delete URL"
                            );
                            return;
                          }
                          onDelete();
                          setShowActions(false);
                          addNotification(
                            "URL Deleted Successfully!",
                            `Deleted short URL: ${url.shortUrl}`
                          );
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete URL</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3
            className={`text-lg font-semibold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {url.title || "Untitled URL"}
          </h3>

          {/* Original URL */}
          <p
            className={`text-sm mb-3 break-all ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {truncateUrl(url.originalUrl, 60)}
          </p>

          {/* Short URL */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2 mb-4 cursor-pointer bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg"
            onClick={handleCopyUrl}
          >
            <LinkIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="font-mono text-blue-500 text-sm break-all">
              {`${process.env.NEXT_PUBLIC_API_URL}/${url.shortCode}`}
            </span>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <MousePointer
                  className={`w-4 h-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
              <div
                className={`font-semibold ${
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

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Eye
                  className={`w-4 h-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
              <div
                className={`font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
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

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Calendar
                  className={`w-4 h-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
              <div
                className={`font-semibold text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {new Date(url.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
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

          {/* Description (if exists) */}
          {url.description && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } mb-3`}
            >
              {url.description}
            </motion.p>
          )}

          {/* Footer info */}
          {(url.expiresAt || url.lastClickedAt) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`space-y-1 text-xs pt-3 border-t ${
                theme === "dark"
                  ? "border-gray-700 text-gray-500"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              {url.lastClickedAt && (
                <div>Last clicked: {formatDate(url.lastClickedAt)}</div>
              )}
              {url.expiresAt && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Expires: {formatDate(url.expiresAt)}</span>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
              <motion.input
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                className="mt-1 rounded border-gray-300 dark:border-gray-600"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3
                    className={`text-lg font-semibold truncate ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {url.title || "Untitled URL"}
                  </h3>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor()} bg-opacity-10`}
                  >
                    {getStatusText()}
                  </motion.span>
                </div>

                <p
                  className={`text-sm mb-3 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {truncateUrl(url.originalUrl)}
                </p>

                <div className="flex items-center space-x-4 text-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={handleCopyUrl}
                  >
                    <LinkIcon className="w-4 h-4 text-blue-500" />
                    <span className="font-mono text-blue-500 hover:text-blue-600">
                      {`${process.env.NEXT_PUBLIC_API_URL}/${url.shortCode}`}
                    </span>
                  </motion.div>

                  <div className="flex items-center space-x-1">
                    <MousePointer
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }
                    >
                      {url.clickCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Eye
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }
                    >
                      {url.uniqueClicks.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Calendar
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {formatDate(url.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyUrl}
                disabled={loading}
                className={`p-2 rounded-lg transition-colors ${
                  copied
                    ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                }`}
                title={copied ? "Copied!" : "Copy URL"}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleGenerateQR}
                disabled={loading}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                title={url.qrCode ? "View QR Code" : "Generate QR Code"}
              >
                <QrCode className="w-4 h-4" />
              </motion.button>

              <Link href={`/analytics/url/${url._id}`}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                  title="View Analytics"
                >
                  <BarChart3 className="w-4 h-4" />
                </motion.button>
              </Link>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowActions(!showActions)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      variants={actionMenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-10 ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      } py-1`}
                    >
                      <motion.button
                        whileHover={{
                          backgroundColor:
                            theme === "dark" ? "#374151" : "#f3f4f6",
                        }}
                        onClick={() => {
                          if (user?.role === "demo") {
                            showDemoRestriction(
                              "Demo Account Restriction",
                              "This action is not available in demo mode. Please use a full account to access all features.",
                              "Edit url"
                            );
                            return;
                          }
                          setShowEditModal(true);
                          setShowActions(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit URL</span>
                      </motion.button>
                      <motion.button
                        whileHover={{
                          backgroundColor:
                            theme === "dark" ? "#374151" : "#f3f4f6",
                        }}
                        onClick={() => window.open(url.originalUrl, "_blank")}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Visit URL</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "#fef2f2" }}
                        onClick={() => {
                          if (user?.role === "demo") {
                            showDemoRestriction(
                              "Demo Account Restriction",
                              "This action is not available in demo mode. Please use a full account to access all features.",
                              "Delete url"
                            );
                            return;
                          }
                          onDelete();
                          setShowActions(false);
                          addNotification(
                            "URL Deleted Successfully!",
                            `Deleted short URL: ${url.shortUrl}`
                          );
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete URL</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {url.description && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } mb-3`}
            >
              {url.description}
            </motion.p>
          )}

          {(url.expiresAt || url.lastClickedAt) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`flex items-center justify-between text-xs pt-3 border-t ${
                theme === "dark"
                  ? "border-gray-700 text-gray-500"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              {url.lastClickedAt && (
                <span>Last clicked: {formatDate(url.lastClickedAt)}</span>
              )}
              {url.expiresAt && (
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Expires: {formatDate(url.expiresAt)}</span>
                </span>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && url.qrCode && (
          <QRModal
            qrCode={url.qrCode}
            shortUrl={`${process.env.NEXT_PUBLIC_API_URL}/${url.shortCode}`}
            title={typeof url.title === "string" ? url.title : ""}
            onClose={() => setShowQRModal(false)}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Edit URL Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditURLModal
            url={url}
            onClose={() => setShowEditModal(false)}
            onSuccess={(updates) => {
              onUpdate(updates);
              setShowEditModal(false);
            }}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </>
  );
};