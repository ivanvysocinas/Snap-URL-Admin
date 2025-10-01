import { FC, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  QrCode,
  Palette,
  Save,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";
import { useComingSoon } from "@/hooks/useComingSoonModal";
import api from "../../lib/api";

/**
 * User preferences tab component
 * Manages QR code defaults and interface settings with demo restrictions
 */
interface PreferencesTabProps {
  variants: any;
  loading: Record<string, boolean>;
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  success: Record<string, boolean>;
  setSuccess: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const PreferencesTab: FC<PreferencesTabProps> = ({
  variants,
  loading,
  setLoading,
  errors,
  setErrors,
  success,
  setSuccess,
}) => {
  const { user, updateProfile } = useAuth();
  const { showDemoRestriction } = useDemoRestriction();
  const { showComingSoon } = useComingSoon();

  // Preferences form state
  const [preferences, _setPreferences] = useState({
    defaultQRSize: user?.preferences?.defaultQRSize || 256,
    defaultQRColor: user?.preferences?.defaultQRColor || "#000000",
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    darkMode: user?.preferences?.darkMode ?? false,
    language: user?.preferences?.language || "en",
  });

  /**
   * Handle preferences update with demo restriction check
   */
  const handlePreferencesUpdate = async () => {
    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "Preferences update is not available in demo mode. Please use a full account to access all features.",
        "Update Preferences"
      );
      return;
    }

    setLoading((prev) => ({ ...prev, preferences: true }));
    setErrors({});

    try {
      const response = await api.auth.updateProfile({
        preferences: {
          defaultQRSize: preferences.defaultQRSize as 128 | 256 | 512 | 1024,
          defaultQRColor: preferences.defaultQRColor,
          emailNotifications: preferences.emailNotifications,
          darkMode: preferences.darkMode,
          language: preferences.language,
        },
      });

      if (response.success && response.data) {
        updateProfile(response.data.user);
        setSuccess((prev) => ({ ...prev, preferences: true }));
        setTimeout(
          () => setSuccess((prev) => ({ ...prev, preferences: false })),
          3000
        );
      } else {
        throw new Error(response.message || "Failed to update preferences");
      }
    } catch (error) {
      setErrors({
        preferences:
          error instanceof Error
            ? error.message
            : "Failed to update preferences",
      });
    } finally {
      setLoading((prev) => ({ ...prev, preferences: false }));
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="card p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold dark:text-white">Preferences</h3>
      </div>

      <div className="space-y-6">
        {/* QR Code Defaults */}
        <div>
          <h4 className="font-medium dark:text-white mb-4 flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-purple-500" />
            <span>QR Code Defaults</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Default Size
              </label>
              <div
                className="relative"
                onClick={() =>
                  showComingSoon(
                    "QR Size Settings",
                    "Custom QR code size selection is coming soon!"
                  )
                }
              >
                <select
                  value={preferences.defaultQRSize}
                  className="input-base cursor-pointer opacity-75 pointer-events-none"
                  disabled
                >
                  <option value={128}>128x128</option>
                  <option value={256}>256x256</option>
                  <option value={512}>512x512</option>
                  <option value={1024}>1024x1024</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Default Color
              </label>
              <div
                className="flex space-x-2"
                onClick={() =>
                  showComingSoon(
                    "QR Color Settings",
                    "Custom QR code colors are coming soon!"
                  )
                }
              >
                <input
                  type="color"
                  value={preferences.defaultQRColor}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer opacity-75 pointer-events-none"
                  disabled
                />
                <input
                  type="text"
                  value={preferences.defaultQRColor}
                  className="input-base flex-1 cursor-pointer opacity-75 pointer-events-none"
                  placeholder="#000000"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interface Preferences */}
        <div>
          <h4 className="font-medium dark:text-white mb-4 flex items-center space-x-2">
            <Palette className="w-5 h-5 text-green-500" />
            <span>Interface</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Language
              </label>
              <div
                className="relative"
                onClick={() =>
                  showComingSoon(
                    "Language Settings",
                    "Multiple language support is coming soon!"
                  )
                }
              >
                <select
                  value={preferences.language}
                  className="input-base cursor-pointer opacity-75 pointer-events-none"
                  disabled
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            </div>

            <label
              className="flex items-center cursor-pointer"
              onClick={() =>
                showComingSoon(
                  "Dark Mode Toggle",
                  "Theme switching is coming soon!"
                )
              }
            >
              <input
                type="checkbox"
                checked={preferences.darkMode}
                className="rounded border-gray-300 dark:border-gray-600 opacity-75 pointer-events-none"
                disabled
              />
              <span className="ml-2 text-sm dark:text-gray-300">
                Enable dark mode by default
              </span>
            </label>

            <label
              className="flex items-center cursor-pointer"
              onClick={() =>
                showComingSoon(
                  "Email Notifications",
                  "Email Notifications is coming soon!"
                )
              }
            >
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                className="rounded border-gray-300 dark:border-gray-600 opacity-75 pointer-events-none"
                disabled
              />
              <span className="ml-2 text-sm dark:text-gray-300">
                Enable email notifications
              </span>
            </label>
          </div>
        </div>

        {/* Error/Success Messages */}
        {errors.preferences && (
          <div className="flex items-center space-x-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.preferences}</span>
          </div>
        )}

        {success.preferences && (
          <div className="flex items-center space-x-2 text-green-500 text-sm">
            <Check className="w-4 h-4" />
            <span>Preferences updated successfully!</span>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePreferencesUpdate}
            disabled={loading.preferences}
            className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            {loading.preferences ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
