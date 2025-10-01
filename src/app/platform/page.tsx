import { Metadata } from "next";
import PlatformOverviewContent from "./PlatformOverviewContent";

export const metadata: Metadata = {
  title: "Platform Overview - SnapURL Admin",
  description:
    "Monitor platform-wide statistics, user activity, system health, and overall performance metrics for the SnapURL service.",
  keywords:
    "platform analytics, system overview, user statistics, platform metrics, admin dashboard, system monitoring",
};

/**
 * Platform overview page with comprehensive platform-wide analytics
 * Entry point for system health and user statistics monitoring
 */
export default function PlatformOverviewPage(): JSX.Element {
  return <PlatformOverviewContent />;
}
