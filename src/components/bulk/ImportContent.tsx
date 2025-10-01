/**
 * Content component managing different import input methods
 * Handles file upload validation, text parsing, and bookmark import instructions
 * Features animated transitions between input methods and real-time validation feedback
 */
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Info } from "lucide-react";
import { FC } from "react";

interface ImportContentProps {
  importMethod: "file" | "text" | "bookmarks";
  file: File | null;
  setFile: (file: File | null) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  loading: boolean;
  parseTextInput: () => Array<{
    originalUrl: string;
    title?: string;
    description?: string;
  }>;
}

export const ImportContent: FC<ImportContentProps> = ({
  importMethod,
  file,
  setFile,
  textInput,
  setTextInput,
  fileInputRef,
  errors,
  setErrors,
  loading,
  parseTextInput,
}) => {
  /**
   * Handle file selection with comprehensive validation
   * Validates file type against allowed formats and updates error state
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
      ];

      if (
        allowedTypes.includes(selectedFile.type) ||
        selectedFile.name.endsWith(".csv") ||
        selectedFile.name.endsWith(".txt")
      ) {
        setFile(selectedFile);
        setErrors({});
      } else {
        setErrors({ file: "Please select a CSV, Excel, or text file" });
      }
    }
  };

  return (
    <div className="card p-6">
      <AnimatePresence mode="wait">
        {/* File Upload Interface */}
        {importMethod === "file" && (
          <motion.div
            key="file"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-lg font-semibold dark:text-white mb-4">
              Upload File
            </h3>

            <div className="space-y-4">
              {/* Format Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">
                      Supported Formats:
                    </h4>
                    <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>
                        • <strong>Export Format:</strong> Files exported from
                        this platform
                      </li>
                      <li>
                        • <strong>Simple Format:</strong> url,title,description
                        columns
                      </li>
                      <li>
                        • <strong>Text Format:</strong> One URL per line
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* File Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  file
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-2">
                    <Check className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="font-medium dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary px-4 py-2 rounded-lg"
                    >
                      Change File
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="font-medium dark:text-white">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Supports CSV, Excel (.xlsx), and text files
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary px-4 py-2 rounded-lg"
                    >
                      Select File
                    </motion.button>
                  </div>
                )}
              </div>

              {errors.file && (
                <p className="text-red-500 text-sm">{errors.file}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Text Input Interface */}
        {importMethod === "text" && (
          <motion.div
            key="text"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-lg font-semibold dark:text-white mb-4">
              Paste URLs
            </h3>

            <div className="space-y-4">
              {/* Text Input Guidelines */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-200">
                      Text Input Tips:
                    </h4>
                    <ul className="mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Paste one URL per line</li>
                      <li>• URLs must start with http:// or https://</li>
                      <li>• Empty lines will be ignored</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Text Area with Real-time Validation */}
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your URLs here (one per line)...&#10;https://example.com&#10;https://google.com&#10;https://github.com"
                className="input-base h-64 w-full"
                disabled={loading}
              />

              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Valid URLs found:{" "}
                <span className="font-medium">{parseTextInput().length}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bookmarks Import Interface */}
        {importMethod === "bookmarks" && (
          <motion.div
            key="bookmarks"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-lg font-semibold dark:text-white mb-4">
              Import Bookmarks
            </h3>

            <div className="space-y-4">
              {/* Bookmark Export Instructions */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-200">
                      How to export bookmarks:
                    </h4>
                    <ol className="mt-2 text-sm text-purple-700 dark:text-purple-300 space-y-1">
                      <li>1. Open your browser's bookmark manager</li>
                      <li>2. Find "Export bookmarks" or "Export to HTML"</li>
                      <li>3. Save the HTML file</li>
                      <li>
                        4. Upload the file using the File Upload method above
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Alternative Text Input for Bookmarks */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                      Alternative: Paste URLs
                    </h4>
                    <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      You can also manually copy and paste bookmark URLs in the
                      text area below.
                    </p>
                  </div>
                </div>
              </div>

              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or paste your bookmark URLs here (one per line)...&#10;https://bookmark1.com&#10;https://bookmark2.com"
                className="input-base h-32 w-full"
                disabled={loading}
              />

              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Valid URLs found:{" "}
                <span className="font-medium">{parseTextInput().length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
