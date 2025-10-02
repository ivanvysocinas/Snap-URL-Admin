/**
 * Comprehensive notification system with localStorage persistence
 * Features real-time updates, automatic time formatting, and user-isolated storage
 */
import {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  FC,
} from "react";
import { useAuth } from "@/context/AuthContext";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  read: boolean;
}

const MAX_VISIBLE_NOTIFICATIONS = 4;

/**
 * Get storage key for current user
 * Requires authenticated user - throws error if userId is undefined
 */
const getStorageKey = (userId: string): string => {
  return `notifications_${userId}`;
};

/**
 * Core notification management logic with user-isolated localStorage persistence
 * Handles CRUD operations, time formatting, and automatic cleanup
 */
const useNotificationsLogic = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  // Load notifications from localStorage when user changes
  useEffect(() => {
    const userId = user?.id;

    // Only work with authenticated users
    if (!userId) {
      setNotifications([]);
      setIsLoading(false);
      setCurrentUserId(undefined);
      return;
    }

    // If user changed or first load, reset and load new notifications
    if (userId !== currentUserId) {
      setIsLoading(true);

      try {
        const storageKey = getStorageKey(userId);
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error loading notifications from localStorage:", error);
        setNotifications([]);
      } finally {
        setIsLoading(false);
        setCurrentUserId(userId);
      }
    }
  }, [user?.id, currentUserId]);

  // Persist notifications to localStorage when changed
  useEffect(() => {
    if (!isLoading && currentUserId) {
      try {
        const storageKey = getStorageKey(currentUserId);
        localStorage.setItem(storageKey, JSON.stringify(notifications));
      } catch (error) {
        console.error("Error saving notifications to localStorage:", error);
      }
    }
  }, [notifications, isLoading, currentUserId]);

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
      // Only allow notifications for authenticated users
      if (!currentUserId) {
        console.warn("Cannot add notification: user not authenticated");
        return undefined;
      }

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
    [generateId, formatTime, currentUserId]
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
 * Global notifications provider with real-time updates and user isolation
 * Enables notification functionality across the entire application
 * Automatically switches notification storage when user changes
 * Requires user authentication to function
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
