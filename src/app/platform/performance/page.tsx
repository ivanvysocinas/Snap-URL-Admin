import { Metadata } from "next";
import PlatformPerformanceContent from "./PlatformPerformanceContent";

export const metadata: Metadata = {
  title: "Platform Performance - SnapURL Admin",
  description:
    "Monitor API performance, response times, rate limiting, geographic distribution, and system load metrics for optimal platform operation.",
  keywords:
    "API performance, response times, rate limiting, system metrics, platform monitoring, server performance, geographic analytics",
};

/**
 * Platform performance page with detailed system performance analytics
 * Entry point for API metrics and performance monitoring
 */
export default function PlatformPerformancePage(): JSX.Element {
  return <PlatformPerformanceContent />;
}
