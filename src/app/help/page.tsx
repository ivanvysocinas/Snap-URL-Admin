import type { Metadata } from "next";
import HelpContent from "./HelpContent";

export const metadata: Metadata = {
  title: "Help Center - SnapURL",
  description:
    "Get help with SnapURL features, find answers to common questions, and learn how to make the most of our URL shortening service.",
  keywords: "help, support, FAQ, documentation, URL shortening, SnapURL guide",
};

/**
 * Help Center page component
 * Entry point for support and documentation features
 */
export default function HelpPage() {
  return <HelpContent />;
}
