"use client";

import { useState, useEffect, FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import LoadingSpinner from "../common/LoadingSpinner";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

/**
 * Main dashboard layout component that wraps all dashboard pages
 * Handles authentication, responsive sidebar, and layout structure
 */
const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
  title = "Dashboard",
  description,
}) => {
  const { theme, mounted } = useTheme();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, loading, mounted, router]);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show loading spinner while authenticating or mounting
  if (!mounted || loading) {
    return (
      <LoadingSpinner
        size="lg"
        variant="brand"
        text="Loading dashboard..."
        fullScreen={true}
        theme={theme}
      />
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={`min-h-screen flex ${
        theme === "dark" ? "bg-gray-900" : "bg-slate-100"
      }`}
    >
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 p-4 sm:p-6 lg:p-8"
            >
              {/* Page Header */}
              {(title || description) && (
                <div className="mb-8">
                  {title && (
                    <h1
                      className={`text-2xl sm:text-3xl font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } mb-2`}
                    >
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p
                      className={`text-sm sm:text-base ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}

              {/* Page Content */}
              <div className="space-y-6">{children}</div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <DashboardFooter theme={theme} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

/**
 * Dashboard footer component with links and copyright
 */
interface DashboardFooterProps {
  theme: string;
}

const DashboardFooter: FC<DashboardFooterProps> = ({ theme }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t py-6 px-4 sm:px-6 lg:px-8 ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        {/* Links */}
        <div className="flex items-center space-x-6">
          <FooterLink href="/help" text="Help Center" theme={theme} />
          <FooterLink
            href="https://snap-url-api-production.up.railway.app/api-docs"
            text="API Docs"
            theme={theme}
          />
          <FooterLink href="/status" text="Status" theme={theme} />
          <FooterLink href="/privacy" text="Privacy" theme={theme} />
        </div>

        {/* Copyright */}
        <div className="flex items-center space-x-4">
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            © {currentYear} SnapURL. All rights reserved.
          </p>

          {/* Version Badge */}
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              theme === "dark"
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
};

/**
 * Footer link component
 */
interface FooterLinkProps {
  href: string;
  text: string;
  theme: string;
}

const FooterLink: FC<FooterLinkProps> = ({ href, text, theme }) => (
  <a
    href={href}
    className={`text-sm transition-colors ${
      theme === "dark"
        ? "text-gray-400 hover:text-gray-300"
        : "text-gray-500 hover:text-gray-700"
    }`}
    target={href.startsWith("http") ? "_blank" : "_self"}
    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
  >
    {text}
  </a>
);

/**
 * Hook for managing dashboard layout state
 */
export const useDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  return {
    sidebarOpen,
    setSidebarOpen,
    pageLoading,
    setPageLoading,
  };
};

export default DashboardLayout;
