"use client";

import { useState, FC } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Key,
  Shield,
} from "lucide-react";
import Link from "next/link";

interface ResetStepProps {
  theme: string;
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  loading: boolean;
  error: string;
  validation: {
    emailValid: boolean;
    passwordValid: boolean;
    passwordsMatch: boolean;
    showValidation: boolean;
  };
  resetToken: string | null;
  handleInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Reset Step Component
 * Handles new password creation with validation and visibility toggles
 */
export const ResetStep: FC<ResetStepProps> = ({
  theme,
  formData,
  loading,
  error,
  validation,
  handleInputChange,
  onSubmit,
}) => {
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });

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
      key="reset-step"
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
          className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full"
        >
          <Key className="w-8 h-8 text-white" />
        </motion.div>

        <h1
          className={`text-2xl sm:text-3xl font-bold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Reset Password
        </h1>

        <p
          className={`text-sm sm:text-base mb-3 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Create a new secure password for your account.
        </p>

        {/* Demo notice */}
        <div className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-full">
          <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Demo Mode - Password won't be changed
          </span>
        </div>
      </motion.div>

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
        {/* New Password */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            New Password
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock
                className={`w-5 h-5 ${
                  validation.showValidation && validation.passwordValid
                    ? "text-green-500"
                    : validation.showValidation && !validation.passwordValid
                      ? "text-red-500"
                      : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-400"
                }`}
              />
            </div>

            <input
              type={showPasswords.password ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 ${
                validation.showValidation && validation.passwordValid
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50 text-gray-900"
                  : validation.showValidation && !validation.passwordValid
                    ? theme === "dark"
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-gray-800 text-white"
                      : "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 text-gray-900"
                    : theme === "dark"
                      ? "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-800 text-white"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50 text-gray-900"
              } focus:ring-2 focus:ring-opacity-20`}
              placeholder="Enter new password (min 6 characters)"
              required
              disabled={loading}
              minLength={6}
            />

            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  password: !prev.password,
                }))
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.password ? (
                <EyeOff
                  className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`}
                />
              ) : (
                <Eye
                  className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`}
                />
              )}
            </button>
          </div>

          {validation.showValidation && !validation.passwordValid && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              Password must be at least 6 characters long
            </motion.p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Confirm New Password
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield
                className={`w-5 h-5 ${
                  validation.showValidation && validation.passwordsMatch
                    ? "text-green-500"
                    : validation.showValidation && !validation.passwordsMatch
                      ? "text-red-500"
                      : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-400"
                }`}
              />
            </div>

            <input
              type={showPasswords.confirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 ${
                validation.showValidation &&
                validation.passwordsMatch &&
                formData.confirmPassword
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50 text-gray-900"
                  : validation.showValidation &&
                      !validation.passwordsMatch &&
                      formData.confirmPassword
                    ? theme === "dark"
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-gray-800 text-white"
                      : "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 text-gray-900"
                    : theme === "dark"
                      ? "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-800 text-white"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50 text-gray-900"
              } focus:ring-2 focus:ring-opacity-20`}
              placeholder="Confirm your new password"
              required
              disabled={loading}
            />

            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  confirmPassword: !prev.confirmPassword,
                }))
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.confirmPassword ? (
                <EyeOff
                  className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`}
                />
              ) : (
                <Eye
                  className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`}
                />
              )}
            </button>
          </div>

          {validation.showValidation &&
            !validation.passwordsMatch &&
            formData.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                Passwords do not match
              </motion.p>
            )}
        </div>

        <motion.button
          type="submit"
          disabled={
            !validation.passwordValid || !validation.passwordsMatch || loading
          }
          whileHover={
            validation.passwordValid && validation.passwordsMatch && !loading
              ? { scale: 1.02 }
              : {}
          }
          whileTap={
            validation.passwordValid && validation.passwordsMatch && !loading
              ? { scale: 0.98 }
              : {}
          }
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            validation.passwordValid && validation.passwordsMatch && !loading
              ? "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Resetting...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Reset Password</span>
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
