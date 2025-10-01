import { Metadata } from "next";
import PlatformSecurityContent from "./PlatformSecurityContent";

export const metadata: Metadata = {
  title: "Platform Security - SnapURL Admin",
  description:
    "Monitor security threats, failed login attempts, suspicious activity, API abuse detection, and manage security operations for the SnapURL platform.",
  keywords:
    "platform security, threat monitoring, failed logins, API abuse, security operations, suspicious activity, account management",
};

/**
 * Platform security page with comprehensive security monitoring
 * Entry point for security threat monitoring and operations management
 */
export default function PlatformSecurityPage(): JSX.Element {
  return <PlatformSecurityContent />;
}
