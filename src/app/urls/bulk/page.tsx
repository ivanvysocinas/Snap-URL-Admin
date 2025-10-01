import { Metadata } from "next";
import BulkImportContent from "./BulkImportContent";

export const metadata: Metadata = {
  title: "Bulk Import - SnapURL Admin",
  description:
    "Import multiple URLs at once from files, other services, or browser bookmarks.",
  keywords:
    "bulk import, CSV import, URL migration, browser bookmarks, mass URL creation",
};

/**
 * Bulk Import page with server-side metadata and client-side content
 * Provides bulk URL import functionality from various sources
 */
export default function BulkImportPage(): JSX.Element {
  return <BulkImportContent />;
}
