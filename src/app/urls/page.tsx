import { Metadata } from "next";
import URLsContent from "./URLsContent";

export const metadata: Metadata = {
  title: "URL Management - SnapURL Admin",
  description:
    "Manage your shortened URLs, view analytics, create new links, and organize your URL collection.",
  keywords:
    "URL management, short links, link organization, URL analytics, QR codes",
};

/**
 * URLs management page with server-side metadata and client-side content
 * Provides comprehensive URL management interface
 */
export default function URLsPage(): JSX.Element {
  return <URLsContent />;
}
