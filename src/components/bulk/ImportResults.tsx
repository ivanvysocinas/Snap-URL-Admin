/**
 * Results display component for import operations
 * Shows comprehensive statistics, success rates, and detailed breakdowns
 * Handles different result types: created URLs, skipped entries, and errors
 * Features color-coded status indicators and expandable result lists
 */
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { ShortUrl } from "../../types";
import { FC } from "react";

interface ImportResultsProps {
  results: {
    created: ShortUrl[];
    skipped: any[];
    errors: any[];
    summary: {
      total: number;
      created: number;
      skipped: number;
      errors: number;
    };
  };
}

export const ImportResults: FC<ImportResultsProps> = ({ results }) => {
  const isSuccess = results.summary.created > 0;
  const hasErrors = results.summary.errors > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-8 card p-6 border-l-4 ${
        isSuccess && !hasErrors
          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
          : hasErrors
            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
            : "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      }`}
    >
      {/* Results Header with Status Indicator */}
      <div className="flex items-center space-x-2 mb-4">
        {isSuccess && !hasErrors ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : hasErrors ? (
          <XCircle className="w-6 h-6 text-red-500" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
        )}
        <h3
          className={`text-lg font-semibold ${
            isSuccess && !hasErrors
              ? "text-green-800 dark:text-green-200"
              : hasErrors
                ? "text-red-800 dark:text-red-200"
                : "text-yellow-800 dark:text-yellow-200"
          }`}
        >
          Import{" "}
          {isSuccess && !hasErrors
            ? "Completed Successfully"
            : hasErrors
              ? "Completed with Errors"
              : "Completed with Warnings"}
        </h3>
      </div>

      {/* Summary Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {results.summary.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {results.summary.created}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Created
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {results.summary.skipped}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Skipped
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {results.summary.errors}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
        </div>
      </div>

      {/* Animated Success Rate Progress Bar */}
      {results.summary.total > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">
              Success Rate
            </span>
            <span className="font-medium dark:text-white">
              {Math.round(
                (results.summary.created / results.summary.total) * 100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(results.summary.created / results.summary.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* No Results Warning */}
      {results.summary.created === 0 && results.summary.total > 0 && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300 font-medium">
              No URLs were successfully imported. Please check the errors below.
            </p>
          </div>
        </div>
      )}

      {/* Successfully Created URLs List */}
      {results.created.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-green-800 dark:text-green-200">
            Successfully Created URLs ({results.created.length}):
          </h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {results.created.slice(0, 10).map((url) => (
              <div
                key={url._id}
                className="flex items-center justify-between text-sm p-2 bg-green-100 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-blue-600 dark:text-blue-400 text-xs">
                    snap.ly/{url.shortCode}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 ml-2 truncate">
                    {url.title || url.originalUrl}
                  </span>
                </div>
              </div>
            ))}
            {results.created.length > 10 && (
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-2">
                And {results.created.length - 10} more...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skipped URLs List */}
      {results.skipped.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
            Skipped URLs ({results.skipped.length}):
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {results.skipped.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="text-sm p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-700"
              >
                <div className="text-yellow-800 dark:text-yellow-200">
                  {item.url || item.originalUrl}
                </div>
                <div className="text-xs text-yellow-700 dark:text-yellow-300">
                  Reason: {item.reason || "Already exists"}
                </div>
              </div>
            ))}
            {results.skipped.length > 5 && (
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-2">
                And {results.skipped.length - 5} more...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error URLs List */}
      {results.errors.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-red-800 dark:text-red-200">
            Failed URLs ({results.errors.length}):
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {results.errors.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="text-sm p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-700"
              >
                <div className="text-red-800 dark:text-red-200">
                  {item.url || item.originalUrl}
                </div>
                <div className="text-xs text-red-700 dark:text-red-300">
                  Error: {item.error || item.message || "Unknown error"}
                </div>
              </div>
            ))}
            {results.errors.length > 5 && (
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-2">
                And {results.errors.length - 5} more...
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
