import { FC, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

/**
 * Confirmation modal props interface
 */
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  loading?: boolean | undefined;
}

/**
 * Confirmation modal component for destructive actions
 * Features: smooth animations, customizable content
 */
const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
}) => {
  /**
   * Get color scheme based on modal type
   */
  const getColorScheme = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-500",
          button: "bg-red-600 hover:bg-red-700 text-white",
          accent: "text-red-600 dark:text-red-400",
        };
      case "warning":
        return {
          icon: "text-yellow-500",
          button: "bg-yellow-600 hover:bg-yellow-700 text-white",
          accent: "text-yellow-600 dark:text-yellow-400",
        };
      case "info":
        return {
          icon: "text-blue-500",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          accent: "text-blue-600 dark:text-blue-400",
        };
      default:
        return {
          icon: "text-red-500",
          button: "bg-red-600 hover:bg-red-700 text-white",
          accent: "text-red-600 dark:text-red-400",
        };
    }
  };

  const colors = getColorScheme();

  /**
   * Animation variants for modal
   */
  const backdropVariants = {
    open: {
      opacity: 1,
      backdropFilter: "blur(4px)",
      transition: { duration: 0.2 },
    },
    closed: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: { duration: 0.2 },
    },
  };

  const modalVariants = {
    open: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
    closed: {
      scale: 0.9,
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  /**
   * Handle confirm action
   */
  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  /**
   * Handle ESC key press
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, loading, onClose]);

  /**
   * Prevent body scroll when modal is open
   * Preserve scrollbar width to prevent layout shift
   */
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Store original values
      const originalStyle = window.getComputedStyle(document.body);
      const originalOverflow = originalStyle.overflow;
      const originalPaddingRight = originalStyle.paddingRight;

      // Apply styles to prevent scroll and layout shift
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${parseInt(originalPaddingRight) + scrollbarWidth}px`;

      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }

    // Return empty cleanup function for else case
    return () => {};
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={backdropVariants}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={loading ? undefined : onClose}
        >
          <motion.div
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${colors.icon}`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className={`text-lg font-semibold ${colors.accent}`}>
                  {title}
                </h3>
              </div>

              {!loading && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0 sm:justify-end">
              <motion.button
                whileHover={loading ? {} : { scale: 1.02 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
              >
                {cancelText}
              </motion.button>

              <motion.button
                whileHover={loading ? {} : { scale: 1.02 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                onClick={handleConfirm}
                disabled={loading}
                className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 order-1 sm:order-2 ${colors.button}`}
              >
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                )}
                <span>{confirmText}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render modal in portal to avoid layout issues
  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
