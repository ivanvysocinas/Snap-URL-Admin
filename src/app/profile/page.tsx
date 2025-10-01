import { Metadata } from "next";
import ProfileContent from "./ProfileContent";

export const metadata: Metadata = {
  title: "Profile Settings - SnapURL Admin",
  description:
    "Manage your profile information, preferences, and account settings.",
  keywords:
    "profile, account settings, user preferences, QR settings, notifications",
};

/**
 * Profile settings page component
 * Entry point for comprehensive profile management interface
 */
export default function ProfilePage(): JSX.Element {
  return <ProfileContent />;
}
