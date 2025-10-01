import type { Metadata } from "next";
import AccessDeniedContent from "./AccessDeniedContent";

export const metadata: Metadata = {
  title: "Access Denied - SnapURL",
  description:
    "You don't have permission to access this page. This area is restricted to authorized users only.",
  robots: "noindex, nofollow",
};

/**
 * Access Denied page
 * Displayed when user attempts to access restricted content
 */
export default function AccessDeniedPage() {
  return <AccessDeniedContent requiredRoles={null} />;
}