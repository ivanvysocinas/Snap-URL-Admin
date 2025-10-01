/**
 * Main application header component with comprehensive functionality
 * Features: responsive design, global search with API integration, notifications system, user menu
 * Handles breadcrumb navigation, keyboard shortcuts, and data export capabilities
 * Integrates with multiple contexts for theme, auth, and notifications management
 */
import { useState, useCallback, useRef, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import { Menu, ChevronRight, AlertCircle, LinkIcon } from "lucide-react";

// Import real components
import EnhancedSearch from "../header/EnhancedSearch";
import NotificationsDropdown from "../header/NotificationsDropdown";
import UserMenu from "../header/UserMenu";
import QuickActions from "../header/QuickActions";

// Import real hooks and contexts
import { useNotifications } from "../../hooks/useNotifications";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

// Import API and types
import api from "../../lib/api";
import type { ShortUrl } from "../../types";
import type { HeaderProps, SearchResult } from "../../types/header.types";
import NotificationsModal from "./NotificationsModal";

const Header: FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Get current pathname from router for proper reactivity to route changes
  const [currentPath, setCurrentPath] = useState<string>("/dashboard");

  // Update current path when router changes
  useEffect(() => {
    // For Next.js 13+ app router, use window.location.pathname as fallback
    const path = typeof window !== "undefined" 
      ? window.location.pathname 
      : "/dashboard";
    setCurrentPath(path);
  }, [router]);

  // Listen for route changes in Next.js
  useEffect(() => {
    const handleRouteChange = () => {
      const path = typeof window !== "undefined" 
        ? window.location.pathname 
        : "/dashboard";
      setCurrentPath(path);
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Use real notifications hook
  const {
    notifications,
    visibleNotifications,
    unreadCount,
    hasMoreNotifications,
    addNotification,
    markAsRead,
    clearAllNotifications,
  } = useNotifications();

  // Search state management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [searchError, setSearchError] = useState<string | null>(null);

  // UI state management
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] =
    useState<boolean>(false);

  // Refs for DOM manipulation
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Outside click handlers using real hook
  const searchRef = useOutsideClick(() => {
    setShowSearchResults(false);
    setSelectedIndex(-1);
  }, showSearchResults);

  const notificationsRef = useOutsideClick(() => {
    setShowNotifications(false);
  }, showNotifications);

  const userMenuRef = useOutsideClick(() => {
    setShowUserMenu(false);
  }, showUserMenu);

  /**
   * Performs URL search using real API endpoint with error handling
   * Transforms API response to SearchResult format for consistent UI handling
   */
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchError(null);
      return;
    }

    try {
      setIsSearching(true);
      setShowSearchResults(true);
      setSearchError(null);

      // Search only URLs using real API
      const response = await api.urls.search(query, {
        page: 1,
        limit: 5, // Limit for header search results
        sortBy: "recent",
      });

      if (response.success && response.data) {
        // Transform API response to SearchResult format
        const urlResults: SearchResult[] = response.data.map(
          (url: ShortUrl) => ({
            id: `url-${url._id}`,
            type: "url" as const,
            title: url.title || "Untitled URL",
            subtitle: new URL(url.originalUrl).hostname,
            href: `/analytics/url/${url._id}`, // Navigate to analytics page
            icon: LinkIcon,
            metadata: {
              clickCount: url.clickCount,
              shortCode: url.shortCode,
              domain: new URL(url.originalUrl).hostname,
              createdAt: url.createdAt,
            },
          })
        );

        setSearchResults(urlResults);
        setSelectedIndex(-1);
      } else {
        throw new Error(response.message || "Search failed");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(error instanceof Error ? error.message : "Search failed");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  /**
   * Handles search input changes with debouncing to reduce API calls
   */
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 300); // Increased debounce for API calls
    },
    [performSearch]
  );

  /**
   * Handles keyboard navigation in search results with arrow keys and enter
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSearchResults || searchResults.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (
            selectedIndex >= 0 &&
            selectedIndex < searchResults.length &&
            searchResults[selectedIndex]
          ) {
            handleResultClick(searchResults[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowSearchResults(false);
          setSelectedIndex(-1);
          searchInputRef.current?.blur();
          break;
      }
    },
    [showSearchResults, searchResults, selectedIndex]
  );

  /**
   * Handles clicking on search result - navigates to analytics page
   */
  const handleResultClick = useCallback(
    (result: SearchResult) => {
      router.push(result.href);
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
      setSelectedIndex(-1);
      setSearchError(null);
      searchInputRef.current?.blur();
    },
    [router]
  );

  /**
   * Handles search input focus to show existing results
   */
  const handleSearchFocus = useCallback(() => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  }, [searchQuery]);

  /**
   * Keyboard shortcut for search (Cmd/Ctrl + K)
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  /**
   * Generates page title from current pathname with proper capitalization
   */
  const getPageTitle = useCallback((): string => {
    const pathSegments = currentPath.split("/").filter(Boolean);
    if (pathSegments.length === 0 || pathSegments[0] === "dashboard") {
      return "Dashboard";
    }
    const pageName = pathSegments[pathSegments.length - 1];
    return pageName
      ? pageName.charAt(0).toUpperCase() + pageName.slice(1).replace("-", " ")
      : "";
  }, [currentPath]);

  /**
   * Generates breadcrumb trail from current pathname
   */
  const getBreadcrumb = useCallback((): string[] => {
    const pathSegments = currentPath.split("/").filter(Boolean);
    return pathSegments.map(
      (segment) =>
        segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ")
    );
  }, [currentPath]);

  /**
   * Toggles notifications dropdown with proper state management
   */
  const handleToggleNotifications = useCallback(() => {
    setShowUserMenu(false);
    setShowNotifications(!showNotifications);
  }, [showNotifications]);

  /**
   * Toggles user menu dropdown with proper state management
   */
  const handleToggleUserMenu = useCallback(() => {
    setShowNotifications(false);
    setShowUserMenu(!showUserMenu);
  }, [showUserMenu]);

  /**
   * Opens full notifications modal
   */
  const handleOpenNotificationsModal = useCallback(() => {
    setShowNotifications(false);
    setShowNotificationsModal(true);
  }, []);

  /**
   * Handles navigation to different pages
   */
  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
      setShowUserMenu(false);
    },
    [router]
  );

  /**
   * Quick action handlers for common operations
   */
  const handleCreateUrl = useCallback(() => {
    router.push("/urls/create");
  }, [router]);

  /**
   * Handles data export with advanced logic supporting multiple formats
   * Includes comprehensive error handling and user feedback via notifications
   */
  const handleExport = useCallback(
    async (format: "json" | "csv" = "json") => {
      try {
        // Export all URLs via API since Header doesn't have selected URLs context
        const response = await api.urls.export({
          format,
          includeAnalytics: true,
        });

        let actualData: any;
        let isSuccessful: boolean;

        // Handle different response formats from API
        if (Array.isArray(response)) {
          actualData = response;
          isSuccessful = true;
        } else if (
          response &&
          typeof response === "object" &&
          "success" in response
        ) {
          actualData = response.data;
          isSuccessful = response.success;

          if (!isSuccessful) {
            throw new Error(response.message || "Failed to export URLs");
          }
        } else if (typeof response === "string") {
          actualData = response;
          isSuccessful = true;
        } else {
          throw new Error("Unexpected response format");
        }

        if (actualData) {
          let content: string;
          let mimeType: string;
          let filename: string;

          if (format === "csv") {
            // Convert to CSV format
            if (Array.isArray(actualData)) {
              const headers = Object.keys(actualData[0] || {});
              const csvContent = [
                headers.join(","),
                ...actualData.map((item) =>
                  headers
                    .map((header) => JSON.stringify(item[header] || ""))
                    .join(",")
                ),
              ].join("\n");
              content = csvContent;
            } else {
              content =
                typeof actualData === "string"
                  ? actualData
                  : JSON.stringify(actualData);
            }
            mimeType = "text/csv;charset=utf-8";
            filename = `urls_export_${new Date().toISOString().split("T")[0]}.csv`;
          } else {
            // JSON format
            content = JSON.stringify(actualData, null, 2);
            mimeType = "application/json;charset=utf-8";
            filename = `urls_export_${new Date().toISOString().split("T")[0]}.json`;
          }

          // Create and trigger download
          const blob = new Blob([content], { type: mimeType });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          link.style.display = "none";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          addNotification(
            "Export Completed",
            `Successfully exported data as ${filename}`
          );
          console.log(`Export completed successfully: ${filename}`);
        } else {
          throw new Error("No data to export");
        }
      } catch (error) {
        console.error("Error exporting URLs:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to export URLs";
        addNotification("Export Failed", errorMessage);
      }
    },
    [addNotification]
  );

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const breadcrumb = getBreadcrumb();
  const pageTitle = getPageTitle();

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900/95 border-gray-700"
            : "bg-white/95 border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Left Section - Mobile menu button and page title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page title and breadcrumbs */}
            <div className="hidden sm:block">
              <h1
                className={`text-xl font-semibold transition-all duration-200 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {pageTitle}
              </h1>
              {breadcrumb.length > 1 && (
                <nav className="flex items-center space-x-1 text-sm mt-1">
                  {breadcrumb.map((crumb, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      {index > 0 && (
                        <ChevronRight
                          className={`w-3 h-3 ${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                      )}
                      <span
                        className={`transition-colors ${
                          index === breadcrumb.length - 1
                            ? theme === "dark"
                              ? "text-blue-400"
                              : "text-blue-600"
                            : theme === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                        }`}
                      >
                        {crumb}
                      </span>
                    </div>
                  ))}
                </nav>
              )}
            </div>
          </div>

          {/* Center Section - Enhanced Search Component */}
          <EnhancedSearch
            theme={theme}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            searchResults={searchResults}
            isSearching={isSearching}
            showSearchResults={showSearchResults}
            selectedIndex={selectedIndex}
            onResultClick={handleResultClick}
            onKeyDown={handleKeyDown}
            onFocus={handleSearchFocus}
            searchRef={searchRef}
            inputRef={searchInputRef}
            error={searchError}
          />

          {/* Right Section - Quick actions, notifications, user menu */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions Component */}
            <QuickActions
              theme={theme}
              onCreateUrl={handleCreateUrl}
              onExport={handleExport}
              onRefresh={handleRefresh}
            />

            {/* Notifications Component */}
            <NotificationsDropdown
              theme={theme}
              show={showNotifications}
              notifications={visibleNotifications}
              unreadCount={unreadCount}
              hasMoreNotifications={hasMoreNotifications}
              onToggle={handleToggleNotifications}
              onMarkAsRead={markAsRead}
              onOpenModal={handleOpenNotificationsModal}
              dropdownRef={notificationsRef}
              totalNotifications={notifications.length}
            />

            {/* User Menu Component */}
            <UserMenu
              theme={theme}
              user={user}
              show={showUserMenu}
              onToggle={handleToggleUserMenu}
              onLogout={logout}
              onNavigate={handleNavigate}
              dropdownRef={userMenuRef}
            />
          </div>
        </div>

        {/* Search error display */}
        {searchError && showSearchResults && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{searchError}</span>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Notifications Modal */}
      {showNotificationsModal && (
        <NotificationsModal
          isOpen={showNotificationsModal}
          onClose={() => setShowNotificationsModal(false)}
          notifications={notifications}
          theme={theme}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={() => {
            notifications.forEach((notification) => {
              if (!notification.read) {
                markAsRead(notification.id);
              }
            });
          }}
          onRemoveNotification={(id: string) => {
            markAsRead(id);
          }}
          onClearAll={() => {
            clearAllNotifications();
          }}
        />
      )}
    </>
  );
};

export default Header;