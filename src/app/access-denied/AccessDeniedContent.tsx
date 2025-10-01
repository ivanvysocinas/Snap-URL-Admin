"use client";

import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { AccessDeniedHero } from "../../components/access-denied/AccessDeniedHero";
import { AccessDeniedActions } from "../../components/access-denied/AccessDeniedActions";
import { RoleInformation } from "../../components/access-denied/RoleInformation";
import { AnimatedBackground } from "../../components/access-denied/AnimatedBackground";

interface AccessDeniedContentProps {
  requiredRoles?: string[] | null;
}

/**
 * Access Denied content component
 * Displays when user lacks permission to access a page
 */
const AccessDeniedContent: FC<AccessDeniedContentProps> = ({
  requiredRoles: propRequiredRoles,
}) => {
  const { theme } = useTheme();
  const [requiredRoles, setRequiredRoles] = useState<string[] | null>(
    propRequiredRoles || null
  );

  useEffect(() => {
    if (!propRequiredRoles) {
      const storedRoles = sessionStorage.getItem("access_denied_roles");
      if (storedRoles) {
        try {
          setRequiredRoles(JSON.parse(storedRoles));
          sessionStorage.removeItem("access_denied_roles");
        } catch (e) {
          console.error("Failed to parse stored roles:", e);
        }
      }
    }
  }, [propRequiredRoles]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Animated Background */}
      <AnimatedBackground theme={theme} />

      <DashboardLayout
        title="Access Denied"
        description="You don't have permission to view this page"
      >
        <div className="relative flex items-center justify-center min-h-[70vh] px-4" style={{ zIndex: 1 }}>
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
                    ? "bg-gradient-to-r from-red-600 via-red-500 to-red-600"
                    : "bg-gradient-to-r from-red-400 via-red-300 to-red-400"
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
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`w-full h-full border-4 rounded-full ${
                      theme === "dark" ? "border-red-500" : "border-red-400"
                    }`}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className={`w-full h-full border-4 rounded-full ${
                      theme === "dark" ? "border-red-500" : "border-red-400"
                    }`}
                  />
                </div>

                {/* Hero Section */}
                <AccessDeniedHero theme={theme} />

                {/* Role Information */}
                {requiredRoles && requiredRoles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8"
                  >
                    <RoleInformation requiredRoles={requiredRoles} theme={theme} />
                  </motion.div>
                )}

                {/* Additional Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className={`p-5 rounded-xl mb-8 border-2 ${
                    theme === "dark"
                      ? "bg-red-900/10 border-red-800/50"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <p
                    className={`text-sm leading-relaxed ${
                      theme === "dark" ? "text-red-300" : "text-red-700"
                    }`}
                  >
                    <strong className="text-base">Why am I seeing this?</strong>
                    <br />
                    This page is restricted to specific user roles. If you believe
                    you should have access, please contact your administrator or
                    support team.
                  </p>
                </motion.div>

                {/* Actions */}
                <AccessDeniedActions theme={theme} />
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default AccessDeniedContent;