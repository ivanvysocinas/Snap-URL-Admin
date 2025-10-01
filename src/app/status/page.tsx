import type { Metadata } from "next";
import StatusContent from "./StatusContent";

export const metadata: Metadata = {
  title: "System Status - SnapURL",
  description:
    "Check the real-time status of SnapURL services, uptime statistics, and any ongoing incidents or maintenance.",
  keywords:
    "status, uptime, system health, incidents, maintenance, service availability",
};

/**
 * System status page component
 * Entry point for real-time service monitoring and health status
 */
export default function StatusPage() {
  return <StatusContent />;
}
