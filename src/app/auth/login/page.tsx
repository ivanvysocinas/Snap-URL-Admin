import { type Metadata } from "next";
import AuthLayout from "../../../components/auth/AuthLayout";
import LoginForm from "../../../components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login - SnapURL Admin",
  description:
    "Sign in to your SnapURL admin account to manage your shortened URLs and view analytics.",
  keywords: "SnapURL, URL shortener, admin login, authentication, dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Login page with SEO optimization and proper metadata
 * Provides authentication interface for admin users
 */
export default function LoginPage() {
  return (
    <AuthLayout isLogin={true}>
      <LoginForm />
    </AuthLayout>
  );
}
