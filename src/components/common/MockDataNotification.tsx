/**
 * Animated notification component for demo/mock data indication
 * Features sophisticated visual effects including shimmer animation, floating particles, and pulsing borders
 * Supports multiple positioning options and includes integrated modal functionality via custom hook
 * Provides comprehensive demo mode feedback with clickable interactions
 */
import { useState, useCallback, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, X, Info } from "lucide-react";
import DemoDataModal from "../modals/DemoDataModal";

interface MockDataNotificationProps {
  theme?: string | undefined;
  onClose?: (() => void) | undefined;
  onClick?: (() => void) | undefined;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "center"
    | undefined;
  persistent?: boolean | undefined;
  message?: string | undefined;
}

const MockDataNotification: FC<MockDataNotificationProps> = ({
  theme = "dark",
  onClose,
  onClick,
  position = "top-right",
  persistent = false,
  message = "Demo data is being displayed",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    onClose?.();
  };

  const handleClick = () => {
    onClick?.();
  };

  /**
   * Calculates position classes based on prop configuration
   */
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "center":
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
      default:
        return "top-4 right-4";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.4,
          }}
          className={`fixed z-50 ${getPositionClasses()}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            onClick={handleClick}
            className={`relative overflow-hidden rounded-xl shadow-2xl border transition-all duration-300 ${
              onClick ? "cursor-pointer" : ""
            } bg-gradient-to-r px-2 from-amber-900/90 to-orange-900/90 border-amber-600/30 text-white ${isHovered ? "scale-105 shadow-3xl" : ""}`}
            style={{
              boxShadow:
                "0 25px 50px -12px rgba(217, 119, 6, 0.3), 0 0 0 1px rgba(217, 119, 6, 0.1)",
            }}
          >
            {/* Animated shimmer background */}
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12"
            />

            {/* Pulsing border */}
            <motion.div
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-xl border-2 border-amber-400/40"
            />

            <div className="relative flex items-center space-x-3 px-6 py-4 min-w-0">
              {/* Animated database icon */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`flex-shrink-0 p-2 rounded-lg bg-amber-600/30`}
              >
                <Database className="w-4 h-4" />
              </motion.div>

              {/* Content with demo mode indicator */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center space-x-1"
                  >
                    <Info className="w-3 h-3" />
                    <span className="text-xs font-medium">DEMO MODE</span>
                  </motion.div>
                </div>
                <p className="text-xs mt-0.5 opacity-90">{message}</p>
                {onClick && (
                  <p className="text-xs mt-1 opacity-75 font-medium">
                    Click for details
                  </p>
                )}
              </div>

              {/* Close button with hover animations */}
              {!persistent && (
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    rotate: 90,
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(239, 68, 68, 0.1)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 hover:bg-red-500/20 text-amber-200 hover:text-red-300`}
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: ["100%", "-20%"],
                    opacity: [0, 0.6, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeOut",
                  }}
                  className={`absolute w-1 h-1 rounded-full bg-amber-300`}
                  style={{
                    left: `${20 + i * 30}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Complete hook for managing mock data notification with integrated modal
 * Provides comprehensive demo mode functionality including notification display and modal interaction
 * Returns all necessary state management functions and a complete component system
 */
export const useMockDataNotification = (theme: string = "dark") => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hideNotification = useCallback(
    () => setIsNotificationVisible(false),
    []
  );
  const showNotification = useCallback(
    () => setIsNotificationVisible(true),
    []
  );
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleNotificationClick = useCallback(() => {
    openModal();
  }, [openModal]);

  // Complete component that includes both notification and modal
  const MockDataSystem = useCallback(
    ({
      message,
      position,
      persistent,
    }: {
      message?: string | undefined;
      position?: MockDataNotificationProps["position"];
      persistent?: boolean | undefined;
    }) => (
      <>
        {isNotificationVisible && (
          <MockDataNotification
            theme={theme}
            onClick={handleNotificationClick}
            onClose={hideNotification}
            message={message}
            position={position}
            persistent={persistent}
          />
        )}

        <DemoDataModal
          isOpen={isModalOpen}
          onClose={closeModal}
          theme={theme}
        />
      </>
    ),
    [
      isNotificationVisible,
      isModalOpen,
      theme,
      handleNotificationClick,
      hideNotification,
      closeModal,
    ]
  );

  return {
    isNotificationVisible,
    isModalOpen,
    hideNotification,
    showNotification,
    openModal,
    closeModal,
    handleNotificationClick,
    MockDataSystem,
  };
};

export default MockDataNotification;
