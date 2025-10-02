"use client";

import { useState, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [apiError, setApiError] = useState<string>("");
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
   * Validate individual field in real-time
   */
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "originalUrl":
        if (!value) return "URL is required";
        if (!/^https?:\/\/.+\..+/.test(value))
          return "Enter a valid URL (e.g., https://example.com)";
        return "";
      
      case "customAlias":
        if (!value) return "";
        if (value.length < 3) return "Alias must be at least 3 characters";
        if (value.length > 30) return "Alias must be less than 30 characters";
        if (!/^[a-zA-Z0-9_-]+$/.test(value))
          return "Only letters, numbers, hyphens and underscores allowed";
        return "";
      
      case "title":
        if (!value) return "";
        if (value.length > 100) return "Title must be less than 100 characters";
        return "";
      
      case "description":
        if (!value) return "";
        if (value.length > 500)
          return "Description must be less than 500 characters";
        return "";
      
      default:
        return "";
    }
  };

  /**
   * Handle field change with real-time validation
   */
  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear API error when user starts typing
    if (apiError) setApiError("");
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  /**
   * Handle field blur to mark as touched
   */
  const handleFieldBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData] as string);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  /**
   * Validate form data before submission
   */
  const validateForm = (): boolean => {
    const fields = ["originalUrl", "customAlias", "title", "description"];
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    fields.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(
        field,
        formData[field as keyof typeof formData] as string
      );
      if (error) newErrors[field] = error;
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Check if form has any errors
   */
  const hasErrors = (): boolean => {
    return Object.values(errors).some((error) => error !== "");
  };

  /**
   * Check if required fields are filled
   */
  const isFormValid = (): boolean => {
    return formData.originalUrl !== "" && !hasErrors();
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
    setApiError("");

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
        setTouched({});
        setErrors({});
        setApiError("");
        addNotification(
          "URL Created Successfully!",
          `Short URL created for: ${formData.originalUrl}`
        );
      } else {
        throw new Error(response.message || "Failed to create URL");
      }
    } catch (error) {
      console.error("Error creating URL:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to create URL. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get field status icon
   */
  const getFieldIcon = (fieldName: string) => {
    if (!touched[fieldName]) return null;
    if (errors[fieldName]) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (formData[fieldName as keyof typeof formData]) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    return null;
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
            <div className="relative">
              <input
                type="url"
                value={formData.originalUrl}
                onChange={(e) =>
                  handleFieldChange("originalUrl", e.target.value)
                }
                onBlur={() => handleFieldBlur("originalUrl")}
                className={`input-base w-full pr-10 transition-all ${
                  errors.originalUrl && touched.originalUrl
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                    : formData.originalUrl && !errors.originalUrl && touched.originalUrl
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/10"
                      : ""
                }`}
                placeholder="https://example.com/very-long-url"
                required
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getFieldIcon("originalUrl")}
              </div>
            </div>
            <AnimatePresence mode="wait">
              {errors.originalUrl && touched.originalUrl && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start space-x-2 mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.originalUrl}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
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
            <div className="relative">
              <div className="flex">
                <span
                  className={`inline-flex items-center px-3 border border-r-0 ${
                    errors.customAlias && touched.customAlias
                      ? "border-red-500"
                      : formData.customAlias && !errors.customAlias && touched.customAlias
                        ? "border-green-500"
                        : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-700 text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  } rounded-l-md transition-all`}
                >
                  {process.env.NEXT_PUBLIC_API_URL}/
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={formData.customAlias}
                    onChange={(e) =>
                      handleFieldChange("customAlias", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("customAlias")}
                    className={`input-base rounded-l-none w-full pr-10 transition-all ${
                      errors.customAlias && touched.customAlias
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                        : formData.customAlias && !errors.customAlias && touched.customAlias
                          ? "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/10"
                          : ""
                    }`}
                    placeholder="my-link"
                    disabled={loading}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getFieldIcon("customAlias")}
                  </div>
                </div>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {errors.customAlias && touched.customAlias && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start space-x-2 mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.customAlias}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
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
            <div className="relative">
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  handleFieldChange("title", e.target.value)
                }
                onBlur={() => handleFieldBlur("title")}
                className={`input-base w-full pr-10 transition-all ${
                  errors.title && touched.title
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                    : formData.title && !errors.title && touched.title
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/10"
                      : ""
                }`}
                placeholder="Give your link a memorable title"
                maxLength={100}
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getFieldIcon("title")}
              </div>
            </div>
            {formData.title && (
              <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {formData.title.length}/100 characters
              </p>
            )}
            <AnimatePresence mode="wait">
              {errors.title && touched.title && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start space-x-2 mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.title}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
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
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                onBlur={() => handleFieldBlur("description")}
                className={`input-base w-full pr-10 transition-all ${
                  errors.description && touched.description
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                    : formData.description && !errors.description && touched.description
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/10"
                      : ""
                }`}
                placeholder="Add a description for better organization"
                rows={3}
                maxLength={500}
                disabled={loading}
              />
              <div className="absolute right-3 top-3">
                {getFieldIcon("description")}
              </div>
            </div>
            {formData.description && (
              <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {formData.description.length}/500 characters
              </p>
            )}
            <AnimatePresence mode="wait">
              {errors.description && touched.description && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start space-x-2 mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
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

          {/* API Error */}
          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-start space-x-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    Error Creating URL
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {apiError}
                  </p>
                </div>
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
              whileHover={!loading && isFormValid() ? { scale: 1.02 } : {}}
              whileTap={!loading && isFormValid() ? { scale: 0.98 } : {}}
              type="submit"
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                loading || !isFormValid()
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60"
                  : "btn-primary"
              }`}
              disabled={loading || !isFormValid()}
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