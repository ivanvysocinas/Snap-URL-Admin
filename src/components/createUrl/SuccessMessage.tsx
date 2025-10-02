/**
 * Success notification component displayed after URL creation
 * Features animated appearance, one-click copy functionality, and dismissible interface
 * Displays the shortened URL with proper formatting and interactive elements
 */
import { motion } from "framer-motion";
import { Check, Copy, Trash2 } from "lucide-react";
import api from "../../lib/api";
import { ShortUrl } from "@/types";
import { FC } from "react";

interface SuccessMessageProps {
  createdUrl: ShortUrl;
  onDismiss: () => void;
  theme: string;
}

export const SuccessMessage: FC<SuccessMessageProps> = ({
  createdUrl,
  onDismiss,
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
  >
    <div className="flex items-center space-x-2">
      <Check className="w-5 h-5 text-green-500" />
      <div className="flex-1">
        <p className="text-green-700 dark:text-green-400 font-medium">
          URL created successfully!
        </p>
        <div className="flex items-center space-x-3 mt-2">
          <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
            {process.env.NEXT_PUBLIC_API_URL}/{createdUrl.shortCode}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              api.utils.copyToClipboard(`${process.env.NEXT_PUBLIC_API_URL}/${createdUrl.shortCode}`)
            }
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDismiss}
        className="text-green-600 dark:text-green-400"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>
  </motion.div>
);
