"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react";
import Link from "next/link";

interface EmailStepProps {
  theme: string;
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  loading: boolean;
  error: string;
  success: string;
  validation: {
    emailValid: boolean;
    passwordValid: boolean;
    passwordsMatch: boolean;
    showValidation: boolean;
  };
  emailSent: boolean;
  countdown: number;
  handleInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onResend: () => Promise<void>;
}

/**
 * Email Step Component
 * Handles forgot password email submission with validation and demo instructions
 */
export const EmailStep: FC<EmailStepProps> = ({
  theme,
  formData,
  loading,
  error,
  success,
  validation,
  emailSent,
  countdown,
  handleInputChange,
  onSubmit,
  onResend,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const pulseVariants = {
    idle: { scale: 1 },
    active: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      key="email-step"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-md mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <motion.div
          variants={pulseVariants}
          initial="idle"
          animate="active"
          className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
        >
          <Lock className="w-8 h-8 text-white" />
        </motion.div>

        <h1
          className={`text-2xl sm:text-3xl font-bold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Forgot Password?
        </h1>

        <p
          className={`text-sm sm:text-base mb-3 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          No worries! Enter your email and we'll send you reset instructions.
        </p>

        {/* Demo notice */}
        <div className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-full">
          <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Demo Mode - No real emails sent
          </span>
        </div>
      </motion.div>

      {/* Success message */}
      {emailSent && success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 space-y-4"
        >
          {/* Main success message */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-300">
                {success}
              </p>
            </div>

            {/* Resend option */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-green-600 dark:text-green-400">
                Didn't receive the email?
              </span>
              <button
                onClick={onResend}
                disabled={countdown > 0 || loading}
                className={`text-xs font-medium transition-colors ${
                  countdown > 0 || loading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                }`}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend email"}
              </button>
            </div>
          </div>

          {/* Demo instructions */}
          {sessionStorage.getItem("demo_reset_token") && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Demo Mode Instructions
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    This is a demo implementation. In production, the reset link
                    would be sent to your email. For testing purposes, check the
                    browser console for the reset token and URL.
                  </p>
                  <button
                    onClick={() => {
                      const token = sessionStorage.getItem("demo_reset_token");
                      if (token) {
                        const resetUrl = `${window.location.origin}/auth/recovery?token=${token}`;
                        window.location.href = resetUrl;
                      }
                    }}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                  >
                    Use Demo Reset Link
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        variants={itemVariants}
        onSubmit={onSubmit}
        className="space-y-6"
      >
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Email Address
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail
                className={`w-5 h-5 ${
                  validation.showValidation && validation.emailValid
                    ? "text-green-500"
                    : validation.showValidation && !validation.emailValid
                      ? "text-red-500"
                      : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-400"
                }`}
              />
            </div>

            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 ${
                validation.showValidation && validation.emailValid
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20 " +
                    (theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900")
                  : validation.showValidation && !validation.emailValid
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 " +
                      (theme === "dark"
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-900")
                    : theme === "dark"
                      ? "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-800 text-white"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-gray-900"
              } focus:ring-2 focus:ring-opacity-20`}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />

            {validation.showValidation && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {validation.emailValid ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>

          {validation.showValidation && !validation.emailValid && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              Please enter a valid email address
            </motion.p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={!validation.emailValid || loading}
          whileHover={validation.emailValid && !loading ? { scale: 1.02 } : {}}
          whileTap={validation.emailValid && !loading ? { scale: 0.98 } : {}}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            validation.emailValid && !loading
              ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Reset Link</span>
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Back to login */}
      <motion.div variants={itemVariants} className="mt-6 text-center">
        <Link
          href="/auth/login"
          className={`inline-flex items-center space-x-2 text-sm font-medium transition-colors ${
            theme === "dark"
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-600 hover:text-gray-700"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};
