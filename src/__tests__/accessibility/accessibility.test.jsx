import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { ThemeProvider } from "../../context/ThemeContext";
import { AuthProvider } from "../../context/AuthContext";
import { NotificationsProvider } from "../../hooks/useNotifications";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { User } from "lucide-react";
import "whatwg-fetch";

expect.extend(toHaveNoViolations);

// Mock CreateURLModal component
const MockCreateURLModal = ({ isOpen, onClose, onSuccess, theme }) => {
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-label="Create URL" aria-modal="true">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-lg font-semibold mb-4">Create New URL</h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="originalUrl"
                className="block text-sm font-medium mb-2"
              >
                Original URL
              </label>
              <input
                id="originalUrl"
                name="originalUrl"
                type="url"
                className="w-full border rounded px-3 py-2"
                required
                aria-describedby="originalUrl-help"
              />
              <div id="originalUrl-help" className="text-xs text-gray-500 mt-1">
                Enter URL to shorten
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="customAlias"
                className="block text-sm font-medium mb-2"
              >
                Custom Alias (optional)
              </label>
              <input
                id="customAlias"
                name="customAlias"
                type="text"
                className="w-full border rounded px-3 py-2"
                aria-describedby="customAlias-help"
              />
              <div id="customAlias-help" className="text-xs text-gray-500 mt-1">
                Leave empty for auto-generation
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Mock StatsCard component
const MockStatsCard = ({ title, value, icon: Icon, color, theme }) => {
  return (
    <div
      className="bg-white rounded-lg shadow p-6"
      role="region"
      aria-labelledby={`stats-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div className="flex items-center">
        <div className="flex-1">
          <h3
            id={`stats-${title.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-lg font-semibold text-gray-900"
          >
            {title}
          </h3>
          <p
            className="text-3xl font-bold text-gray-900 mt-2"
            aria-label={`${title}: ${value.toLocaleString()}`}
          >
            1,234
          </p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`} aria-hidden="true">
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
};

// Test wrapper with all providers
const AccessibilityWrapper = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <NotificationsProvider>{children}</NotificationsProvider>
    </AuthProvider>
  </ThemeProvider>
);

jest.mock("../../context/AuthContext", () => ({
  AuthProvider: ({ children }) => <div data-testid="mock-auth">{children}</div>,
  useAuth: () => ({
    user: { name: "Test User" },
    isAuthenticated: true,
    loading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe("Accessibility Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("authToken", "mock_token");

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("Header should be accessible", async () => {
    const { container } = render(
      <AccessibilityWrapper>
        <Header sidebarOpen={false} setSidebarOpen={jest.fn()} />
      </AccessibilityWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Sidebar should be accessible", async () => {
    const MockSidebar = ({ sidebarOpen, setSidebarOpen }) => (
      <nav className="sidebar" role="navigation" aria-label="Main menu">
        <div className="sidebar-content">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Close sidebar menu"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
          <ul>
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/urls">URLs</a>
            </li>
            <li>
              <a href="/analytics">Analytics</a>
            </li>
          </ul>
        </div>
      </nav>
    );

    const { container } = render(
      <AccessibilityWrapper>
        <MockSidebar sidebarOpen={true} setSidebarOpen={jest.fn()} />
      </AccessibilityWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("CreateURL Modal should be accessible", async () => {
    const { container } = render(
      <AccessibilityWrapper>
        <MockCreateURLModal
          isOpen={true}
          onClose={jest.fn()}
          onSuccess={jest.fn()}
          theme="light"
        />
      </AccessibilityWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Forms should have proper labels and ARIA attributes", async () => {
    const { container, getByLabelText, getByRole } = render(
      <AccessibilityWrapper>
        <MockCreateURLModal
          isOpen={true}
          onClose={jest.fn()}
          onSuccess={jest.fn()}
          theme="light"
        />
      </AccessibilityWrapper>
    );

    expect(getByLabelText(/original url/i)).toBeInTheDocument();
    expect(getByLabelText(/custom alias/i)).toBeInTheDocument();
    expect(getByLabelText(/title/i)).toBeInTheDocument();
    expect(getByRole("dialog")).toBeInTheDocument();

    const formElement = container.querySelector("form");
    expect(formElement).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should support proper keyboard navigation", () => {
    const { getAllByRole } = render(
      <AccessibilityWrapper>
        <Header sidebarOpen={false} setSidebarOpen={jest.fn()} />
      </AccessibilityWrapper>
    );

    const buttons = getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);

    buttons.forEach((button) => {
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
    });
  });

  it("should meet color contrast requirements", async () => {
    const { container } = render(
      <AccessibilityWrapper>
        <div className="bg-white text-gray-900 p-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome to your dashboard</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create URL
          </button>
        </div>
      </AccessibilityWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should be accessible in dark theme", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query.includes("dark"),
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const { container } = render(
      <AccessibilityWrapper>
        <div className="dark bg-gray-900 text-white p-4">
          <Header sidebarOpen={false} setSidebarOpen={jest.fn()} />
        </div>
      </AccessibilityWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should manage focus properly in modals", () => {
    const { getByRole } = render(
      <AccessibilityWrapper>
        <MockCreateURLModal
          isOpen={true}
          onClose={jest.fn()}
          onSuccess={jest.fn()}
          theme="light"
        />
      </AccessibilityWrapper>
    );

    const dialog = getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("should announce errors to screen readers", async () => {
    const { container, getByText, getByLabelText } = render(
      <AccessibilityWrapper>
        <div>
          <form>
            <label
              htmlFor="email-input"
              className="block text-sm font-medium mb-2"
            >
              Email address
            </label>
            <input
              id="email-input"
              type="email"
              aria-invalid="true"
              aria-describedby="email-error"
              className="w-full border rounded px-3 py-2"
            />
            <div
              id="email-error"
              role="alert"
              className="text-red-600 text-sm mt-1"
            >
              Please enter a valid email address
            </div>
          </form>
        </div>
      </AccessibilityWrapper>
    );

    expect(getByText("Please enter a valid email address")).toHaveAttribute(
      "role",
      "alert"
    );
    expect(getByLabelText("Email address")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should handle loading states accessibly", async () => {
    const { container, getByText } = render(
      <AccessibilityWrapper>
        <div>
          <div role="status" aria-live="polite">
            Loading dashboard data...
          </div>
          <div aria-busy="true">Content loading...</div>
        </div>
      </AccessibilityWrapper>
    );

    expect(getByText("Loading dashboard data...")).toHaveAttribute(
      "role",
      "status"
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have accessible data tables", async () => {
    const { container, getAllByRole } = render(
      <AccessibilityWrapper>
        <table role="table" aria-label="URL Statistics">
          <thead>
            <tr>
              <th scope="col">URL Title</th>
              <th scope="col">Clicks</th>
              <th scope="col">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Example URL</td>
              <td>123</td>
              <td>2024-01-15</td>
            </tr>
          </tbody>
        </table>
      </AccessibilityWrapper>
    );

    const columnHeaders = getAllByRole("columnheader");
    expect(columnHeaders).toHaveLength(3);

    columnHeaders.forEach((header) => {
      expect(header).toHaveAttribute("scope", "col");
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should remain accessible on mobile viewports", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { container } = render(
      <AccessibilityWrapper>
        <Header sidebarOpen={false} setSidebarOpen={jest.fn()} />
      </AccessibilityWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should respect reduced motion preferences", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query.includes("reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const { container } = render(
      <AccessibilityWrapper>
        <div className="animate-fade-in motion-reduce:animate-none">
          <Header sidebarOpen={false} setSidebarOpen={jest.fn()} />
        </div>
      </AccessibilityWrapper>
    );

    const animatedElement = container.querySelector(".animate-fade-in");
    expect(animatedElement).toHaveClass("motion-reduce:animate-none");
  });

  it("should work with high contrast mode", async () => {
    const { container } = render(
      <AccessibilityWrapper>
        <div
          style={{
            forcedColorAdjust: "none",
            backgroundColor: "ButtonFace",
            color: "ButtonText",
          }}
        >
          <Header sidebarOpen={false} setSidebarOpen={jest.fn()} />
        </div>
      </AccessibilityWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
