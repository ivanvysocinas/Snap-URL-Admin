"use client";

import { FC, RefObject } from "react";
import { Bell } from "lucide-react";

import type { Notification } from "../../types/header.types";

interface NotificationDropdownProps {
  theme: string;
  show: boolean;
  notifications: Notification[];
  unreadCount: number;
  hasMoreNotifications: boolean;
  onToggle: () => void;
  onMarkAsRead: (id: string) => void;
  onOpenModal: () => void;
  dropdownRef: RefObject<HTMLDivElement>;
  totalNotifications: number;
}

/**
 * Notifications dropdown component with real-time notifications
 * Features unread count badge, mark as read functionality, and view all modal
 */
const NotificationsDropdown: FC<NotificationDropdownProps> = ({
  theme,
  show,
  notifications,
  unreadCount,
  hasMoreNotifications,
  onToggle,
  onMarkAsRead,
  onOpenModal,
  dropdownRef,
  totalNotifications,
}) => {
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <NotificationButton
        theme={theme}
        unreadCount={unreadCount}
        onClick={onToggle}
      />

      {/* Dropdown Menu */}
      {show && (
        <div
          className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border overflow-hidden z-50 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
          style={{
            animation: "slideDown 0.2s ease-out",
            transformOrigin: "top right",
          }}
        >
          {/* Header */}
          <NotificationHeader theme={theme} unreadCount={unreadCount} />

          {/* Notification List */}
          <NotificationList
            theme={theme}
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
          />

          {/* Footer with "View All" button */}
          {hasMoreNotifications && (
            <NotificationFooter
              theme={theme}
              totalNotifications={totalNotifications}
              onOpenModal={onOpenModal}
            />
          )}
        </div>
      )}

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes scale {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Notification bell button with animated unread count badge
 */
interface NotificationButtonProps {
  theme: string;
  unreadCount: number;
  onClick: () => void;
}

const NotificationButton: FC<NotificationButtonProps> = ({
  theme,
  unreadCount,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 relative ${
      theme === "dark"
        ? "text-gray-300 hover:bg-gray-800"
        : "text-gray-600 hover:bg-gray-100"
    }`}
    aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
  >
    <Bell className="w-5 h-5" />
    {unreadCount > 0 && (
      <span
        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
        style={{
          animation: "scale 0.3s ease-out",
        }}
      >
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    )}
  </button>
);

/**
 * Dropdown header with notification count
 */
interface NotificationHeaderProps {
  theme: string;
  unreadCount: number;
}

const NotificationHeader: FC<NotificationHeaderProps> = ({
  theme,
  unreadCount,
}) => (
  <div
    className={`px-4 py-3 border-b ${
      theme === "dark" ? "border-gray-700" : "border-gray-200"
    }`}
  >
    <div className="flex items-center justify-between">
      <h3
        className={`text-sm font-medium ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Notifications
      </h3>
      {unreadCount > 0 && (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            theme === "dark"
              ? "bg-blue-900 text-blue-200"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {unreadCount} new
        </span>
      )}
    </div>
  </div>
);

/**
 * Scrollable notification list container
 */
interface NotificationListProps {
  theme: string;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const NotificationList: FC<NotificationListProps> = ({
  theme,
  notifications,
  onMarkAsRead,
}) => (
  <div className="max-h-96 overflow-y-auto overflow-x-hidden">
    {notifications.length === 0 ? (
      <NotificationEmptyState theme={theme} />
    ) : (
      <>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            theme={theme}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </>
    )}
  </div>
);

/**
 * Empty state when no notifications exist
 */
interface NotificationEmptyStateProps {
  theme: string;
}

const NotificationEmptyState: FC<NotificationEmptyStateProps> = ({ theme }) => (
  <div className="px-4 py-8 text-center">
    <Bell
      className={`w-8 h-8 mx-auto mb-2 ${
        theme === "dark" ? "text-gray-600" : "text-gray-400"
      }`}
    />
    <p
      className={`text-sm ${
        theme === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      No notifications yet
    </p>
    <p
      className={`text-xs mt-1 ${
        theme === "dark" ? "text-gray-500" : "text-gray-500"
      }`}
    >
      When you have updates, they'll appear here
    </p>
  </div>
);

/**
 * Individual notification item with click-to-read functionality
 */
interface NotificationItemProps {
  notification: Notification;
  theme: string;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  theme,
  onMarkAsRead,
}) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-2.5 border-b last:border-b-0 cursor-pointer transition-all duration-200 hover:translate-x-1 ${
        !notification.read
          ? theme === "dark"
            ? "bg-blue-900/20 border-gray-700 hover:bg-blue-900/30"
            : "bg-blue-50 border-gray-100 hover:bg-blue-100"
          : theme === "dark"
            ? "border-gray-700 hover:bg-gray-750"
            : "border-gray-100 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title and unread indicator */}
          <div className="flex items-center space-x-2">
            <h4
              className={`text-sm font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {notification.title}
            </h4>
            {!notification.read && (
              <div
                className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
                style={{ animation: "pulse 2s infinite" }}
              />
            )}
          </div>

          {/* Message */}
          <p
            className={`text-xs mt-1 line-clamp-2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {notification.message}
          </p>

          {/* Timestamp */}
          <span
            className={`text-xs mt-1 block ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {notification.time}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Footer with view all notifications button
 */
interface NotificationFooterProps {
  theme: string;
  totalNotifications: number;
  onOpenModal: () => void;
}

const NotificationFooter: FC<NotificationFooterProps> = ({
  theme,
  totalNotifications,
  onOpenModal,
}) => (
  <div
    className={`px-4 py-3 border-t ${
      theme === "dark" ? "border-gray-700" : "border-gray-200"
    }`}
  >
    <button
      onClick={onOpenModal}
      className={`w-full text-center text-sm font-medium py-1.5 rounded-lg transition-colors ${
        theme === "dark"
          ? "text-blue-400 hover:bg-gray-700"
          : "text-blue-600 hover:bg-gray-100"
      }`}
    >
      View All Notifications ({totalNotifications})
    </button>
  </div>
);

export default NotificationsDropdown;
