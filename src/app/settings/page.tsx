import { Metadata } from "next";
import SettingsContent from "./SettingsContent";

export const metadata: Metadata = {
  title: "Settings - SnapURL Admin",
  description:
    "Configure your account settings, API access, data preferences, and system options.",
  keywords:
    "settings, API keys, data export, account configuration, preferences",
};

/**
 * Settings page with server-side metadata and client-side content
 * Provides comprehensive settings management interface
 */
export default function SettingsPage(): JSX.Element {
  return <SettingsContent />;
}
