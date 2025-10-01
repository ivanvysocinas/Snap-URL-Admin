"use client";

import { FC } from "react";
import { Plus, Download, RefreshCw, LucideIcon } from "lucide-react";

interface QuickActionsProps {
  theme: string;
  onCreateUrl: () => void;
  onExport: () => void;
  onRefresh: () => void;
}

/**
 * Quick actions component with common header actions
 * Features create URL, export data, and refresh functionality
 * Hidden on mobile/tablet for space optimization
 */
const QuickActions: FC<QuickActionsProps> = ({
  theme,
  onCreateUrl,
  onExport,
  onRefresh,
}) => {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <QuickActionButton
        icon={Plus}
        tooltip="Create New URL"
        onClick={onCreateUrl}
        theme={theme}
        variant="primary"
      />
      <QuickActionButton
        icon={Download}
        tooltip="Export Data"
        onClick={onExport}
        theme={theme}
        variant="secondary"
      />
      <QuickActionButton
        icon={RefreshCw}
        tooltip="Refresh Page"
        onClick={onRefresh}
        theme={theme}
        variant="secondary"
      />
    </div>
  );
};

interface QuickActionButtonProps {
  icon: LucideIcon;
  tooltip: string;
  onClick: () => void;
  theme: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

/**
 * Individual quick action button with hover animations and tooltip
 */
const QuickActionButton: FC<QuickActionButtonProps> = ({
  icon: Icon,
  tooltip,
  onClick,
  theme,
  variant = "secondary",
  disabled = false,
}) => {
  const getButtonStyles = (): string => {
    const baseStyles =
      "p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed";

    if (variant === "primary") {
      return `${baseStyles} ${
        theme === "dark"
          ? "bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600"
          : "bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600"
      }`;
    }

    return `${baseStyles} ${
      theme === "dark"
        ? "text-gray-300 hover:bg-gray-800 disabled:hover:bg-transparent"
        : "text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent"
    }`;
  };

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      title={tooltip}
      className={getButtonStyles()}
      aria-label={tooltip}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

export default QuickActions;
