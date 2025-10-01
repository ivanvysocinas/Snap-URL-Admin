/**
 * Full-screen modal for comprehensive notification management
 * Features advanced animations, unread/read categorization, and bulk actions
 * Includes keyboard shortcuts, scroll prevention, and sophisticated visual effects
 * Provides individual notification management with hover states and removal options
 */
import { FC, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Trash2, CheckCheck } from "lucide-react";
import { Notification } from "../../hooks/useNotifications";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  theme: string;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemoveNotification: (id: string) => void;
  onClearAll: () => void;
}

const NotificationsModal: FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  theme,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemoveNotification,
  onClearAll,
}) => {
  /**
   * Handle keyboard shortcuts and scroll prevention
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  // Complex animation variants for different elements
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 30,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.1, duration: 0.3 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.3,
        type: "spring",
        stiffness: 400,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.15, duration: 0.4 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {/* Enhanced backdrop with gradient */}
          <motion.div
            className={`fixed inset-0 transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-br from-black/80 via-gray-900/70 to-black/80"
                : "bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60"
            }`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal content with 3D transforms */}
          <div className="relative min-h-full flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`w-full max-w-2xl rounded-3xl shadow-2xl border-2 ${
                theme === "dark"
                  ? "bg-gray-800/95 border-gray-600/50 shadow-black/50"
                  : "bg-white/95 border-gray-300/50 shadow-black/20"
              }`}
              style={{
                maxHeight: "90vh",
                boxShadow:
                  theme === "dark"
                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                    : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3)",
              }}
            >
              {/* Enhanced header with animations */}
              <motion.div
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                className={`flex items-center justify-between p-6 border-b ${
                  theme === "dark" ? "border-gray-600/50" : "border-gray-300/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  >
                    <Bell
                      className={`w-7 h-7 ${
                        theme === "dark" ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                  </motion.div>
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                        theme === "dark"
                          ? "from-white to-gray-300"
                          : "from-gray-900 to-gray-600"
                      }`}
                    >
                      All Notifications
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {notifications.length} total, {unreadNotifications.length}{" "}
                      unread
                    </motion.p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Mark all as read button */}
                  {unreadNotifications.length > 0 && (
                    <motion.button
                      variants={buttonVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{
                        scale: 1.05,
                        boxShadow:
                          theme === "dark"
                            ? "0 8px 25px rgba(59, 130, 246, 0.3)"
                            : "0 8px 25px rgba(59, 130, 246, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onMarkAllAsRead}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 hover:border-blue-400/50"
                          : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                      }`}
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>Mark All Read</span>
                    </motion.button>
                  )}

                  {/* Clear all button */}
                  {notifications.length > 0 && (
                    <motion.button
                      variants={buttonVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{
                        scale: 1.05,
                        boxShadow:
                          theme === "dark"
                            ? "0 8px 25px rgba(239, 68, 68, 0.3)"
                            : "0 8px 25px rgba(239, 68, 68, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClearAll}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 hover:border-red-400/50"
                          : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300"
                      }`}
                      title="Clear all notifications"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All</span>
                    </motion.button>
                  )}

                  {/* Enhanced close button */}
                  <motion.button
                    initial={{ opacity: 0, rotate: 180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      theme === "dark"
                        ? "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Enhanced scrollable content */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="overflow-y-auto overflow-x-hidden"
                style={{ maxHeight: "70vh" }}
              >
                {notifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-12 px-6"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Bell
                        className={`w-16 h-16 mb-4 ${
                          theme === "dark" ? "text-gray-600" : "text-gray-400"
                        }`}
                      />
                    </motion.div>
                    <h3
                      className={`text-lg font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      No notifications yet
                    </h3>
                    <p
                      className={`text-sm text-center ${
                        theme === "dark" ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      When you have notifications, they'll appear here.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    {/* Unread notifications section */}
                    {unreadNotifications.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <div
                          className={`px-6 py-3 bg-opacity-50 ${
                            theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
                          }`}
                        >
                          <h3
                            className={`text-sm font-medium ${
                              theme === "dark"
                                ? "text-blue-400"
                                : "text-blue-700"
                            }`}
                          >
                            Unread ({unreadNotifications.length})
                          </h3>
                        </div>
                        {unreadNotifications.map((notification, index) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            theme={theme}
                            onMarkAsRead={onMarkAsRead}
                            onRemove={onRemoveNotification}
                            index={index}
                            isUnread={true}
                          />
                        ))}
                      </motion.div>
                    )}

                    {/* Read notifications section */}
                    {readNotifications.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        {unreadNotifications.length > 0 && (
                          <div
                            className={`px-6 py-3 ${
                              theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                            }`}
                          >
                            <h3
                              className={`text-sm font-medium ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              Read ({readNotifications.length})
                            </h3>
                          </div>
                        )}
                        {readNotifications.map((notification, index) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            theme={theme}
                            onMarkAsRead={onMarkAsRead}
                            onRemove={onRemoveNotification}
                            index={index}
                            isUnread={false}
                          />
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Individual notification item component with sophisticated animations and interactions
 */
interface NotificationItemProps {
  notification: Notification;
  theme: string;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  index: number;
  isUnread: boolean;
}

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  theme,
  onMarkAsRead,
  onRemove,
  index,
}) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{
        duration: 0.1,
        type: "spring",
      }}
      whileHover={{
        scale: 1.02,
        x: 8,
        transition: { duration: 0.1 },
      }}
      className={`px-6 py-4 mx-4 transition-all duration-200 cursor-pointer group relative border-l-4 ${
        !notification.read
          ? theme === "dark"
            ? "hover:bg-gray-750/50 bg-gray-800/30 border-l-blue-500"
            : "hover:bg-blue-50/80 bg-blue-25/50 border-l-blue-500"
          : theme === "dark"
            ? "hover:bg-gray-750/30 opacity-75 border-l-gray-600"
            : "hover:bg-gray-50/50 opacity-75 border-l-gray-300"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <motion.h4
              className={`text-sm font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.1 }}
            >
              {notification.title}
            </motion.h4>
            {!notification.read && (
              <motion.div
                className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * 0.05 + 0.2,
                  type: "spring",
                  stiffness: 400,
                }}
                whileHover={{ scale: 1.2 }}
              />
            )}
          </div>
          <motion.p
            className={`text-sm mt-1 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.15 }}
          >
            {notification.message}
          </motion.p>
          <motion.span
            className={`text-xs mt-2 block ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            {notification.time}
          </motion.span>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1 }}
          whileHover={{
            opacity: 1,
            scale: 1.1,
            rotate: 90,
          }}
          className={`group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg ${
            theme === "dark"
              ? "text-gray-500 hover:text-red-400 hover:bg-red-900/30"
              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notification.id);
          }}
          title="Remove notification"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NotificationsModal;
