"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useTheme } from "../context/ThemeContext";
import { NotFoundHero } from "../components/not-found/NotFoundHero";
import { NotFoundActions } from "../components/not-found/NotFoundActions";
import { NotFoundBackground } from "../components/not-found/NotFoundBackground";

/**
 * 404 Not Found content component
 * Humorous and friendly error page with animated space-themed illustration
 * Features animated background, rocket with astronaut, and helpful navigation
 * Includes quick links to popular pages for better UX
 */
const NotFoundContent: FC = () => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Animated Background */}
      <NotFoundBackground theme={theme} />

      <DashboardLayout
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist"
      >
        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <div className="max-w-4xl w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              {/* Glowing border animation */}
              <motion.div
                className={`absolute inset-0 rounded-2xl ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600"
                    : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
                }`}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                  padding: "3px",
                  opacity: 0.6,
                }}
              />

              <div
                className={`relative rounded-2xl p-8 md:p-12 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-2xl`}
              >
                {/* Decorative rotating circles in corners */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className={`w-full h-full border-4 rounded-full ${
                      theme === "dark" ? "border-blue-500" : "border-blue-400"
                    }`}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className={`w-full h-full border-4 rounded-full ${
                      theme === "dark" ? "border-purple-500" : "border-purple-400"
                    }`}
                  />
                </div>

                {/* Hero Section with animated illustration */}
                <NotFoundHero theme={theme} />

                {/* Quick Links to popular pages */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className={`mb-8 p-5 rounded-xl border-2 ${
                    theme === "dark"
                      ? "bg-blue-900/10 border-blue-800/50"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <p
                    className={`text-sm text-center mb-4 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    <strong className="text-base">Looking for something specific?</strong>
                    <br />
                    Check out these popular pages:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <a
                      href="/dashboard"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        theme === "dark"
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Dashboard
                    </a>
                    <a
                      href="/urls"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        theme === "dark"
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      My URLs
                    </a>
                  </div>
                </motion.div>

                {/* Action buttons for navigation */}
                <NotFoundActions theme={theme} />
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default NotFoundContent;