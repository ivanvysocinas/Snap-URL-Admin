"use client";

import { FC, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Database, Code, Sparkles, CheckCircle } from "lucide-react";

interface DemoDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

interface Feature {
  icon: typeof Database;
  title: string;
  description: string;
}

/**
 * Modal component that explains the use of demo data in the application
 * Features rich animations, floating particles, and comprehensive feature overview
 */
const DemoDataModal: FC<DemoDataModalProps> = ({
  isOpen,
  onClose,
  theme = "dark",
}) => {
  // Handle escape key press and body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const features: Feature[] = [
    {
      icon: Database,
      title: "Rich Dashboard Analytics",
      description: "Comprehensive metrics and visualizations",
    },
    {
      icon: Code,
      title: "Advanced UI Components",
      description: "Modern design patterns and interactions",
    },
    {
      icon: Sparkles,
      title: "Seamless User Experience",
      description: "Responsive design across all devices",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {/* Backdrop */}
          <motion.div
            className={`fixed inset-0 transition-opacity ${
              theme === "dark"
                ? "bg-gradient-to-br from-black/80 via-gray-900/70 to-black/80"
                : "bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60"
            }`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <div className="relative min-h-full flex items-center justify-center p-4">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 50,
                rotateX: -15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotateX: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 30,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className={`w-full max-w-lg rounded-3xl shadow-2xl border-2 ${
                theme === "dark"
                  ? "bg-gray-800/95 border-gray-600/50 shadow-black/50"
                  : "bg-white/95 border-gray-300/50 shadow-black/20"
              }`}
              style={{
                boxShadow:
                  theme === "dark"
                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                    : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3)",
              }}
            >
              {/* Header */}
              <ModalHeader theme={theme} onClose={onClose} />

              {/* Features */}
              <FeaturesSection theme={theme} features={features} />

              {/* Footer */}
              <ModalFooter theme={theme} onClose={onClose} />

              {/* Floating particles */}
              <FloatingParticles theme={theme} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Modal header with animated icon and title
 */
interface ModalHeaderProps {
  theme: string;
  onClose: () => void;
}

const ModalHeader: FC<ModalHeaderProps> = ({ theme, onClose }) => (
  <div className="relative p-8 pb-0">
    {/* Close Button */}
    <motion.button
      initial={{ opacity: 0, rotate: 180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClose}
      className={`absolute top-6 right-6 p-2 rounded-xl transition-all duration-200 ${
        theme === "dark"
          ? "text-gray-400 hover:bg-gray-700/50 hover:text-white"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      }`}
    >
      <X className="w-5 h-5" />
    </motion.button>

    {/* Icon and Title */}
    <div className="text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.5,
          type: "spring",
          stiffness: 400,
        }}
        className={`inline-flex p-4 rounded-2xl mb-6 ${
          theme === "dark"
            ? "bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30"
            : "bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-300/50"
        }`}
      >
        <Database
          className={`w-8 h-8 ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className={`text-2xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent ${
          theme === "dark"
            ? "from-white to-gray-300"
            : "from-gray-900 to-gray-600"
        }`}
      >
        Demo Environment
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className={`text-base leading-relaxed ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        This dashboard showcases a comprehensive URL management platform with
        advanced analytics capabilities. While the backend API focuses on core
        functionality, we've enhanced the frontend with realistic demo data to
        demonstrate the full potential of modern admin interfaces.
      </motion.p>
    </div>
  </div>
);

/**
 * Features section with animated feature cards
 */
interface FeaturesSectionProps {
  theme: string;
  features: Feature[];
}

const FeaturesSection: FC<FeaturesSectionProps> = ({ theme, features }) => (
  <div className="px-8 py-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="space-y-4"
    >
      <h3
        className={`text-sm font-semibold uppercase tracking-wide ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        } mb-4`}
      >
        What You're Experiencing
      </h3>

      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          feature={feature}
          index={index}
          theme={theme}
        />
      ))}
    </motion.div>
  </div>
);

/**
 * Individual feature card with hover animations
 */
interface FeatureCardProps {
  feature: Feature;
  index: number;
  theme: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ feature, index, theme }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
    className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 ${
      theme === "dark"
        ? "bg-gray-700/30 hover:bg-gray-700/50"
        : "bg-gray-50 hover:bg-gray-100"
    }`}
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 10 }}
      className={`flex-shrink-0 p-2 rounded-lg ${
        theme === "dark"
          ? "bg-blue-600/20 text-blue-400"
          : "bg-blue-100 text-blue-600"
      }`}
    >
      <feature.icon className="w-5 h-5" />
    </motion.div>

    <div className="flex-1">
      <h4
        className={`font-semibold text-sm ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {feature.title}
      </h4>
      <p
        className={`text-xs mt-1 ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {feature.description}
      </p>
    </div>

    <CheckCircle
      className={`w-4 h-4 ${
        theme === "dark" ? "text-green-400" : "text-green-500"
      }`}
    />
  </motion.div>
);

/**
 * Modal footer with action button
 */
interface ModalFooterProps {
  theme: string;
  onClose: () => void;
}

const ModalFooter: FC<ModalFooterProps> = ({ theme, onClose }) => (
  <div
    className={`px-8 py-6 border-t ${
      theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"
    }`}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="text-center"
    >
      <p
        className={`text-xs ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Experience the interface as intended, with rich data visualizations and
        comprehensive feature demonstrations.
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className={`mt-4 px-6 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
          theme === "dark"
            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-600/25"
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-600/25"
        }`}
      >
        Continue Exploring
      </motion.button>
    </motion.div>
  </div>
);

/**
 * Floating animated particles
 */
interface FloatingParticlesProps {
  theme: string;
}

const FloatingParticles: FC<FloatingParticlesProps> = ({ theme }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: ["100%", "-20%"],
          opacity: [0, 0.4, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4 + i,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "easeOut",
        }}
        className={`absolute w-1 h-1 rounded-full ${
          theme === "dark" ? "bg-blue-400" : "bg-blue-500"
        }`}
        style={{
          left: `${15 + i * 15}%`,
        }}
      />
    ))}
  </div>
);

export default DemoDataModal;
