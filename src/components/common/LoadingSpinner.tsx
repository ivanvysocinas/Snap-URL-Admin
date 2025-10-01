/**
 * Versatile loading spinner component with multiple animation variants and sizes
 * Features theme detection, full-screen mode, and brand-specific animations
 * Can work independently without ThemeContext for maximum flexibility
 */
"use client";

import { motion } from "framer-motion";
import { Link } from "lucide-react";
import { FC } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "brand";
  text?: string;
  fullScreen?: boolean;
  className?: string;
  theme?: "light" | "dark" | "auto";
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "spinner",
  text,
  fullScreen = false,
  className = "",
  theme = "auto",
}) => {
  /**
   * Smart theme detection with multiple fallback methods
   * Checks context, document classes, and system preferences
   */
  const getTheme = (): "light" | "dark" => {
    if (theme !== "auto") return theme;

    // Auto-detect theme from document class or system preference
    if (typeof window !== "undefined") {
      if (document.documentElement.classList.contains("dark")) {
        return "dark";
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  };

  const currentTheme = getTheme();

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const containerClasses = fullScreen
    ? `fixed inset-0 flex items-center justify-center z-50 ${
        currentTheme === "dark" ? "bg-gray-900/80" : "bg-white/80"
      }`
    : "flex items-center justify-center";

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return <DotsAnimation size={size} theme={currentTheme} />;
      case "pulse":
        return <PulseAnimation size={size} theme={currentTheme} />;
      case "brand":
        return <BrandAnimation size={size} theme={currentTheme} />;
      default:
        return <SpinAnimation size={size} theme={currentTheme} />;
    }
  };

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {renderSpinner()}
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${textSizeClasses[size]} font-medium ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
};

/**
 * Standard circular spinner animation
 */
const SpinAnimation: FC<{ size: string; theme: string }> = ({
  size,
  theme,
}) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={`${
      size === "sm"
        ? "w-4 h-4"
        : size === "md"
          ? "w-8 h-8"
          : size === "lg"
            ? "w-12 h-12"
            : "w-16 h-16"
    } border-2 ${
      theme === "dark" ? "border-gray-600" : "border-gray-300"
    } border-t-blue-600 rounded-full`}
  />
);

/**
 * Three dots loading animation with staggered timing
 */
const DotsAnimation: FC<{ size: string; theme: string }> = ({
  size,
  theme,
}) => {
  const dotSize = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  }[size];

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
          className={`${dotSize} ${
            theme === "dark" ? "bg-blue-400" : "bg-blue-600"
          } rounded-full`}
        />
      ))}
    </div>
  );
};

/**
 * Pulsing circle animation with overlapping waves
 */
const PulseAnimation: FC<{ size: string; theme: string }> = ({
  size,
  theme,
}) => {
  const pulseSize = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }[size];

  return (
    <div className="relative">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.3, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`${pulseSize} ${
          theme === "dark" ? "bg-blue-400" : "bg-blue-600"
        } rounded-full`}
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
        className={`absolute inset-0 ${pulseSize} ${
          theme === "dark" ? "bg-blue-400" : "bg-blue-600"
        } rounded-full`}
      />
    </div>
  );
};

/**
 * Brand-specific animation with logo and rotating rings
 * Features complex multi-layered animations for premium feel
 */
const BrandAnimation: FC<{ size: string; theme: string }> = ({
  size,
  theme,
}) => {
  const iconSize = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }[size];

  return (
    <div className="relative">
      {/* Rotating outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 ${iconSize} border-2 ${
          theme === "dark" ? "border-blue-400/30" : "border-blue-600/30"
        } border-t-transparent rounded-full`}
      />
      {/* Counter-rotating inner ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-1 ${
          size === "sm"
            ? "w-4 h-4"
            : size === "md"
              ? "w-6 h-6"
              : size === "lg"
                ? "w-12 h-12"
                : "w-20 h-20"
        } border ${
          theme === "dark" ? "border-purple-400/40" : "border-purple-600/40"
        } border-b-transparent rounded-full`}
      />

      {/* Animated center logo */}
      <div className={`${iconSize} flex items-center justify-center`}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Link
            className={`${
              size === "sm"
                ? "w-3 h-3"
                : size === "md"
                  ? "w-5 h-5"
                  : size === "lg"
                    ? "w-8 h-8"
                    : "w-12 h-12"
            } ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
          />
        </motion.div>
      </div>
    </div>
  );
};

/**
 * Full-screen page loading component with brand animation
 */
export const PageLoader: FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <LoadingSpinner size="lg" variant="brand" text={text} fullScreen={true} />
);

/**
 * Compact button loading component for inline use
 */
export const ButtonLoader: FC = () => (
  <LoadingSpinner size="sm" variant="spinner" className="inline-flex" />
);

export default LoadingSpinner;
