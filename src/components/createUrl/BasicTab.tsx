/**
 * Basic information tab for URL creation form
 * Handles core URL input, custom alias generation, metadata fetching, and validation
 * Features real-time metadata parsing and automatic form population
 */
import { FC, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Loader2 } from "lucide-react";

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
}) => {
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [fetchedMetadata, setFetchedMetadata] = useState<any>(null);

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
          setFormData((prev: any) => ({ ...prev, title: metadata.title }));
        }
        if (!formData.description && metadata.description) {
          setFormData((prev: any) => ({
            ...prev,
            description: metadata.description,
          }));
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
      <h3 className="text-lg font-semibold dark:text-white">
        Basic Information
      </h3>

      {/* Original URL Input with Metadata Fetch Button */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium dark:text-gray-300">
            Original URL *
          </label>
          {formData.fetchMetadata && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchMetadata}
              disabled={metadataLoading || !formData.originalUrl}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
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
        <input
          type="url"
          value={formData.originalUrl}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              originalUrl: e.target.value,
            }))
          }
          placeholder="https://example.com/your-long-url"
          className={`input-base ${errors.originalUrl ? "border-red-500" : ""}`}
          required
        />
        {errors.originalUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.originalUrl}</p>
        )}
      </div>

      {/* Custom Alias Input with Domain Preview */}
      <div>
        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
          Custom Alias (optional)
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400 rounded-l-md">
            snap.ly/
          </span>
          <input
            type="text"
            value={formData.customAlias}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                customAlias: e.target.value,
              }))
            }
            placeholder="my-custom-link"
            className={`input-base rounded-l-none ${errors.customAlias ? "border-red-500" : ""}`}
          />
        </div>
        {errors.customAlias && (
          <p className="text-red-500 text-sm mt-1">{errors.customAlias}</p>
        )}
      </div>

      {/* Title Input with Character Limit */}
      <div>
        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Give your link a memorable title"
          className={`input-base ${errors.title ? "border-red-500" : ""}`}
          maxLength={100}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description Textarea with Character Limit */}
      <div>
        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Add a description for better organization"
          className={`input-base ${errors.description ? "border-red-500" : ""}`}
          rows={3}
          maxLength={500}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Tags Input with Comma Separation Guide */}
      <div>
        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
          Tags
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Separate tags with commas
        </p>
      </div>

      {/* Fetched Metadata Display Panel */}
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
    </motion.div>
  );
};
