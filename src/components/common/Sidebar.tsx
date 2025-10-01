/**
 * Main navigation sidebar with sophisticated animations and responsive design
 * Features role-based navigation filtering, expandable menu items, and smooth transitions
 * Includes user profile display, theme toggle, and logout functionality
 * Supports mobile overlay mode with backdrop and auto-collapse on navigation
 */
"use client";

import { useState, useEffect, FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Link as LinkIcon,
  Activity,
  Settings,
  LogOut,
  Moon,
  Sun,
  X,
  ChevronDown,
  Shield,
  Database,
  TrendingUp,
  FileText,
  Download,
  Zap,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import type { NavigationItem } from "../../types";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  /**
   * Navigation menu structure with role-based access control
   * Supports nested children with individual icons and permissions
   */
  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      id: "analytics",
      label: "Analytics",
      href: "/analytics",
      icon: Activity,
      children: [
        {
          id: "analytics-real-time",
          label: "Real-time",
          href: "/real-time",
          icon: Zap,
        },
        {
          id: "analytics-reports",
          label: "Reports",
          href: "/reports",
          icon: FileText,
        },
      ],
    },
    {
      id: "urls",
      label: "URLs",
      href: "/urls",
      icon: LinkIcon,
      children: [
        { id: "urls-all", label: "All URLs", href: "/urls", icon: LinkIcon },
        {
          id: "urls-create",
          label: "Create New",
          href: "/urls/create",
          icon: LinkIcon,
        },
        {
          id: "urls-bulk",
          label: "Bulk Import",
          href: "/urls/bulk",
          icon: Download,
        },
      ],
    },
    {
      id: "platform",
      label: "Platform",
      href: "/platform",
      icon: Database,
      requiredRole: ["admin", "demo"],
      children: [
        {
          id: "platform-overview",
          label: "Overview",
          href: "/platform",
          icon: TrendingUp,
        },
        {
          id: "platform-performance",
          label: "Performance",
          href: "/platform/performance",
          icon: Zap,
        },
        {
          id: "platform-security",
          label: "Security",
          href: "/platform/security",
          icon: Shield,
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  // Filter menu items based on user role permissions
  const filteredItems = navigationItems.filter((item) => {
    if (!item.requiredRole) return true;
    return user?.role && item.requiredRole.indexOf(user.role) !== -1;
  });

  /**
   * Auto-expand active menu on route change for better UX
   */
  useEffect(() => {
    const activeParent = navigationItems.find((item) =>
      item.children?.some((child) => pathname.startsWith(child.href))
    );
    if (activeParent) {
      setExpandedMenus((prev) => new Set(prev).add(activeParent.id));
    }
  }, [pathname]);

  /**
   * Handle menu expansion toggle with state management
   */
  const toggleMenu = (menuId: string): void => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  /**
   * Check if navigation item should be marked as active
   * Handles both direct matches and child route matches
   */
  const isItemActive = (item: NavigationItem, pathname: string): boolean => {
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => pathname === child.href);
    }
    return false;
  };

  // Complex animation variants for different sidebar states
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        mass: 1,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        mass: 1,
      },
    },
  };

  // Responsive design state management
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animation variants for backdrop overlay
  const backdropVariants = {
    open: {
      opacity: 1,
      backdropFilter: "blur(4px)",
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: {
        duration: 0.3,
      },
    },
  };

  // Staggered animation variants for content
  const contentVariants = {
    open: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1,
      },
    },
  };

  // Individual item animation variants
  const itemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Mobile backdrop with blur effect */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main sidebar container */}
      <motion.div
        initial={false}
        animate={isMobile ? (sidebarOpen ? "open" : "closed") : "open"}
        variants={
          isMobile ? sidebarVariants : { open: { x: 0 }, closed: { x: 0 } }
        }
        className={`fixed inset-y-0 left-0 z-50 w-64 lg:relative lg:z-auto ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-xl lg:shadow-none border-r ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        } ${sidebarOpen || !isMobile ? "block" : "hidden"}`}
      >
        <motion.div variants={contentVariants} className="flex flex-col h-full">
          {/* Brand header with logo and close button */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between p-6"
          >
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 group"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-700 transition-colors shadow-lg"
              >
                <LinkIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <span
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  SnapURL
                </span>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Admin Panel
                </p>
              </div>
            </Link>

            {/* Mobile close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden p-2 rounded-lg ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              } transition-colors`}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* User profile section */}
          {user && (
            <motion.div
              variants={itemVariants}
              className={`px-6 pb-4 border-b ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`w-10 h-10 rounded-full ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  } flex items-center justify-center shadow-md`}
                >
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user.name}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {user.role === "admin"
                      ? "Administrator"
                      : user.role === "moderator"
                        ? "Moderator"
                        : "User"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main navigation menu */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <motion.div variants={contentVariants} className="space-y-1">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <NavigationItem
                    item={item}
                    theme={theme}
                    isActive={isItemActive(item, pathname)}
                    isExpanded={expandedMenus.has(item.id)}
                    onToggle={() => toggleMenu(item.id)}
                    pathname={pathname}
                    onItemClick={() => setSidebarOpen(false)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </nav>

          {/* Bottom actions: theme toggle and logout */}
          <motion.div
            variants={itemVariants}
            className={`p-4 border-t ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            } space-y-2`}
          >
            {/* Theme toggle button */}
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleTheme}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              } shadow-sm hover:shadow-md`}
            >
              <motion.div
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.div>
              <span className="font-medium">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </motion.button>

            {/* Logout button */}
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                theme === "dark"
                  ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
              } shadow-sm hover:shadow-md`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

/**
 * Individual navigation item component with expandable children support
 * Features sophisticated animations for hover states and expansion transitions
 */
interface NavigationItemProps {
  item: NavigationItem;
  theme: string;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  pathname: string;
  onItemClick: () => void;
}

const NavigationItem: FC<NavigationItemProps> = ({
  item,
  theme,
  isActive,
  isExpanded,
  onToggle,
  pathname,
  onItemClick,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  return (
    <div>
      {hasChildren ? (
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
              : theme === "dark"
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      ) : (
        <Link href={item.href} onClick={onItemClick} className={`block w-full`}>
          <motion.div
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                : theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : theme === "dark"
                      ? "bg-gray-600 text-gray-300"
                      : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.badge}
              </motion.span>
            )}
          </motion.div>
        </Link>
      )}

      {/* Expandable children with staggered animations */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2, delay: 0.1 },
                staggerChildren: 0.05,
                delayChildren: 0.1,
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: {
                height: { duration: 0.3, delay: 0.1 },
                opacity: { duration: 0.2 },
                staggerChildren: 0.02,
                staggerDirection: -1,
              },
            }}
            className="ml-8 mt-2 space-y-1 overflow-hidden"
          >
            {item.children!.map((child) => {
              const ChildIcon = child.icon;
              const isChildActive = pathname === child.href;

              return (
                <motion.div
                  key={child.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  <Link
                    href={child.href}
                    onClick={onItemClick}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isChildActive
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20"
                          : theme === "dark"
                            ? "text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <ChildIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{child.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
