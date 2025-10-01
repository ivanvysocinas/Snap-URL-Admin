"use client";

import { FC, RefObject } from "react";
import { User, Settings, LogOut, ChevronDown, LucideIcon } from "lucide-react";

import type { HeaderUser as UserType } from "../../types/header.types";

interface UserMenuProps {
  theme: string;
  user: UserType | null | undefined;
  show: boolean;
  onToggle: () => void;
  onLogout: () => void;
  onNavigate: (path: string) => void;
  dropdownRef: RefObject<HTMLDivElement>;
}

/**
 * User menu component with profile dropdown
 * Features user avatar with initials, profile navigation, settings, and logout
 */
const UserMenu: FC<UserMenuProps> = ({
  theme,
  user,
  show,
  onToggle,
  onLogout,
  onNavigate,
  dropdownRef,
}) => {
  const handleProfileClick = () => {
    onNavigate("/profile");
  };

  const handleSettingsClick = () => {
    onNavigate("/settings");
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Menu Button */}
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
          theme === "dark"
            ? "text-gray-300 hover:bg-gray-800"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        aria-label="User menu"
      >
        <UserAvatar user={user} theme={theme} />
        <ChevronDown className="w-4 h-4 hidden sm:block" />
      </button>

      {/* Dropdown Menu */}
      {show && (
        <div
          className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border overflow-hidden z-50 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
          style={{
            animation: "slideDown 0.2s ease-out",
            transformOrigin: "top right",
          }}
        >
          {/* User Information */}
          <UserInfo user={user} theme={theme} />

          {/* Menu Items */}
          <div className="py-1">
            <UserMenuItem
              icon={User}
              label="Profile"
              onClick={handleProfileClick}
              theme={theme}
            />
            <UserMenuItem
              icon={Settings}
              label="Settings"
              onClick={handleSettingsClick}
              theme={theme}
            />

            {/* Divider */}
            <div
              className={`border-t ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              } my-1`}
            />

            <UserMenuItem
              icon={LogOut}
              label="Log out"
              onClick={handleLogoutClick}
              theme={theme}
              destructive
            />
          </div>
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
      `}</style>
    </div>
  );
};

/**
 * User avatar component with initials fallback
 */
interface UserAvatarProps {
  user: UserType | null | undefined;
  theme: string;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, theme }) => {
  const getInitials = (): string => {
    if (!user?.name) return "U";

    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
      }`}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name || "User"}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {getInitials()}
        </span>
      )}
    </div>
  );
};

/**
 * User information section with role badge
 */
interface UserInfoProps {
  user: UserType | null | undefined;
  theme: string;
}

const UserInfo: FC<UserInfoProps> = ({ user, theme }) => (
  <div
    className={`px-4 py-3 border-b ${
      theme === "dark" ? "border-gray-700" : "border-gray-200"
    }`}
  >
    <div className="flex items-center space-x-3">
      <UserAvatar user={user} theme={theme} />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {user?.name || "User"}
        </p>
        <p
          className={`text-xs truncate ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {user?.email || "user@example.com"}
        </p>
        {user?.role && user.role !== "user" && (
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium mt-1 ${
              user.role === "admin"
                ? theme === "dark"
                  ? "bg-red-900/30 text-red-400"
                  : "bg-red-100 text-red-700"
                : theme === "dark"
                  ? "bg-yellow-900/30 text-yellow-400"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        )}
      </div>
    </div>
  </div>
);

/**
 * Individual menu item with hover animations
 */
interface UserMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  theme: string;
  destructive?: boolean;
}

const UserMenuItem: FC<UserMenuItemProps> = ({
  icon: Icon,
  label,
  onClick,
  theme,
  destructive = false,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-all duration-150 hover:translate-x-1 ${
      destructive
        ? theme === "dark"
          ? "text-red-400 hover:bg-red-900/20"
          : "text-red-600 hover:bg-red-50"
        : theme === "dark"
          ? "text-gray-300 hover:bg-gray-700"
          : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm">{label}</span>
  </button>
);

export default UserMenu;
