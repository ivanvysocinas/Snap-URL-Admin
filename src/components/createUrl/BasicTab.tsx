/**
 * Basic information tab for URL creation form
 * Handles core URL input, custom alias generation, metadata fetching, and validation
 * Features real-time metadata parsing and automatic form population
 */
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface BasicTabProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  theme: string;
}

export const BasicTab: FC<BasicTabProps> = ({
  formData,
  setFormData,
  errors,
  theme,
}) => {
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [fetchedMetadata, setFetchedMetadata] = useState<any>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Merge external errors with local errors
  const allErrors = { ...localErrors, ...errors };

  /**
   * Validate individual field
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
   * Handle field change with validation
   */
  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setLocalErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  /**
   * Handle field blur
   */
  const handleFieldBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name] || "");
    setLocalErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  /**
   * Get field status icon
   */
  const getFieldIcon = (fieldName: string) => {
    if (!touched[fieldName]) return null;
    if (allErrors[fieldName]) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (formData[fieldName]) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    return null;
  };

  /**
   * Fetch URL metadata using CORS proxy with comprehensive HTML parsing
   * Extracts title, description and Open Graph metadata
   * Automatically populates form fields if they're empty
   */
  const fetchMetadata = async () => {
    if (!formData.originalUrl || !/^https?:\/\/.+/.test(formData.originalUrl))
      return;

    setMetadataLoading(true);
    try {
      // Use proxy to bypass CORS restrictions
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(formData.originalUrl)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();

      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");

        const metadata = {
          title:
            doc.querySelector("title")?.textContent ||
            doc
              .querySelector('meta[property="og:title"]')
              ?.getAttribute("content") ||
            "",
          description:
            doc
              .querySelector('meta[name="description"]')
              ?.getAttribute("content") ||
            doc
              .querySelector('meta[property="og:description"]')
              ?.getAttribute("content") ||
            "",
          image:
            doc
              .querySelector('meta[property="og:image"]')
              ?.getAttribute("content") || "",
          domain: new URL(formData.originalUrl).hostname,
        };

        setFetchedMetadata(metadata);

        // Auto-populate empty fields with fetched metadata
        if (!formData.title && metadata.title) {
          handleFieldChange("title", metadata.title);
        }
        if (!formData.description && metadata.description) {
          handleFieldChange("description", metadata.description);
        }
      }
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    } finally {
      setMetadataLoading(false);
    }
  };

  return (
    <motion.div
      key="basic"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="card p-6 space-y-4"
    >
      <h3
        className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
      >
        Basic Information
      </h3>

      {/* Original URL Input with Metadata Fetch Button */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          >
            Original URL *
          </label>
          {formData.fetchMetadata && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchMetadata}
              disabled={metadataLoading || !formData.originalUrl}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {metadataLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              <span>Fetch Metadata</span>
            </motion.button>
          )}
        </div>
        <div className="relative">
          <input
            type="url"
            value={formData.originalUrl}
            onChange={(e) => handleFieldChange("originalUrl", e.target.value)}
            onBlur={() => handleFieldBlur("originalUrl")}
            placeholder="https://example.com/your-long-url"
            className={`input-base w-full pr-10 transition-all ${
              allErrors.originalUrl && touched.originalUrl
                ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                : formData.originalUrl &&
                    !allErrors.originalUrl &&
                    touched.originalUrl
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/10"
                  : ""
            }`}
            required
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getFieldIcon("originalUrl")}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {allErrors.originalUrl && touched.originalUrl && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start space-x-2 mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 dark:text-red-400 text-sm">
                {allErrors.originalUrl}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Alias Input with Domain Preview */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          Custom Alias (optional)
        </label>
        <div className="relative">
          <div className="flex">
            <span
              className={`inline-flex items-center px-3 border border-r-0 ${
                allErrors.customAlias && touched.customAlias
                  ? "border-red-500"
                  : formData.customAlias &&
                      !allErrors.customAlias &&
                      touched.customAlias
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
                placeholder="my-custom-link"
                className={`input-base rounded-l-none w-full pr-10 transition-all ${
                  allErrors.customAlias && touched.customAlias
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                    : formData.customAlias &&
                        !allErrors.customAlias &&
                        touched.customAlias
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/10"
                      : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getFieldIcon("customAlias")}
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {allErrors.customAlias && touched.customAlias && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start space-x-2 mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 dark:text-red-400 text-sm">
                {allErrors.customAlias}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title Input with Character Limit */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          Title (optional)
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            onBlur={() => handleFieldBlur("title")}
            placeholder="Give your link a memorable title"
            className={`input-base w-full pr-10 transition-all ${
              allErrors.title && touched.title
                ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                : formData.title && !allErrors.title && touched.title
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/10"
                  : ""
            }`}
            maxLength={100}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getFieldIcon("title")}
          </div>
        </div>
        {formData.title && (
          <p
            className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            {formData.title.length}/100 characters
          </p>
        )}
        <AnimatePresence mode="wait">
          {allErrors.title && touched.title && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start space-x-2 mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 dark:text-red-400 text-sm">
                {allErrors.title}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Description Textarea with Character Limit */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          Description (optional)
        </label>
        <div className="relative">
          <textarea
            value={formData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            onBlur={() => handleFieldBlur("description")}
            placeholder="Add a description for better organization"
            className={`input-base w-full pr-10 transition-all ${
              allErrors.description && touched.description
                ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10"
                : formData.description &&
                    !allErrors.description &&
                    touched.description
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/10"
                  : ""
            }`}
            rows={3}
            maxLength={500}
          />
          <div className="absolute right-3 top-3">
            {getFieldIcon("description")}
          </div>
        </div>
        {formData.description && (
          <p
            className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            {formData.description.length}/500 characters
          </p>
        )}
        <AnimatePresence mode="wait">
          {allErrors.description && touched.description && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start space-x-2 mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 dark:text-red-400 text-sm">
                {allErrors.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tags Input with Comma Separation Guide */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          Tags (optional)
        </label>
        <input
          type="text"
          value={formData.tagsString}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              tagsString: e.target.value,
            }))
          }
          placeholder="marketing, campaign, social (comma separated)"
          className="input-base"
        />
        <p
          className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          Separate tags with commas
        </p>
      </div>

      {/* Fetched Metadata Display Panel */}
      <AnimatePresence>
        {fetchedMetadata && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <h5
                className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Metadata Fetched Successfully
              </h5>
            </div>
            <div
              className={`space-y-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              {fetchedMetadata.title && (
                <div>
                  <span className="font-medium">Title:</span>{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    {fetchedMetadata.title}
                  </span>
                </div>
              )}
              {fetchedMetadata.description && (
                <div>
                  <span className="font-medium">Description:</span>{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    {fetchedMetadata.description}
                  </span>
                </div>
              )}
              {fetchedMetadata.domain && (
                <div>
                  <span className="font-medium">Domain:</span>{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    {fetchedMetadata.domain}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
