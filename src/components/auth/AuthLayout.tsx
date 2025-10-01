/**
 * Authentication layout component with split design
 * Left side contains form content, right side displays animated illustration with features
 * Handles hydration safely by preventing theme-dependent rendering until mounted
 * Features rotating animations, floating elements, and branded content display
 */
"use client";

import { motion } from "framer-motion";
import {
  Link,
  Globe,
  Shield,
  Zap,
  BarChart3,
  Users,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import { useSafeTheme } from "../../context/ThemeContext";
import { FC } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  isLogin?: boolean;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children, isLogin = true }) => {
  const { theme, mounted } = useSafeTheme();

  /**
   * Prevent hydration mismatch by showing loading state until theme is mounted
   * Critical for SSR compatibility with theme-dependent styling
   */
  if (!mounted) {
    return (
      <div className="min-h-screen flex bg-gray-900">
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-md w-full">{children}</div>
        </div>
        <div className="flex-1 relative overflow-hidden bg-gray-800 hidden lg:flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Left Side - Form Container */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="max-w-md w-full">{children}</div>
      </div>

      {/* Right Side - Illustration Panel */}
      <div
        className={`flex-1 relative overflow-hidden ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } hidden lg:flex items-center justify-center`}
      >
        {/* Main Animated Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <IllustrationContent theme={theme} isLogin={isLogin} />
        </motion.div>

        {/* Background Pattern Overlay */}
        <div
          className={`absolute inset-0 opacity-5 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Brand Information */}
        <div className="absolute top-8 left-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Link className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                SnapURL
              </h3>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Smart URL Management
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="absolute bottom-8 left-8 right-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <FeatureItem
              icon={BarChart3}
              text="Advanced Analytics"
              theme={theme}
            />
            <FeatureItem icon={Shield} text="Secure Links" theme={theme} />
            <FeatureItem icon={Zap} text="Lightning Fast" theme={theme} />
            <FeatureItem icon={Globe} text="Global CDN" theme={theme} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/**
 * Central illustration with animated rotating rings and floating elements
 * Displays different content based on login vs register mode
 */
interface IllustrationContentProps {
  theme: string;
  isLogin: boolean;
}

const IllustrationContent: FC<IllustrationContentProps> = ({
  theme,
  isLogin,
}) => {
  return (
    <div className="w-96 h-96 relative">
      {/* Rotating Ring Animations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 rounded-full border-2 ${
          theme === "dark" ? "border-blue-400" : "border-blue-500"
        } opacity-20`}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-8 rounded-full border-2 ${
          theme === "dark" ? "border-purple-400" : "border-purple-500"
        } opacity-30`}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-16 rounded-full border ${
          theme === "dark" ? "border-pink-400" : "border-pink-500"
        } opacity-20`}
      />

      {/* Central Link Icon with Pulse Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Link
            className={`w-24 h-24 ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
        </motion.div>
      </div>

      {/* Floating Animated Elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-12 left-12 w-8 h-8 ${
          theme === "dark" ? "bg-green-400" : "bg-green-500"
        } rounded-full opacity-60 flex items-center justify-center`}
      >
        <TrendingUp className="w-4 h-4 text-white" />
      </motion.div>

      <motion.div
        animate={{
          y: [20, -20, 20],
          x: [0, 10, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-12 right-12 w-6 h-6 ${
          theme === "dark" ? "bg-pink-400" : "bg-pink-500"
        } rounded-full opacity-70 flex items-center justify-center`}
      >
        <Users className="w-3 h-3 text-white" />
      </motion.div>

      <motion.div
        animate={{
          x: [-15, 15, -15],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-32 right-8 w-4 h-4 ${
          theme === "dark" ? "bg-yellow-400" : "bg-yellow-500"
        } rounded-full opacity-80`}
      />

      <motion.div
        animate={{
          x: [10, -10, 10],
          y: [0, -15, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-32 left-8 w-3 h-3 ${
          theme === "dark" ? "bg-cyan-400" : "bg-cyan-500"
        } rounded-full opacity-60`}
      />

      {/* Context-Specific Stats Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className={`absolute ${isLogin ? "top-24 right-16" : "bottom-24 left-16"} 
          ${theme === "dark" ? "bg-gray-700/80" : "bg-white/80"} rounded-lg p-3 shadow-lg border ${
            theme === "dark" ? "border-gray-600" : "border-gray-200"
          }`}
      >
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`}
          >
            {isLogin ? "99.9%" : "+150%"}
          </motion.div>
          <div
            className={`text-xs ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {isLogin ? "Uptime" : "Growth"}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Individual feature item with hover animations
 */
interface FeatureItemProps {
  icon: LucideIcon;
  text: string;
  theme: string;
}

const FeatureItem: FC<FeatureItemProps> = ({ icon: Icon, text, theme }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -2 }}
    className="flex items-center space-x-3 group"
  >
    <div
      className={`w-8 h-8 rounded-lg ${
        theme === "dark"
          ? "bg-gray-700 group-hover:bg-gray-600"
          : "bg-gray-100 group-hover:bg-gray-200"
      } flex items-center justify-center transition-colors`}
    >
      <Icon
        className={`w-4 h-4 ${
          theme === "dark" ? "text-blue-400" : "text-blue-600"
        }`}
      />
    </div>
    <span
      className={`text-sm font-medium ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {text}
    </span>
  </motion.div>
);

export default AuthLayout;
