import { LucideIcon } from "lucide-react";

/**
 * Simplified user interface for header components
 * Lightweight version without full user profile data
 */
export interface HeaderUser {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string | null;
  role?: "user" | "admin" | "moderator" | "demo";
}

/**
 * Notification structure for header notification dropdown
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  read: boolean;
  type?: "info" | "success" | "warning" | "error";
}

/**
 * Search result structure for header search functionality
 * Currently supports only URL search results
 */
export interface SearchResult {
  id: string;
  type: "url";
  title: string;
  subtitle?: string;
  href: string;
  icon: LucideIcon;
  metadata?: {
    clickCount?: number;
    createdAt?: string;
    shortCode?: string;
    domain?: string;
  };
}

/**
 * Header component props interface
 */
export interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
