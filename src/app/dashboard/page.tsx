import type { Metadata } from "next";
import DashboardContent from "./DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard - SnapURL Admin",
  description:
    "Monitor your URL performance, track analytics, and manage your shortened links from the comprehensive admin dashboard.",
  keywords:
    "dashboard, analytics, URL management, click tracking, performance metrics",
};

/**
 * Dashboard page with server-side metadata and client-side content
 * Provides comprehensive overview of URL performance and analytics
 */
export default function DashboardPage() {
  return <DashboardContent />;
}
