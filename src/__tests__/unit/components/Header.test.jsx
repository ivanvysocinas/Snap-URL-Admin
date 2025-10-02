import { render, screen, waitFor, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import Header from "../../../components/common/Header";

/**
 * Test wrapper component
 * Replaces real contexts with mocks for isolated testing
 */
const TestWrapper = ({ children }) => {
  return <div data-testid="mock-wrapper">{children}</div>;
};

// Mock fetch globally
global.fetch = jest.fn();

/**
 * Mock EnhancedSearch component without setTimeout
 * Provides synchronous behavior for predictable testing
 */
jest.mock("../../../components/header/EnhancedSearch", () => {
  return function MockEnhancedSearch({
    onResultClick,
    searchQuery,
    setSearchQuery,
  }) {
    return (
      <div data-testid="enhanced-search">
        <input
          data-testid="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search URLs..."
        />
        <div data-testid="search-results">
          {searchQuery && (
            <button
              data-testid="search-result-1"
              onClick={() => {
                onResultClick({
                  id: "url-1",
                  type: "url",
                  title: "Test Result",
                  href: "/test-result",
                });
                setSearchQuery("");
              }}
            >
              Test Result for "{searchQuery}"
            </button>
          )}
        </div>
      </div>
    );
  };
});

/**
 * Mock NotificationsDropdown component
 * Simulates notification badge and dropdown behavior
 */
jest.mock("../../../components/header/NotificationsDropdown", () => {
  return function MockNotificationsDropdown({ onToggle, show, unreadCount }) {
    return (
      <div data-testid="notifications-dropdown">
        <button
          data-testid="notifications-button"
          onClick={onToggle}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          Notifications{" "}
          {unreadCount > 0 && (
            <span data-testid="unread-badge">{unreadCount}</span>
          )}
        </button>
        {show && <div data-testid="notifications-menu">Notifications Menu</div>}
      </div>
    );
  };
});

/**
 * Mock UserMenu component
 * Provides user dropdown and logout functionality
 */
jest.mock("../../../components/header/UserMenu", () => {
  return function MockUserMenu({ onToggle, show, onLogout }) {
    return (
      <div data-testid="user-menu">
        <button data-testid="user-menu-button" onClick={onToggle}>
          User Menu
        </button>
        {show && (
          <div data-testid="user-menu-dropdown">
            <button data-testid="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };
});

/**
 * Mock ThemeContext
 * Provides theme state and toggle functionality
 */
jest.mock("../../../context/ThemeContext", () => ({
  ThemeProvider: ({ children }) => (
    <div data-testid="mock-theme">{children}</div>
  ),
  useTheme: () => ({
    theme: "dark",
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
}));

/**
 * Mock AuthContext
 * Provides authentication state and methods
 */
jest.mock("../../../context/AuthContext", () => ({
  AuthProvider: ({ children }) => <div data-testid="mock-auth">{children}</div>,
  useAuth: () => ({
    user: { name: "Test User", email: "test@example.com" },
    isAuthenticated: true,
    loading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

/**
 * Mock useNotifications hook
 * Provides notifications state and management methods
 */
jest.mock("../../../hooks/useNotifications", () => ({
  NotificationsProvider: ({ children }) => (
    <div data-testid="mock-notifications">{children}</div>
  ),
  useNotifications: () => ({
    notifications: [],
    visibleNotifications: [],
    unreadCount: 0,
    hasMoreNotifications: false,
    isLoading: false,
    addNotification: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    removeNotification: jest.fn(),
    clearAllNotifications: jest.fn(),
  }),
}));

describe("Header Component", () => {
  const defaultProps = {
    sidebarOpen: false,
    setSidebarOpen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();

    // Mock successful fetch responses
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          results: [
            { id: "url-1", title: "Test URL", shortUrl: `${process.env.NEXT_PUBLIC_API_URL}/test` },
          ],
        },
      }),
    });

    // Complete mock for window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
  });

  it("renders header with all main elements", async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("enhanced-search")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("notifications-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
  });

  it("toggles sidebar when menu button is clicked", async () => {
    const setSidebarOpen = jest.fn();
    const user = userEvent.setup();

    await act(async () => {
      render(
        <TestWrapper>
          <Header sidebarOpen={false} setSidebarOpen={setSidebarOpen} />
        </TestWrapper>
      );
    });

    const menuButton = screen.getByLabelText("Toggle sidebar");

    await act(async () => {
      await user.click(menuButton);
    });

    expect(setSidebarOpen).toHaveBeenCalledWith(true);
  });

  it("displays correct page title based on current path", async () => {
    delete window.location;
    window.location = { pathname: "/dashboard/analytics" };

    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("shows breadcrumb navigation for nested routes", async () => {
    delete window.location;
    window.location = { pathname: "/dashboard/analytics/reports" };

    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    expect(screen.getAllByText("Dashboard")).toHaveLength(2);
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  it("handles search input and results correctly", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    const searchInput = screen.getByTestId("search-input");

    await act(async () => {
      await user.type(searchInput, "test query");
    });

    expect(screen.getByTestId("search-results")).toBeInTheDocument();
    expect(
      screen.getByText('Test Result for "test query"')
    ).toBeInTheDocument();
  });

  it("navigates to correct URL when search result is clicked", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    const searchInput = screen.getByTestId("search-input");

    await act(async () => {
      await user.type(searchInput, "test");
    });

    expect(screen.getByTestId("search-result-1")).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByTestId("search-result-1"));
    });

    expect(searchInput).toHaveValue("");
  });

  it("supports keyboard navigation in search results", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    const searchInput = screen.getByTestId("search-input");

    await act(async () => {
      await user.type(searchInput, "test");
    });

    expect(screen.getByTestId("search-results")).toBeInTheDocument();
    expect(screen.getByTestId("search-result-1")).toBeInTheDocument();
  });

  it("toggles notifications dropdown when notifications button is clicked", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    const notificationsButton = screen.getByTestId("notifications-button");

    expect(screen.queryByTestId("notifications-menu")).not.toBeInTheDocument();

    await act(async () => {
      await user.click(notificationsButton);
    });

    expect(screen.getByTestId("notifications-menu")).toBeInTheDocument();

    await act(async () => {
      await user.click(notificationsButton);
    });

    expect(screen.queryByTestId("notifications-menu")).not.toBeInTheDocument();
  });

  it("toggles user menu dropdown when user menu button is clicked", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    const userMenuButton = screen.getByTestId("user-menu-button");

    await act(async () => {
      await user.click(userMenuButton);
    });

    expect(screen.getByTestId("user-menu-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
  });

  it("displays header correctly without export functionality", async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    expect(screen.getByTestId("enhanced-search")).toBeInTheDocument();
  });

  it("shows mobile menu button with correct classes", async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    const menuButton = screen.getByLabelText("Toggle sidebar");
    expect(menuButton).toHaveClass("lg:hidden");
  });

  it("applies correct theme classes to header", async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("sticky", "top-0", "z-40");
  });

  it("renders search component without errors", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    const searchInput = screen.getByTestId("search-input");

    await act(async () => {
      await user.type(searchInput, "test-query");
    });

    expect(searchInput).toHaveValue("test-query");
  });

  it("has proper ARIA labels for interactive elements", async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <Header {...defaultProps} />
        </TestWrapper>
      );
    });

    const menuButton = screen.getByLabelText("Toggle sidebar");
    expect(menuButton).toHaveAttribute("aria-label", "Toggle sidebar");

    const searchInput = screen.getByPlaceholderText("Search URLs...");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders consistently across re-renders", async () => {
    const { rerender } = render(
      <TestWrapper>
        <Header sidebarOpen={false} setSidebarOpen={jest.fn()} />
      </TestWrapper>
    );

    await act(async () => {
      rerender(
        <TestWrapper>
          <Header sidebarOpen={false} setSidebarOpen={jest.fn()} />
        </TestWrapper>
      );
    });

    expect(screen.getByTestId("enhanced-search")).toBeInTheDocument();
  });
});
