import { FC, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Download,
  Save,
  Loader2,
  Check,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";
import { useComingSoon } from "@/hooks/useComingSoonModal";
import api from "../../lib/api";

/**
 * Notifications and account management tab component
 * Handles notification settings, data export, and account deactivation with demo restrictions
 */
interface NotificationsTabProps {
  variants: any;
  loading: Record<string, boolean>;
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  success: Record<string, boolean>;
  setSuccess: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const NotificationsTab: FC<NotificationsTabProps> = ({
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
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");

  // Preferences state for notifications
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    securityAlerts: true, // Always enabled
    productUpdates: false,
    marketingCommunications: false,
  });

  /**
   * Handle notification preferences update with demo restriction check
   */
  const handlePreferencesUpdate = async () => {
    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "Notification settings update is not available in demo mode. Please use a full account to access all features.",
        "Update Notification Settings"
      );
      return;
    }

    setLoading((prev) => ({ ...prev, preferences: true }));
    setErrors({});

    try {
      const response = await api.auth.updateProfile({
        preferences: {
          defaultQRSize: user?.preferences?.defaultQRSize || 256,
          defaultQRColor: user?.preferences?.defaultQRColor || "#000000",
          emailNotifications: preferences.emailNotifications,
          darkMode: user?.preferences?.darkMode ?? false,
          language: user?.preferences?.language || "en",
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
        throw new Error(
          response.message || "Failed to update notification settings"
        );
      }
    } catch (error) {
      setErrors({
        preferences:
          error instanceof Error
            ? error.message
            : "Failed to update notification settings",
      });
    } finally {
      setLoading((prev) => ({ ...prev, preferences: false }));
    }
  };

  /**
   * Handle data export request with demo restriction check
   */
  const handleDataExport = async () => {
    setLoading((prev) => ({ ...prev, export: true }));
    setErrors({});

    try {
      // Export URLs data as CSV
      const csvData = await api.urls.export({
        format: "csv",
        includeAnalytics: true,
        includeInactive: false,
      });

      // Create and download file
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `account-data-export-${new Date().toISOString().slice(0, 10)}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess((prev) => ({ ...prev, export: true }));
      setTimeout(
        () => setSuccess((prev) => ({ ...prev, export: false })),
        5000
      );
    } catch (error) {
      setErrors({
        export:
          error instanceof Error ? error.message : "Failed to export data",
      });
    } finally {
      setLoading((prev) => ({ ...prev, export: false }));
    }
  };

  /**
   * Handle account deactivation with demo restriction check
   */
  const handleDeactivate = async () => {
    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "Account deactivation is not available in demo mode. Please use a full account to access all features.",
        "Deactivate Account"
      );
      return;
    }

    if (!showDeactivateConfirm) {
      setShowDeactivateConfirm(true);
      return;
    }

    setLoading((prev) => ({ ...prev, deactivate: true }));
    setErrors({});

    try {
      const response = await api.auth.deactivateAccount(
        deactivateReason || undefined
      );

      if (response.success) {
        setSuccess((prev) => ({ ...prev, deactivate: true }));
        // In real app, would redirect to logout or deactivation confirmation page
        setTimeout(() => {
          alert("Account deactivation initiated. You will be logged out.");
        }, 1000);
      } else {
        throw new Error(response.message || "Failed to deactivate account");
      }
    } catch (error) {
      setErrors({
        deactivate:
          error instanceof Error
            ? error.message
            : "Failed to deactivate account",
      });
    } finally {
      setLoading((prev) => ({ ...prev, deactivate: false }));
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
        <Bell className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold dark:text-white">
          Notification Settings
        </h3>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h4 className="font-medium dark:text-white mb-4 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <span>Email Notifications</span>
          </h4>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium dark:text-white">
                  Weekly Reports
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get weekly analytics summaries via email
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    emailNotifications: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 dark:border-gray-600"
                disabled={loading.preferences}
              />
            </label>

            <label
              className="flex items-center justify-between cursor-pointer"
              onClick={() =>
                showComingSoon(
                  "Security Alerts",
                  "Advanced security notification settings are coming soon!"
                )
              }
            >
              <div>
                <span className="font-medium dark:text-white">
                  Security Alerts
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notifications about login attempts and security events
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.securityAlerts}
                className="rounded border-gray-300 dark:border-gray-600 pointer-events-none opacity-75"
                disabled
              />
            </label>

            <label
              className="flex items-center justify-between cursor-pointer"
              onClick={() =>
                showComingSoon(
                  "Product Updates",
                  "Product update notifications are coming soon!"
                )
              }
            >
              <div>
                <span className="font-medium dark:text-white">
                  Product Updates
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  News about new features and platform updates
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.productUpdates}
                className="rounded border-gray-300 dark:border-gray-600 pointer-events-none opacity-75"
                disabled
              />
            </label>

            <label
              className="flex items-center justify-between cursor-pointer"
              onClick={() =>
                showComingSoon(
                  "Marketing Communications",
                  "Marketing communication preferences are coming soon!"
                )
              }
            >
              <div>
                <span className="font-medium dark:text-white">
                  Marketing Communications
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tips, tutorials, and promotional content
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketingCommunications}
                className="rounded border-gray-300 dark:border-gray-600 pointer-events-none opacity-75"
                disabled
              />
            </label>
          </div>
        </div>

        {/* Data Export */}
        <div>
          <h4 className="font-medium dark:text-white mb-4 flex items-center space-x-2">
            <Download className="w-5 h-5 text-green-500" />
            <span>Data Export</span>
          </h4>

          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h5 className="font-medium dark:text-white mb-2">
                Export Account Data
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Download a copy of all your data including URLs, analytics, and
                settings.
              </p>

              {success.export && (
                <div className="flex items-center space-x-2 text-green-500 text-sm mb-3">
                  <Check className="w-4 h-4" />
                  <span>
                    Data export request submitted! Check your email for download
                    link.
                  </span>
                </div>
              )}

              {errors.export && (
                <div className="flex items-center space-x-2 text-red-500 text-sm mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.export}</span>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDataExport}
                disabled={loading.export}
                className="btn-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                {loading.export ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Requesting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Request Data Export</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Account Deactivation */}
            <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
              <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                Deactivate Account
              </h5>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                Permanently deactivate your account and all associated data.
                This action cannot be undone.
              </p>

              {showDeactivateConfirm && (
                <div className="mb-4 space-y-3">
                  <div className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-300">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Are you sure? This action cannot be undone.
                    </span>
                  </div>
                  <textarea
                    value={deactivateReason}
                    onChange={(e) => setDeactivateReason(e.target.value)}
                    placeholder="Optional: Tell us why you're leaving (helps us improve)"
                    className="w-full p-2 border border-red-300 dark:border-red-600 rounded text-sm"
                    rows={3}
                    disabled={loading.deactivate}
                  />
                </div>
              )}

              {errors.deactivate && (
                <div className="flex items-center space-x-2 text-red-500 text-sm mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.deactivate}</span>
                </div>
              )}

              {success.deactivate && (
                <div className="flex items-center space-x-2 text-green-500 text-sm mb-3">
                  <Check className="w-4 h-4" />
                  <span>Account deactivation initiated successfully.</span>
                </div>
              )}

              <div className="flex space-x-2">
                {showDeactivateConfirm && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeactivateConfirm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                    disabled={loading.deactivate}
                  >
                    Cancel
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeactivate}
                  disabled={loading.deactivate}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
                >
                  {loading.deactivate ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>
                      {showDeactivateConfirm
                        ? "Confirm Deactivation"
                        : "Deactivate Account"}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Error/Success Messages for Preferences */}
        {errors.preferences && (
          <div className="flex items-center space-x-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.preferences}</span>
          </div>
        )}

        {success.preferences && (
          <div className="flex items-center space-x-2 text-green-500 text-sm">
            <Check className="w-4 h-4" />
            <span>Notification settings updated successfully!</span>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
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
                <span>Save Notification Settings</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
