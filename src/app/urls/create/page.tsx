import { Metadata } from "next";
import CreateNewUrlContent from "./CreateNewUrlContent";

export const metadata: Metadata = {
  title: "Create New URL - SnapURL Admin",
  description:
    "Create and customize your shortened URLs with advanced settings including QR codes, privacy options, and analytics.",
  keywords:
    "create URL, short links, QR codes, URL customization, link management",
};

/**
 * Create URL page with server-side metadata and client-side content
 * Provides comprehensive URL creation interface with advanced features
 */
export default function CreateUrlPage(): JSX.Element {
  return <CreateNewUrlContent />;
}
