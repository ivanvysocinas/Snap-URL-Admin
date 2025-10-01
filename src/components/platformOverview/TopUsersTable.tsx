"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Crown,
  Link,
  MousePointer,
  Clock,
  Mail,
  ChevronDown,
  Star,
  Zap,
} from "lucide-react";

interface TopUser {
  id: string;
  name: string;
  email: string;
  totalUrls: number;
  totalClicks: number;
  lastActive: string;
}

interface TopUsersTableProps {
  users: TopUser[];
  theme: string;
  loading?: boolean;
}

/**
 * Top users table with mobile-responsive design and rich animations
 * Features expandable mobile cards, ranking badges, and performance metrics
 */
export const TopUsersTable: FC<TopUsersTableProps> = ({
  users,
  theme,
  loading = false,
}) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  /**
   * Format relative time from ISO string
   */
  const formatTimeAgo = (isoString: string): string => {
    const now = new Date();
    const time = new Date(isoString);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - time.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  /**
   * Format number with K/M suffixes
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat().format(num);
  };

  /**
   * Get ranking badge styling and info
   */
  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return {
          color: "from-yellow-400 to-yellow-600",
          textColor: "text-white",
          icon: Crown,
          label: "#1",
          glow: "shadow-yellow-500/50",
        };
      case 1:
        return {
          color: "from-gray-300 to-gray-500",
          textColor: "text-white",
          icon: Crown,
          label: "#2",
          glow: "shadow-gray-500/30",
        };
      case 2:
        return {
          color: "from-orange-400 to-orange-600",
          textColor: "text-white",
          icon: Crown,
          label: "#3",
          glow: "shadow-orange-500/40",
        };
      default:
        return {
          color: "from-blue-500 to-purple-600",
          textColor: "text-white",
          icon: Users,
          label: `#${index + 1}`,
          glow: "shadow-blue-500/30",
        };
    }
  };

  /**
   * Truncate email for display
   */
  const truncateEmail = (email: string, maxLength: number = 20): string => {
    if (email.length <= maxLength) return email;
    const emailParts = email.split("@");
    if (emailParts.length !== 2) return email;

    const [username, domain] = emailParts;
    if (!username || !domain) return email;

    if (username.length > maxLength - domain.length - 4) {
      return `${username.substring(0, maxLength - domain.length - 7)}...@${domain}`;
    }
    return email;
  };

  if (loading) {
    return <LoadingState theme={theme} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Header */}
      <TableHeader theme={theme} />

      {users.length > 0 ? (
        <>
          {/* Desktop Table */}
          <DesktopTable
            users={users}
            theme={theme}
            getRankBadge={getRankBadge}
            formatNumber={formatNumber}
            formatTimeAgo={formatTimeAgo}
            truncateEmail={truncateEmail}
          />

          {/* Mobile Cards */}
          <MobileCards
            users={users}
            theme={theme}
            expandedUser={expandedUser}
            setExpandedUser={setExpandedUser}
            getRankBadge={getRankBadge}
            formatNumber={formatNumber}
            formatTimeAgo={formatTimeAgo}
            truncateEmail={truncateEmail}
          />

          {/* Summary Footer */}
          <SummaryFooter users={users} theme={theme} />
        </>
      ) : (
        <EmptyState theme={theme} />
      )}
    </motion.div>
  );
};

/**
 * Loading skeleton with animations
 */
interface LoadingStateProps {
  theme: string;
}

