import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy - SnapURL",
  description:
    "Learn how SnapURL collects, uses, and protects your personal information. Our comprehensive privacy policy explains our data practices and your rights.",
  keywords:
    "privacy policy, data protection, GDPR, user rights, data collection, SnapURL privacy",
};

/**
 * Privacy Policy page component
 * Entry point for comprehensive privacy policy documentation
 */
export default function PrivacyPage() {
  return <PrivacyContent />;
}
