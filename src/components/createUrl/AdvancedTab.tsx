/**
 * Advanced settings tab for URL creation form
 * Handles metadata fetching with auto-detection and displays coming soon features
 * Features DOM parsing for extracting page metadata from external URLs
 */
import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

interface AdvancedTabProps {
  formData: any;
  setFormData: (data: any) => void;
  theme: string;
  onComingSoon: (feature: string) => void;
}

export const AdvancedTab: FC<AdvancedTabProps> = ({
  formData,
  setFormData,
  onComingSoon,
}) => {
  const [fetchedMetadata, setFetchedMetadata] = useState<any>(null);

  /**
   * Auto-fetch metadata when URL changes if enabled
   */
  useEffect(() => {
    if (formData.fetchMetadata && formData.originalUrl) {
      fetchMetadata();
    }
  }, [formData.originalUrl, formData.fetchMetadata]);

  /**
   * Fetch URL metadata using proxy service to bypass CORS restrictions
   * Parses HTML to extract title, description and Open Graph data
   */
  const fetchMetadata = async () => {
    if (!formData.originalUrl || !/^https?:\/\/.+/.test(formData.originalUrl))
      return;

    try {
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
      }
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    }
  };

  return (
    <motion.div
      key="advanced"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="card p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold dark:text-white">
        Advanced Options
      </h3>

      {/* Metadata Settings */}
      <div className="space-y-3">
        <h4 className="font-medium dark:text-white">Metadata</h4>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.fetchMetadata}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                fetchMetadata: e.target.checked,
              }))
            }
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="ml-2 text-sm dark:text-gray-300">
            Auto-fetch page metadata
          </span>
        </label>

        {/* Display fetched metadata results */}
        {fetchedMetadata && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <h5 className="text-sm font-medium dark:text-white mb-2">
              Fetched Metadata:
            </h5>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <p>
                <strong>Title:</strong> {fetchedMetadata.title}
              </p>
              <p>
                <strong>Description:</strong> {fetchedMetadata.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Settings - Coming Soon Section */}
      <div className="space-y-3">
        <h4 className="font-medium dark:text-white">Analytics (Coming Soon)</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-50">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={true}
              className="rounded border-gray-300 dark:border-gray-600"
              disabled
            />
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              Basic Analytics (Always On)
            </span>
          </label>

          <label
            className="flex items-center cursor-pointer"
            onClick={() => onComingSoon("Detailed Tracking")}
          >
            <input
              type="checkbox"
              checked={false}
              className="rounded border-gray-300 dark:border-gray-600"
              disabled
            />
            <span className="ml-2 text-sm dark:text-gray-300">
              Detailed Tracking
            </span>
          </label>
        </div>
      </div>

      {/* Custom Domain - Coming Soon Section */}
      <div className="space-y-3">
        <h4 className="font-medium dark:text-white">
          Custom Domain (Coming Soon)
        </h4>
        <div
          className="relative cursor-pointer"
          onClick={() => onComingSoon("Custom Domain")}
        >
          <input
            type="text"
            placeholder="custom.domain.com (Coming Soon)"
            className="input-base opacity-50"
            disabled
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Info className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Custom domains will be available in a future update
        </p>
      </div>
    </motion.div>
  );
};
