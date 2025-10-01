"use client";

import { useState, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Key,
  Database,
  Activity,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { ApiAccessTab } from "../../components/settings/ApiAccessTab";
import { DataPrivacyTab } from "../../components/settings/DataPrivacyTab";
import { AccountTab } from "../../components/settings/AccountTab";
import { UsageStatsTab } from "../../components/settings/UsageStatsTab";

/**
 * Settings content component with tab-based navigation
 * Manages different settings sections with smooth transitions and animations
 */
const SettingsContent: FC = () => {
  const { theme } = useTheme();

  // Active tab state management
  const [activeTab, setActiveTab] = useState<"api" | "data" | "account" | "usage">("api");

  // Tab configuration with icons and labels
  const tabs = [
    { id: "api" as const, label: "API Access", icon: Key },
    { id: "data" as const, label: "Data & Privacy", icon: Database },
    { id: "account" as const, label: "Account", icon: Settings },
    { id: "usage" as const, label: "Usage Stats", icon: Activity },
  ];

  // Animation variants for tab content transitions
  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout
        title="Settings"
        description="Configure your account settings, API access, and data preferences"
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
                      onClick={() => setActiveTab(tab.id)}
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
              {activeTab === "api" && (
                <motion.div
                  key="api"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ApiAccessTab />
                </motion.div>
              )}

              {activeTab === "data" && (
                <motion.div
                  key="data"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <DataPrivacyTab />
                </motion.div>
              )}

              {activeTab === "account" && (
                <motion.div
                  key="account"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <AccountTab />
                </motion.div>
              )}

              {activeTab === "usage" && (
                <motion.div
                  key="usage"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <UsageStatsTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default SettingsContent;