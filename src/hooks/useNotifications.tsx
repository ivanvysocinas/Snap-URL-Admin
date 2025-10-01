/**
 * Comprehensive notification system with localStorage persistence
 * Features real-time updates, automatic time formatting, and notification management
 */
import {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  FC,
} from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = "app_notifications";
const MAX_VISIBLE_NOTIFICATIONS = 4;

/**
 * Core notification management logic with localStorage persistence
 * Handles CRUD operations, time formatting, and automatic cleanup
 */
const useNotificationsLogic = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error("Error loading notifications from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist notifications to localStorage when changed
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      } catch (error) {
        console.error("Error saving notifications to localStorage:", error);
      }
    }
  }, [notifications, isLoading]);

  const generateId = useCallback((): string => {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Formats timestamp to human-readable relative time
   * Updates from "Just now" to "X minutes ago" to dates
   */
  const formatTime = useCallback((timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

    return new Date(timestamp).toLocaleDateString();
  }, []);

  const addNotification = useCallback(
    (title: string, message: string) => {
      const timestamp = Date.now();
      const newNotification: Notification = {
        id: generateId(),
        title,
        message,
        time: formatTime(timestamp),
        timestamp,
        read: false,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        // Limit to 100 notifications to prevent storage bloat
        return updated.slice(0, 100);
      });

      return newNotification.id;
    },
    [generateId, formatTime]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateTimeStrings = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        time: formatTime(notification.timestamp),
      }))
    );
  }, [formatTime]);

  // Update time strings every minute for fresh relative times
  useEffect(() => {
    const interval = setInterval(updateTimeStrings, 60000);
    return () => clearInterval(interval);
  }, [updateTimeStrings]);

  const visibleNotifications = notifications.slice(
    0,
    MAX_VISIBLE_NOTIFICATIONS
  );
  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasMoreNotifications = notifications.length > MAX_VISIBLE_NOTIFICATIONS;

  return {
    notifications,
    visibleNotifications,
    unreadCount,
    hasMoreNotifications,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  };
};

const NotificationsContext = createContext<ReturnType<
  typeof useNotificationsLogic
> | null>(null);

/**
 * Global notifications provider with real-time updates
 * Enables notification functionality across the entire application
 */
export const NotificationsProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const notifications = useNotificationsLogic();

  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }

  return context;
};
