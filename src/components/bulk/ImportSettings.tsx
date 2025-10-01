/**
 * Configuration component for import operations
 * Manages import options including QR generation, metadata fetching, and duplicate handling
 * Features loading states, validation checks, and animated import button with progress indicator
 */
import { motion } from "framer-motion";
import { Upload, Loader2 } from "lucide-react";
import { FC } from "react";

interface ImportSettingsProps {
  settings: {
    generateQR: boolean;
    fetchMetadata: boolean;
    skipDuplicates: boolean;
    customDomain: string;
  };
  setSettings: React.Dispatch<
    React.SetStateAction<{
      generateQR: boolean;
      fetchMetadata: boolean;
      skipDuplicates: boolean;
      customDomain: string;
    }>
  >;
  loading: boolean;
  processing: boolean;
  file: File | null;
  textInput: string;
  onImport: () => void;
}

export const ImportSettings: FC<ImportSettingsProps> = ({
  settings,
  setSettings,
  loading,
  processing,
  file,
  textInput,
  onImport,
}) => {
  const canImport = !loading && (file || textInput.trim());

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold dark:text-white mb-4">
        Import Settings
      </h3>

      <div className="space-y-4">
        {/* QR Code Generation Setting */}
        <label className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.generateQR}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  generateQR: e.target.checked,
                }))
              }
              className="rounded border-gray-300 dark:border-gray-600"
              disabled={loading}
            />
            <span className="ml-2 text-sm dark:text-gray-300">
              Generate QR codes
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            May slow down import
          </span>
        </label>

        {/* Metadata Fetching Setting */}
        <label className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.fetchMetadata}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  fetchMetadata: e.target.checked,
                }))
              }
              className="rounded border-gray-300 dark:border-gray-600"
              disabled={loading}
            />
            <span className="ml-2 text-sm dark:text-gray-300">
              Fetch page metadata
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Recommended
          </span>
        </label>

        {/* Skip Duplicates Setting */}
        <label className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.skipDuplicates}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  skipDuplicates: e.target.checked,
                }))
              }
              className="rounded border-gray-300 dark:border-gray-600"
              disabled={loading}
            />
            <span className="ml-2 text-sm dark:text-gray-300">
              Skip duplicate URLs
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Saves API calls
          </span>
        </label>

        {/* Processing Status Indicator */}
        {processing && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Processing URLs... This may take a few moments.
              </span>
            </div>
          </div>
        )}

        {/* Import Action Button */}
        <div className="pt-4">
          <motion.button
            whileHover={{ scale: canImport ? 1.02 : 1 }}
            whileTap={{ scale: canImport ? 0.98 : 1 }}
            onClick={onImport}
            disabled={!canImport}
            className={`w-full px-6 py-3 rounded-lg flex items-center justify-center space-x-2 ${
              canImport
                ? "btn-primary"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Start Import</span>
              </>
            )}
          </motion.button>

          {!canImport && !loading && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Please select a file or enter URLs to import
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
