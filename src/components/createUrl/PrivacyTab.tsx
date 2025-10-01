/**
 * Privacy and security settings tab with coming soon feature placeholders
 * Most privacy controls are disabled and trigger coming soon modals when clicked
 * Features visual icons for different privacy settings and clear disabled state styling
 */
import { motion } from "framer-motion";
import { Globe, Eye, MousePointer, BarChart3 } from "lucide-react";
import { FC } from "react";

interface PrivacyTabProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  theme: string;
  onComingSoon: (feature: string) => void;
}

export const PrivacyTab: FC<PrivacyTabProps> = ({ onComingSoon }) => (
  <motion.div
    key="privacy"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="card p-6 space-y-4"
  >
    <h3 className="text-lg font-semibold dark:text-white">
      Privacy & Security
    </h3>

    {/* Password Protection - Coming Soon */}
    <div className="space-y-3">
      <label
        className="flex items-center cursor-pointer"
        onClick={() => onComingSoon("Password Protection")}
      >
        <input
          type="checkbox"
          checked={false}
          className="rounded border-gray-300 dark:border-gray-600 opacity-50"
          disabled
        />
        <span className="ml-2 text-sm font-medium dark:text-gray-300">
          Password Protection (Coming Soon)
        </span>
      </label>
    </div>

    {/* Privacy Visibility Settings - Coming Soon */}
    <div className="space-y-3">
      <h4 className="font-medium dark:text-white">
        Visibility Settings (Coming Soon)
      </h4>

      <div className="space-y-2 opacity-50">
        <label
          className="flex items-center justify-between cursor-pointer"
          onClick={() => onComingSoon("Public URL Settings")}
        >
          <div className="flex items-center">
            <Globe className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm dark:text-gray-300">Public URL</span>
          </div>
          <input
            type="checkbox"
            checked={true}
            className="rounded border-gray-300 dark:border-gray-600"
            disabled
          />
        </label>

        <label
          className="flex items-center justify-between cursor-pointer"
          onClick={() => onComingSoon("Preview Settings")}
        >
          <div className="flex items-center">
            <Eye className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm dark:text-gray-300">Allow Preview</span>
          </div>
          <input
            type="checkbox"
            checked={true}
            className="rounded border-gray-300 dark:border-gray-600"
            disabled
          />
        </label>

        <label
          className="flex items-center justify-between cursor-pointer"
          onClick={() => onComingSoon("Click Tracking")}
        >
          <div className="flex items-center">
            <MousePointer className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm dark:text-gray-300">
              Enable Click Tracking
            </span>
          </div>
          <input
            type="checkbox"
            checked={true}
            className="rounded border-gray-300 dark:border-gray-600"
            disabled
          />
        </label>

        <label
          className="flex items-center justify-between cursor-pointer"
          onClick={() => onComingSoon("Public Statistics")}
        >
          <div className="flex items-center">
            <BarChart3 className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm dark:text-gray-300">
              Public Statistics
            </span>
          </div>
          <input
            type="checkbox"
            checked={true}
            className="rounded border-gray-300 dark:border-gray-600"
            disabled
          />
        </label>
      </div>
    </div>

    {/* URL Expiration - Coming Soon */}
    <div className="space-y-3">
      <label
        className="flex items-center cursor-pointer"
        onClick={() => onComingSoon("URL Expiration")}
      >
        <input
          type="checkbox"
          checked={false}
          className="rounded border-gray-300 dark:border-gray-600 opacity-50"
          disabled
        />
        <span className="ml-2 text-sm font-medium dark:text-gray-300">
          Set Expiration Date (Coming Soon)
        </span>
      </label>
    </div>
  </motion.div>
);
