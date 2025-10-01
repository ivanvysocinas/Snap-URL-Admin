/**
 * Bulk URL creation component for processing multiple URLs simultaneously
 * Features textarea input for multiple URLs, batch processing options, and submission handling
 * Includes validation for URL format and provides options for QR generation and metadata fetching
 */
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { FC } from "react";

interface BulkCreateModeProps {
  bulkUrls: string;
  setBulkUrls: (urls: string) => void;
  formData: any;
  setFormData: (data: any) => void;
  loading: boolean;
  errors: Record<string, string>;
  onSubmit: () => void;
  theme: string;
}

export const BulkCreateMode: FC<BulkCreateModeProps> = ({
  bulkUrls,
  setBulkUrls,
  formData,
  setFormData,
  loading,
  errors,
  onSubmit,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card p-6"
  >
    <h3 className="text-lg font-semibold mb-4 dark:text-white">
      Bulk URL Creation
    </h3>

    <div className="space-y-4">
      {/* Bulk URLs Textarea */}
      <div>
        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
          URLs (one per line)
        </label>
        <textarea
          value={bulkUrls}
          onChange={(e) => setBulkUrls(e.target.value)}
          placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
          className="input-base h-48"
          disabled={loading}
        />
        {errors.bulk && (
          <p className="text-red-500 text-sm mt-1">{errors.bulk}</p>
        )}
      </div>

      {/* Batch Processing Options */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.generateQR}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                generateQR: e.target.checked,
              }))
            }
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="ml-2 text-sm dark:text-gray-300">
            Generate QR codes
          </span>
        </label>

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
            Fetch metadata
          </span>
        </label>
      </div>

      {/* Submit Button with Loading State */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSubmit}
        disabled={loading || !bulkUrls.trim()}
        className="btn-primary px-6 py-3 rounded-lg flex items-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating URLs...</span>
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>Create URLs</span>
          </>
        )}
      </motion.button>
    </div>
  </motion.div>
);
