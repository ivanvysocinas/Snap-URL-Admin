"use client";

import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Sparkles, Zap } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

/**
 * Coming soon modal with animated elements and progress indicator
 * Features floating particles, rotating icons, and smooth transitions
 */
export const ComingSoonModal: FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotateY: 15 }}
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0.3,
              }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${
                theme === "dark"
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              {/* Animated Background Pattern */}
              <AnimatedBackground />

              {/* Close Button */}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 p-2 rounded-full z-50 cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="relative z-10 p-8 text-center">
                {/* Animated Icon */}
                <AnimatedIcon theme={theme} />

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-2xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`mb-6 leading-relaxed ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {description}
                </motion.p>

                {/* Progress Bar */}
                <ProgressBar theme={theme} />

                {/* Action Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Got it!
                </motion.button>

                {/* Newsletter hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className={`text-xs mt-4 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  We'll notify you when this feature is ready
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * Animated background with rotating gradient circles
 */
const AnimatedBackground: FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      animate={{
        rotate: 360,
        scale: [1, 1.2, 1],
      }}
      transition={{
        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full"
    />
    <motion.div
      animate={{
        rotate: -360,
        scale: [1.2, 1, 1.2],
      }}
      transition={{
        rotate: { duration: 15, repeat: Infinity, ease: "linear" },
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full"
    />
  </div>
);

/**
 * Animated icon with floating particles
 */
interface AnimatedIconProps {
  theme: string;
}

const AnimatedIcon: FC<AnimatedIconProps> = ({ theme }) => (
  <div className="mb-6">
    <motion.div
      animate={{
        rotate: [0, 10, -10, 0],
        y: [0, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative inline-flex"
    >
      <div
        className={`p-4 rounded-full ${
          theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"
        }`}
      >
        <Clock className="w-8 h-8 text-blue-500" />
      </div>

      {/* Floating particles */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.5, 1],
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -top-2 -right-2"
      >
        <Sparkles className="w-4 h-4 text-yellow-500" />
      </motion.div>

      <motion.div
        animate={{
          rotate: -360,
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          rotate: { duration: 6, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -bottom-1 -left-1"
      >
        <Zap className="w-3 h-3 text-purple-500" />
      </motion.div>
    </motion.div>
  </div>
);

/**
 * Animated progress bar with development status
 */
interface ProgressBarProps {
  theme: string;
}

const ProgressBar: FC<ProgressBarProps> = ({ theme }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="mb-6"
  >
    <div
      className={`h-2 rounded-full overflow-hidden ${
        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
      }`}
    >
      <motion.div
        animate={{
          x: ["-100%", "100%"],
          scaleX: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        style={{ transformOrigin: "center" }}
      />
    </div>
    <p
      className={`text-xs mt-2 ${
        theme === "dark" ? "text-gray-400" : "text-gray-500"
      }`}
    >
      Development in progress...
    </p>
  </motion.div>
);
