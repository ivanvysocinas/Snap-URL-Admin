"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import ConfirmationModal from "./ConfirmationModal";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";

/**
 * Account tab component
 * Handles account information and dangerous operations with modal confirmation
 */
export const AccountTab: FC = () => {
  const { user } = useAuth();
  const { showDemoRestriction } = useDemoRestriction();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeactivateModal, setShowDeactivateModal] =
    useState<boolean>(false);

  /**
   * Show deactivation confirmation modal
   */
  const showDeactivateConfirmation = () => {
    setShowDeactivateModal(true);
  };

  /**
   * Close deactivation modal
   */
  const closeDeactivateModal = () => {
    setShowDeactivateModal(false);
  };

  /**
   * Handle confirmed account deactivation
   */
  const handleConfirmedDeactivation = async () => {
    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "This action is not available in demo mode. Please use a full account to access all features.",
        "Deactivate account"
      );
      closeDeactivateModal();
      return;
    }
    setLoading((prev) => ({ ...prev, deactivate: true }));
    setErrors({});
    try {
      const response = await api.auth.deactivateAccount(
        "User requested account deactivation"
      );
      if (response.success) {
        // Close modal first
        setShowDeactivateModal(false);

        // Show success message
        alert(
          "Account deactivated successfully. You will be redirected to the login page."
        );

        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to deactivate account:", error);
      setErrors({ deactivate: "Failed to deactivate account" });
      setShowDeactivateModal(false);
    } finally {
      setLoading((prev) => ({ ...prev, deactivate: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Deactivation Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeactivateModal}
        onClose={closeDeactivateModal}
        onConfirm={handleConfirmedDeactivation}
        title="Deactivate Account"
        message={`Are you sure you want to deactivate your account? Once deactivated, your URLs will stop working and all data will be permanently deleted. This action cannot be undone and you will lose access to:

• All your shortened URLs
• Analytics and statistics
• Account settings and preferences
• Any custom domains or settings

This is a permanent action that cannot be reversed.`}
        confirmText="Deactivate Account"
        cancelText="Keep Account"
        type="danger"
        loading={loading.deactivate}
      />

      {/* Account Information */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Settings className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold dark:text-white">
            Account Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Account Status
            </label>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <span className="text-green-700 dark:text-green-300 font-medium">
                Active
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Member Since
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="dark:text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Account Type
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="dark:text-white">Free Account</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              User Role
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="dark:text-white capitalize">
                {user?.role || "User"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="card p-6">
        <h4 className="font-medium dark:text-white mb-4">Account Settings</h4>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Profile Management
            </h5>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Update your profile information, change your password, and manage
              your preferences.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (window.location.href = "/profile")}
              className="btn-secondary px-4 py-2 rounded-lg"
            >
              Go to Profile Settings
            </motion.button>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h5 className="font-medium dark:text-white mb-2">
              Data Management
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Export your data or manage your privacy settings from the Data &
              Privacy tab.
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200 dark:border-red-800">
        <div className="flex items-center space-x-2 mb-6">
          <Trash2 className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">
            Danger Zone
          </h3>
        </div>

        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
            Deactivate Account
          </h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            Once you deactivate your account, your URLs will stop working and
            all data will be permanently deleted. This action cannot be undone.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={showDeactivateConfirmation}
            disabled={loading.deactivate}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Deactivate Account</span>
          </motion.button>

          {errors.deactivate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center space-x-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.deactivate}</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
