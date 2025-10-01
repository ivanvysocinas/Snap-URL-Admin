"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import AccessDeniedContent from "../app/access-denied/AccessDeniedContent";

interface RouteAccess {
  [key: string]: string[];
}

interface AccessControlContextType {
  hasAccess: boolean;
  requiredRoles: string[] | null;
  currentPath: string;
}

const AccessControlContext = createContext<
  AccessControlContextType | undefined
>(undefined);

interface AccessControlProviderProps {
  children: ReactNode;
}

/**
 * Access Control Provider
 * Manages route-based access control based on user roles
 * Displays access denied page when user lacks required permissions
 */
export const AccessControlProvider: FC<AccessControlProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean>(true);
  const [requiredRoles, setRequiredRoles] = useState<string[] | null>(null);

  /**
   * Route access configuration
   * Based on navigation items structure
   */
  const ROUTE_ACCESS: RouteAccess = {
    "/platform": ["admin", "demo"],
    "/platform/performance": ["admin", "demo"],
    "/platform/security": ["admin", "demo"],
  };

  /**
   * Public routes that don't require authentication
   */
  const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/recovery"];

  /**
   * Check if current route is public
   */
  const isPublicRoute = (path: string): boolean => {
    return PUBLIC_ROUTES.some((route) => path.startsWith(route));
  };

  /**
   * Check if user has access to current route
   */
  const checkAccess = (path: string, userRole?: string): boolean => {
    // Public routes are always accessible
    if (isPublicRoute(path)) {
      return true;
    }

    // All other routes require authentication
    if (!isAuthenticated || !userRole) {
      return false;
    }

    // Check if route has specific role requirements
    for (const [route, roles] of Object.entries(ROUTE_ACCESS)) {
      if (path.startsWith(route)) {
        setRequiredRoles(roles);
        return roles.includes(userRole);
      }
    }

    // Default: authenticated users have access
    setRequiredRoles(null);
    return true;
  };

  /**
   * Perform access check on route change or auth state change
   */
  useEffect(() => {
    console.log("AccessControl: Checking access for", pathname);
    console.log("AccessControl: User role:", user?.role);
    console.log("AccessControl: Is authenticated:", isAuthenticated);
    console.log("AccessControl: Loading:", loading);

    // Skip check while auth is loading
    if (loading) {
      return;
    }

    const access = checkAccess(pathname, user?.role);
    console.log("AccessControl: Access granted:", access);
    setHasAccess(access);

    // Redirect to login if not authenticated and not on public route
    if (!isAuthenticated && !isPublicRoute(pathname)) {
      console.log("AccessControl: Not authenticated, redirecting to login");
      router.replace("/auth/login");
    }
  }, [pathname, user?.role, isAuthenticated, loading, router]);

  const value: AccessControlContextType = {
    hasAccess,
    requiredRoles,
    currentPath: pathname,
  };

  // Show nothing while auth is loading
  if (loading) {
    return null;
  }

  // Show access denied page if user doesn't have access
  if (!hasAccess && isAuthenticated && !isPublicRoute(pathname)) {
    return (
      <AccessControlContext.Provider value={value}>
        <AccessDeniedContent requiredRoles={requiredRoles} />
      </AccessControlContext.Provider>
    );
  }

  return (
    <AccessControlContext.Provider value={value}>
      {children}
    </AccessControlContext.Provider>
  );
};

/**
 * Hook to use access control context
 * @throws Error if used outside AccessControlProvider
 */
export const useAccessControl = (): AccessControlContextType => {
  const context = useContext(AccessControlContext);
  if (context === undefined) {
    throw new Error(
      "useAccessControl must be used within an AccessControlProvider"
    );
  }
  return context;
};