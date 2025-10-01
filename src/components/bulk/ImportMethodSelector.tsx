/**
 * Method selection component for import operations
 * Provides three import options: file upload, direct text input, and bookmark import
 * Features animated hover effects and visual active state indicators
 */
import { motion } from "framer-motion";
import { FileText, Globe, Bookmark } from "lucide-react";
import { FC } from "react";

interface ImportMethodSelectorProps {
  importMethod: "file" | "text" | "bookmarks";
  setImportMethod: (method: "file" | "text" | "bookmarks") => void;
}

export const ImportMethodSelector: FC<ImportMethodSelectorProps> = ({
  importMethod,
  setImportMethod,
}) => {
  const methods = [
    {
      id: "file" as const,
      icon: FileText,
      title: "File Upload",
      description: "CSV, Excel, or text file",
      color: "blue",
    },
    {
      id: "text" as const,
      icon: Globe,
      title: "Text Input",
      description: "Paste URLs directly",
      color: "green",
    },
    {
      id: "bookmarks" as const,
      icon: Bookmark,
      title: "Bookmarks",
      description: "Import browser bookmarks",
      color: "purple",
    },
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold dark:text-white mb-4">
        Import Method
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map((method) => {
          const Icon = method.icon;
          const isActive = importMethod === method.id;

          return (
            <motion.button
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setImportMethod(method.id)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                isActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Icon
                className={`w-8 h-8 mx-auto mb-2 ${
                  method.color === "blue"
                    ? "text-blue-500"
                    : method.color === "green"
                      ? "text-green-500"
                      : "text-purple-500"
                }`}
              />
              <div className="font-medium dark:text-white">{method.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {method.description}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
