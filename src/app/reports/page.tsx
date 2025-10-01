import { Metadata } from "next";
import ReportsContent from "./ReportsContent";

export const metadata: Metadata = {
  title: "Analytics Reports - SnapURL Admin",
  description:
    "Generate comprehensive analytics reports and download detailed data insights for your shortened URLs.",
  keywords:
    "analytics reports, data export, automated reports, CSV export, JSON export, report generation, analytics data",
};

/**
 * Analytics reports page for generating and managing custom reports
 * Allows users to create, download, and manage various types of analytics reports
 */
export default function ReportsPage(): JSX.Element {
  return <ReportsContent />;
}
