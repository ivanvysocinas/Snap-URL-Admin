/**
 * Information sidebar for import functionality
 * Provides comprehensive guidance on supported formats, limitations, and troubleshooting
 * Features organized sections with color-coded icons and helpful tips for users
 */
import { FileText, Info } from "lucide-react";

export const ImportSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Supported File Formats Section */}
      <div className="card p-4">
        <h4 className="font-medium dark:text-white mb-3">Supported Formats</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium dark:text-gray-300">
                Export Files
              </span>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Files exported from this platform
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium dark:text-gray-300">CSV files</span>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                url,title,description format
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium dark:text-gray-300">
                Excel files
              </span>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                .xlsx and .xls formats
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium dark:text-gray-300">Text files</span>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                One URL per line
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Import Limitations and Quotas */}
      <div className="card p-4">
        <h4 className="font-medium dark:text-white mb-3">Import Limits</h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <span>Maximum URLs:</span>
            <span className="font-medium">20</span>
          </div>
          <div className="flex items-center justify-between">
            <span>File size limit:</span>
            <span className="font-medium">2MB</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Supported schemes:</span>
            <span className="font-medium">HTTP, HTTPS</span>
          </div>
        </div>
      </div>

      {/* Format Guidelines and Tips */}
      <div className="card p-4">
        <h4 className="font-medium dark:text-white mb-3">Format Tips</h4>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p>Export files from this platform are automatically compatible</p>
          </div>
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p>CSV files should have URL in first column</p>
          </div>
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <p>Title and description columns are optional</p>
          </div>
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <p>URLs must start with http:// or https://</p>
          </div>
        </div>
      </div>

      {/* Performance Optimization Tips */}
      <div className="card p-4">
        <h4 className="font-medium dark:text-white mb-3">Performance Tips</h4>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p>Disable QR generation for faster imports</p>
          </div>
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p>Skip duplicates to avoid unnecessary processing</p>
          </div>
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Large imports may take several minutes</p>
          </div>
        </div>
      </div>

      {/* Troubleshooting Common Issues */}
      <div className="card p-4">
        <h4 className="font-medium dark:text-white mb-3">Common Issues</h4>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-medium text-red-600 dark:text-red-400 mb-1">
              "No URLs found"
            </p>
            <p>Check that URLs start with http:// or https://</p>
          </div>
          <div>
            <p className="font-medium text-yellow-600 dark:text-yellow-400 mb-1">
              "File format error"
            </p>
            <p>Ensure file is CSV, Excel, or plain text</p>
          </div>
          <div>
            <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">
              "Encoding issues"
            </p>
            <p>Save CSV files with UTF-8 encoding</p>
          </div>
        </div>
      </div>
    </div>
  );
};
