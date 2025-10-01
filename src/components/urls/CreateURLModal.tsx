"use client";

import { useState, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2, AlertCircle } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";
import { useAuth } from "@/context/AuthContext";
import api from "../../lib/api";
import type { ShortUrl, CreateUrlRequest } from "../../types";

interface CreateURLModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: ShortUrl) => void;
  theme: string;
}

/**
 * Enhanced Create URL Modal Component with improved validation and animations
 */
export const CreateURLModal: FC<CreateURLModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  theme,
}) => {
  const [formData, setFormData] = useState({
    originalUrl: "",
    customAlias: "",
    title: "",
    description: "",
    tags: "",
    generateQR: true,
    fetchMetadata: true,
    expiresIn: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const { showDemoRestriction } = useDemoRestriction();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  /**
   * Validate form data before submission
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.originalUrl) {
      newErrors.originalUrl = "URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.originalUrl)) {
      newErrors.originalUrl =
        "Please enter a valid URL (must start with http:// or https://)";
    }

    if (
      formData.customAlias &&
      !/^[a-zA-Z0-9_-]{3,30}$/.test(formData.customAlias)
    ) {
      newErrors.customAlias =
        "Custom alias must be 3-30 characters (letters, numbers, - and _ only)";
    }

    if (formData.title && formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission with enhanced error handling
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "This action is not available in demo mode. Please use a full account to access all features.",
        "Create url"
      );
      onClose();
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const createData: CreateUrlRequest = {
        originalUrl: formData.originalUrl,
        generateQR: formData.generateQR,
        fetchMetadata: formData.fetchMetadata,
        ...(formData.customAlias && { customAlias: formData.customAlias }),
        ...(formData.title && { title: formData.title }),
        ...(formData.description && { description: formData.description }),
        ...(formData.tags && {
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
        ...(formData.expiresIn && { expiresIn: parseInt(formData.expiresIn) }),
      };

      const response = await api.urls.create(createData);

      if (response.success && response.data) {
        onSuccess(response.data.url);

        // Reset form
        setFormData({
          originalUrl: "",
          customAlias: "",
          title: "",
          description: "",
          tags: "",
          generateQR: true,
          fetchMetadata: true,
          expiresIn: "",
        });
        addNotification(
          "URL Created Successfully!",
          `Short URL created for: ${formData.originalUrl}`
        );
      } else {
        throw new Error(response.message || "Failed to create URL");
      }
    } catch (error) {
      console.error("Error creating URL:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Failed to create URL. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-lg shadow-xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } max-h-[90vh] overflow-y-auto`}
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
            Create Short URL
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Original URL */}
          <motion.div variants={fieldVariants}>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Original URL *
            </label>
            <input
              type="url"
              value={formData.originalUrl}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  originalUrl: e.target.value,
                }))
              }
              className={`input-base ${errors.originalUrl ? "input-error" : ""}`}
              placeholder="https://example.com/very-long-url"
              required
              disabled={loading}
            />
            {errors.originalUrl && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.originalUrl}
              </motion.p>
            )}
          </motion.div>

          {/* Custom Alias */}
          <motion.div variants={fieldVariants}>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Custom Alias (optional)
            </label>
            <div className="flex">
              <span
                className={`inline-flex items-center px-3 border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                } rounded-l-md`}
              >
                snap.ly/
              </span>
              <input
                type="text"
                value={formData.customAlias}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customAlias: e.target.value,
                  }))
                }
                className={`input-base rounded-l-none ${errors.customAlias ? "input-error" : ""}`}
                placeholder="my-link"
                disabled={loading}
              />
            </div>
            {errors.customAlias && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.customAlias}
              </motion.p>
            )}
          </motion.div>

          {/* Title */}
          <motion.div variants={fieldVariants}>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Title (optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={`input-base ${errors.title ? "input-error" : ""}`}
              placeholder="Give your link a memorable title"
              maxLength={100}
              disabled={loading}
            />
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.title}
              </motion.p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div variants={fieldVariants}>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={`input-base ${errors.description ? "input-error" : ""}`}
              placeholder="Add a description for better organization"
              rows={3}
              maxLength={500}
              disabled={loading}
            />
            {errors.description && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.description}
              </motion.p>
            )}
          </motion.div>

          {/* Options */}
          <motion.div
            variants={fieldVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Expires In (days)
              </label>
              <select
                value={formData.expiresIn}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expiresIn: e.target.value,
                  }))
                }
                className="input-base"
                disabled={loading}
              >
                <option value="">Never expires</option>
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>

            <div className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center"
              >
                <input
                  type="checkbox"
                  id="generateQR"
                  checked={formData.generateQR}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      generateQR: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 dark:border-gray-600"
                  disabled={loading}
                />
                <label
                  htmlFor="generateQR"
                  className={`ml-2 text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Generate QR Code
                </label>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center"
              >
                <input
                  type="checkbox"
                  id="fetchMetadata"
                  checked={formData.fetchMetadata}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fetchMetadata: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 dark:border-gray-600"
                  disabled={loading}
                />
                <label
                  htmlFor="fetchMetadata"
                  className={`ml-2 text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Fetch Page Metadata
                </label>
              </motion.div>
            </div>
          </motion.div>

          {/* General Error */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center space-x-2 text-red-500 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.general}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <motion.div
            variants={fieldVariants}
            className="flex justify-end space-x-3 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 rounded-lg"
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create URL</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};