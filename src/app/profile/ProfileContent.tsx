"use client";

import { useState, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Bell, Shield } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { ProfileTab } from "@/components/profile/ProfileTab";
import { PreferencesTab } from "@/components/profile/PreferencesTab";
import { NotificationsTab } from "@/components/profile/NotificationsTab";
import { SecurityTab } from "@/components/profile/SecurityTab";

/**
 * Main profile settings component
 * Manages tab navigation and shared state across profile sections
 */
const ProfileContent: FC = () => {
  const { theme } = useTheme();

  // Active tab state
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "security" | "notifications"
  >("profile");

  // Shared UI state across tabs
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<Record<string, boolean>>({});

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  // Animation variants for tab transitions
  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout
        title="Profile Settings"
        description="Manage your account information, preferences, and security settings"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg"
                          : theme === "dark"
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <ProfileTab
                  key="profile"
                  variants={tabVariants}
                  loading={loading}
                  setLoading={setLoading}
                  errors={errors}
                  setErrors={setErrors}
                  success={success}
                  setSuccess={setSuccess}
                />
              )}

              {activeTab === "preferences" && (
                <PreferencesTab
                  key="preferences"
                  variants={tabVariants}
                  loading={loading}
                  setLoading={setLoading}
                  errors={errors}
                  setErrors={setErrors}
                  success={success}
                  setSuccess={setSuccess}
                />
              )}

              {activeTab === "security" && (
                <SecurityTab
                  key="security"
                  variants={tabVariants}
                  loading={loading}
                  setLoading={setLoading}
                  errors={errors}
                  setErrors={setErrors}
                  success={success}
                  setSuccess={setSuccess}
                />
              )}

              {activeTab === "notifications" && (
                <NotificationsTab
                  key="notifications"
                  variants={tabVariants}
                  loading={loading}
                  setLoading={setLoading}
                  errors={errors}
                  setErrors={setErrors}
                  success={success}
                  setSuccess={setSuccess}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default ProfileContent;
