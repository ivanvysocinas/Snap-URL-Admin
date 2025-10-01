import { type Metadata } from "next";
import AuthLayout from "../../../components/auth/AuthLayout";
import RegisterForm from "../../../components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account - SnapURL",
  description:
    "Create your SnapURL account to start shortening URLs, tracking analytics, and managing your links efficiently.",
  keywords: "SnapURL, URL shortener, sign up, create account, registration",
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

/**
 * Registration page with SEO optimization
 * Provides new user registration interface
 */
export default function RegisterPage() {
  return (
    <AuthLayout isLogin={false}>
      <RegisterForm />
    </AuthLayout>
  );
}
