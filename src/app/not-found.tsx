import type { Metadata } from "next";
import NotFoundContent from "./NotFoundContent";

export const metadata: Metadata = {
  title: "404 - Page Not Found | SnapURL",
  description:
    "Oops! The page you're looking for doesn't exist. It might have been moved or deleted.",
  robots: "noindex, follow",
};

/**
 * 404 Not Found page
 * Displayed when user navigates to non-existent route
 */
export default function NotFound() {
  return <NotFoundContent />;
}