const LoadingState: FC<LoadingStateProps> = ({ theme }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`card overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
  >
    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Users className="w-6 h-6 text-purple-500" />
        </motion.div>
        <h3
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Top Users
        </h3>
      </div>
    </div>

    <div className="p-4 sm:p-6">
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center space-x-4"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

/**
 * Table header with floating animation
 */
interface TableHeaderProps {
  theme: string;
}

const TableHeader: FC<TableHeaderProps> = ({ theme }) => (
  <div className="relative px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="flex items-center justify-between relative z-10">
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Users className="w-6 h-6 text-purple-500" />
        </motion.div>
        <h3
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Top Users
        </h3>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-sm ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Most active users
      </motion.span>
    </div>

    {/* Floating particles */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3 + i,
          repeat: Infinity,
          delay: i * 0.5,
        }}
        style={{
          left: `${20 + i * 30}%`,
          top: `${50}%`,
        }}
      />
    ))}
  </div>
);

/**
 * Desktop table layout
 */
interface DesktopTableProps {
  users: TopUser[];
  theme: string;
  getRankBadge: (index: number) => any;
  formatNumber: (num: number) => string;
  formatTimeAgo: (isoString: string) => string;
  truncateEmail: (email: string, maxLength?: number) => string;
}

const DesktopTable: FC<DesktopTableProps> = ({
  users,
  theme,
  getRankBadge,
  formatNumber,
  formatTimeAgo,
  truncateEmail,
}) => (
  <div className="hidden md:block overflow-x-hidden">
    <table className="table-base">
      <thead className="table-header">
        <tr>
          <th className="text-left">Rank</th>
          <th className="text-left">User</th>
          <th className="text-center">URLs</th>
          <th className="text-center">Clicks</th>
          <th className="text-center">Last Active</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => {
          const rankBadge = getRankBadge(index);
          const RankIcon = rankBadge.icon;

          return (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              className="table-row"
            >
              {/* Rank column */}
              <td className="table-cell">
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`p-1.5 rounded-full bg-gradient-to-r ${rankBadge.color} shadow-lg ${rankBadge.glow}`}
                  >
                    <RankIcon className={`w-3 h-3 ${rankBadge.textColor}`} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {rankBadge.label}
                  </span>
                </motion.div>
              </td>

              {/* User column */}
              <td className="table-cell">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shadow-lg ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                          : index === 1
                            ? "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
                            : index === 2
                              ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
                              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </motion.div>
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user.name}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {truncateEmail(user.email)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </td>

              {/* URLs column */}
              <td className="table-cell text-center">
                <motion.div
                  className="flex flex-col items-center space-y-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center space-x-1">
                    <Link className="w-4 h-4 text-green-500" />
                    <span
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatNumber(user.totalUrls)}
                    </span>
                  </div>
                </motion.div>
              </td>

              {/* Clicks column */}
              <td className="table-cell text-center">
                <motion.div
                  className="flex flex-col items-center space-y-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center space-x-1">
                    <MousePointer className="w-4 h-4 text-purple-500" />
                    <span
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatNumber(user.totalClicks)}
                    </span>
                  </div>
                </motion.div>
              </td>

              {/* Last Active column */}
              <td className="table-cell text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {formatTimeAgo(user.lastActive)}
                  </span>
                </div>
              </td>
            </motion.tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

/**
 * Mobile cards layout (separate component due to complexity)
 */
interface MobileCardsProps {
  users: TopUser[];
  theme: string;
  expandedUser: string | null;
  setExpandedUser: (id: string | null) => void;
  getRankBadge: (index: number) => any;
  formatNumber: (num: number) => string;
  formatTimeAgo: (isoString: string) => string;
  truncateEmail: (email: string, maxLength?: number) => string;
}

const MobileCards: FC<MobileCardsProps> = ({
  users,
  theme,
  expandedUser,
  setExpandedUser,
  getRankBadge,
  formatNumber,
  formatTimeAgo,
  truncateEmail,
}) => (
  <div className="block md:hidden space-y-4 p-4">
    {users.map((user, index) => {
      const rankBadge = getRankBadge(index);
      const RankIcon = rankBadge.icon;
      const isExpanded = expandedUser === user.id;

      return (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-xl border cursor-pointer relative overflow-hidden ${
            theme === "dark"
              ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
              : "bg-gray-50 border-gray-200 hover:bg-white hover:shadow-md"
          } transition-all duration-300`}
          onClick={() => setExpandedUser(isExpanded ? null : user.id)}
        >
          {/* Rank badge */}
          <motion.div
            className={`absolute -top-0 -right-0 p-2 rounded-full bg-gradient-to-r ${rankBadge.color} shadow-lg ${rankBadge.glow}`}
            animate={{
              boxShadow: [
                `0 0 0px ${rankBadge.color}`,
                `0 0 20px ${rankBadge.color.split(" ")[1]}`,
                `0 0 0px ${rankBadge.color}`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <RankIcon className={`w-4 h-4 ${rankBadge.textColor}`} />
          </motion.div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                    : index === 1
                      ? "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
                      : index === 2
                        ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                }`}
                animate={{
                  rotate: isExpanded ? 360 : 0,
                  scale: isExpanded ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {user.name.charAt(0).toUpperCase()}
              </motion.div>

              <div className="flex-1 min-w-0">
                <h4
                  className={`font-semibold text-lg truncate ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.name}
                </h4>
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <p
                    className={`text-sm truncate ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {truncateEmail(user.email, 25)}
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
            </motion.div>
          </div>

          {/* Quick stats */}
          <div className="flex justify-around mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Link className="w-4 h-4 text-green-500" />
                <span
                  className={`font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatNumber(user.totalUrls)}
                </span>
              </div>
              <span className="text-xs text-gray-500">URLs</span>
            </motion.div>

            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <MousePointer className="w-4 h-4 text-purple-500" />
                <span
                  className={`font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatNumber(user.totalClicks)}
                </span>
              </div>
              <span className="text-xs text-gray-500">Clicks</span>
            </motion.div>

            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span
                  className={`font-medium text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {formatTimeAgo(user.lastActive)}
                </span>
              </div>
              <span className="text-xs text-gray-500">Last active</span>
            </motion.div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600"
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center p-3 rounded-lg bg-green-100 dark:bg-green-900/30"
                  >
                    <Zap className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-700 dark:text-green-400">
                      {user.totalClicks > 0
                        ? Math.round(user.totalClicks / user.totalUrls)
                        : 0}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-500">
                      Avg clicks/URL
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30"
                  >
                    <Star className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                      {rankBadge.label}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-500">
                      Global rank
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating sparkles for top 3 */}
          {index < 3 && (
            <>
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full ${
                    index === 0
                      ? "bg-yellow-400"
                      : index === 1
                        ? "bg-gray-400"
                        : "bg-orange-400"
                  }`}
                  animate={{
                    x: [10, 30, 10],
                    y: [10, -10, 10],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5 + index * 0.2,
                  }}
                  style={{
                    left: `${10 + i * 20}%`,
                    top: "20%",
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      );
    })}
  </div>
);

/**
 * Summary footer with legend
 */
interface SummaryFooterProps {
  users: TopUser[];
  theme: string;
}

const SummaryFooter: FC<SummaryFooterProps> = ({ users, theme }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="px-4 sm:px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-t border-gray-200 dark:border-gray-700"
  >
    <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-4">
      <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
        Showing top {users.length} most active users
      </span>
      <div className="flex items-center space-x-6">
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600"></div>
          <span
            className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
          >
            URLs created
          </span>
        </motion.div>
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
          <span
            className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
          >
            Total clicks
          </span>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

/**
 * Empty state component
 */
interface EmptyStateProps {
  theme: string;
}

const EmptyState: FC<EmptyStateProps> = ({ theme }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="p-12 text-center"
  >
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Users
        className={`w-16 h-16 mx-auto mb-4 ${
          theme === "dark" ? "text-gray-600" : "text-gray-400"
        }`}
      />
    </motion.div>
    <h4
      className={`text-lg font-medium mb-2 ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}
    >
      No User Data
    </h4>
    <p
      className={`text-sm ${
        theme === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      User activity data will appear here as the platform grows
    </p>
  </motion.div>
);
