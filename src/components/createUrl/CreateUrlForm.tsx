/**
 * Main URL creation form with tabbed interface and comprehensive validation
 * Features responsive tab navigation, demo restrictions, and coming soon notifications
 * Handles form submission with validation, error handling, and user feedback
 */
"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  LinkIcon,
  QrCode,
  Shield,
  Settings,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";
import { useComingSoon } from "@/hooks/useComingSoonModal";
import { BasicTab } from "./BasicTab";
import { QRTab } from "./QRTab";
import { PrivacyTab } from "./PrivacyTab";
import { AdvancedTab } from "./AdvancedTab";

interface CreateUrlFormProps {
  formData: any;
  setFormData: (data: any) => void;
  loading: boolean;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  onSubmit: (e: React.FormEvent) => void;
  theme: string;
}

export const CreateUrlForm: FC<CreateUrlFormProps> = ({
  formData,
  setFormData,
  loading,
  errors,
  setErrors,
  onSubmit,
  theme,
}) => {
  const { user } = useAuth();
  const { showDemoRestriction } = useDemoRestriction();
  const { showComingSoon } = useComingSoon();

  const [activeTab, setActiveTab] = useState<
    "basic" | "qr" | "privacy" | "advanced"
  >("basic");

  const tabs = [
    { id: "basic", label: "Basic", icon: LinkIcon },
    { id: "qr", label: "QR Code", icon: QrCode },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "advanced", label: "Advanced", icon: Settings },
  ];

  /**
   * Demo restriction handler - prevents URL creation for demo accounts
   */
  const checkDemoRestrictions = (): boolean => {
    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "URL creation is not available in demo mode. Please use a full account to access all features.",
        "Create URL"
      );
      return false;
    }
    return true;
  };

  /**
   * Coming soon feature handler
   */
  const handleComingSoon = (feature: string) => {
    showComingSoon(
      feature,
      "This feature is under development and will be available soon. Stay tuned for updates!"
    );
  };

  /**
   * Comprehensive form validation with detailed error messages
   * Validates URL format, custom alias format, field lengths, and security settings
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // URL validation with protocol check
    if (!formData.originalUrl) {
      newErrors.originalUrl = "URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.originalUrl)) {
      newErrors.originalUrl =
        "Please enter a valid URL (must start with http:// or https://)";
    }

    // Custom alias validation with character restrictions
    if (
      formData.customAlias &&
      !/^[a-zA-Z0-9_-]{3,30}$/.test(formData.customAlias)
    ) {
      newErrors.customAlias =
        "Custom alias must be 3-30 characters (letters, numbers, - and _ only)";
    }

    // Title length validation
    if (formData.title && formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Description length validation
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    // Password protection validation
    if (
      formData.enablePassword &&
      (!formData.password || formData.password.length < 4)
    ) {
      newErrors.password = "Password must be at least 4 characters";
    }

    // Expiration date validation
    if (formData.enableExpiration && !formData.customExpirationDate) {
      newErrors.customExpirationDate = "Please select an expiration date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkDemoRestrictions()) return;

    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Responsive Tab Navigation */}
      <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {/* Desktop: Horizontal tabs with labels */}
        <div className="hidden sm:flex space-x-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Mobile: Compact icon-based navigation */}
        <div className="flex sm:hidden space-x-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center justify-center px-2 py-3 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
              title={tab.label}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="truncate">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content with Animated Transitions */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === "basic" && (
            <BasicTab
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              theme={theme}
            />
          )}

          {activeTab === "qr" && (
            <QRTab
              formData={formData}
              setFormData={setFormData}
              theme={theme}
              onComingSoon={handleComingSoon}
            />
          )}

          {activeTab === "privacy" && (
            <PrivacyTab
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              theme={theme}
              onComingSoon={handleComingSoon}
            />
          )}

          {activeTab === "advanced" && (
            <AdvancedTab
              formData={formData}
              setFormData={setFormData}
              theme={theme}
              onComingSoon={handleComingSoon}
            />
          )}
        </AnimatePresence>

        {/* Form Actions with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-end space-x-3 pt-6"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="btn-secondary px-6 py-3 rounded-lg"
            disabled={loading}
          >
            Reset
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary px-6 py-3 rounded-lg flex items-center space-x-2"
            disabled={loading || !formData.originalUrl}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create URL</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};
