"use client";

import { useState, useEffect, FC } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useTheme } from "../../../context/ThemeContext";
import { EmailStep } from "@/components/recovery/EmailStep";
import { ResetStep } from "@/components/recovery/ResetStep";
import { SuccessStep } from "@/components/recovery/SuccessStep";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Password Recovery Content Component
 * Main orchestrator for password recovery flow with step management
 */
export const RecoveryContent: FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const resetToken = searchParams?.get("token");

  // Form state
  const [step, setStep] = useState<"email" | "reset" | "success">(
    resetToken ? "reset" : "email"
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  // Validation state
  const [validation, setValidation] = useState({
    emailValid: false,
    passwordValid: false,
    passwordsMatch: false,
    showValidation: false,
  });

  // Countdown timer for resend functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  /**
   * Real-time email validation
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  /**
   * Password strength validation
   */
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  /**
   * Handle input changes with validation
   */
  const handleInputChange = (field: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");

    // Real-time validation
    if (field === "email") {
      setValidation((prev) => ({
        ...prev,
        emailValid: validateEmail(value),
        showValidation: value.length > 0,
      }));
    }

    if (field === "password") {
      setValidation((prev) => ({
        ...prev,
        passwordValid: validatePassword(value),
        passwordsMatch: value === formData.confirmPassword,
        showValidation: value.length > 0,
      }));
    }

    if (field === "confirmPassword") {
      setValidation((prev) => ({
        ...prev,
        passwordsMatch: value === formData.password,
        showValidation: value.length > 0,
      }));
    }
  };

  /**
   * Handle forgot password request - Demo version
   */
  const handleForgotPassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validation.emailValid || loading) return;

    setLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Generate demo reset token
      const demoToken = `demo_reset_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      setEmailSent(true);
      setSuccess("Password reset instructions would be sent to your email");
      setCountdown(60);

      // Store demo token
      sessionStorage.setItem("demo_reset_token", demoToken);
      sessionStorage.setItem("demo_reset_email", formData.email);

      console.log("Demo Reset Token:", demoToken);
    } catch (err: any) {
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle password reset - Demo version
   */
  const handleResetPassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (
      !validation.passwordValid ||
      !validation.passwordsMatch ||
      loading ||
      !resetToken
    ) {
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Simulate successful password reset
      setStep("success");
      setSuccess("Password has been reset successfully");

      // Clean up demo data
      sessionStorage.removeItem("demo_reset_token");
      sessionStorage.removeItem("demo_reset_email");
    } catch (err: any) {
      setError("Demo error: Password reset simulation failed");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle resend email
   */
  const handleResendEmail = async (): Promise<void> => {
    if (countdown > 0 || loading) return;
    await handleForgotPassword(new Event("submit") as any);
  };

  const commonProps = {
    theme,
    formData,
    loading,
    error,
    success,
    validation,
    handleInputChange,
  };

  // Show nothing while checking auth (prevents flash)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === "email" && (
            <EmailStep
              {...commonProps}
              emailSent={emailSent}
              countdown={countdown}
              onSubmit={handleForgotPassword}
              onResend={handleResendEmail}
            />
          )}
          {step === "reset" && (
            <ResetStep
              {...commonProps}
              resetToken={resetToken}
              onSubmit={handleResetPassword}
            />
          )}
          {step === "success" && <SuccessStep theme={theme} />}
        </AnimatePresence>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-blue-400/5 to-purple-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-green-400/5 to-blue-400/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};
