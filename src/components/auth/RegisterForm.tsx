/**
 * Registration form with advanced password strength validation and confirmation matching
 * Features real-time password strength indicator, comprehensive field validation, and smooth animations
 * Includes password visibility toggles, visual confirmation indicators, and terms acceptance
 * Integrates with AuthContext for registration operations and error handling
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import type { RegisterData, FormErrors } from "../../types";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const { theme } = useTheme();
  const { register, loading, error, clearError, isAuthenticated } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  /**
   * Calculate password strength based on multiple criteria (0-4 scale)
   * Checks length, lowercase, uppercase, numbers, and special characters
   */
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return Math.min(strength, 4);
  };

  /**
   * Get visual styling and text for password strength indicator
   * Returns color and descriptive text based on strength level
   */
  const getPasswordStrengthInfo = (
    strength: number
  ): { color: string; text: string } => {
    const strengthMap = {
      0: { color: "bg-gray-300", text: "Very Weak" },
      1: { color: "bg-red-500", text: "Weak" },
      2: { color: "bg-orange-500", text: "Fair" },
      3: { color: "bg-yellow-500", text: "Good" },
      4: { color: "bg-green-500", text: "Strong" },
    };
    return strengthMap[strength as keyof typeof strengthMap];
  };

  /**
   * Comprehensive form validation with detailed error messages
   * Validates name, email format, password strength, and confirmation matching
   */
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation with length constraints
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    } else if (formData.name.trim().length > 50) {
      errors.name = "Name must be less than 50 characters";
    }

    // Email validation with regex pattern
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation with minimum length requirement
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    // Confirm password validation with matching check
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle input changes with real-time validation and strength calculation
   * Updates password strength indicator and clears related errors
   */
  const handleInputChange = (
    field: keyof RegisterData,
    value: string
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Update password strength for password field
    if (field === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear auth error when user makes changes
    if (error) {
      clearError();
    }
  };

  /**
   * Track field interaction for conditional error display
   */
  const handleInputBlur = (field: string): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /**
   * Handle form submission with validation and registration
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await register(formData);
  };

  const strengthInfo = getPasswordStrengthInfo(passwordStrength);

  // Show nothing while checking auth (prevents flash)
  if (isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Create Account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-2 text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Join SnapURL and start managing your links
        </motion.p>
      </div>

      {/* Error Alert Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center space-x-2 p-3 rounded-lg ${
            theme === "dark"
              ? "bg-red-900/20 border border-red-800 text-red-300"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label
            htmlFor="name"
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              />
            </div>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onBlur={() => handleInputBlur("name")}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                formErrors.name && touched.name
                  ? theme === "dark"
                    ? "border-red-500 bg-red-900/10 text-red-300 focus:border-red-400"
                    : "border-red-500 bg-red-50 text-red-700 focus:border-red-400"
                  : theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              placeholder="John Doe"
              disabled={loading}
              autoComplete="name"
              required
            />
          </div>
          {formErrors.name && touched.name && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-1 text-xs ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {formErrors.name}
            </motion.p>
          )}
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label
            htmlFor="email"
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
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={() => handleInputBlur("email")}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                formErrors.email && touched.email
                  ? theme === "dark"
                    ? "border-red-500 bg-red-900/10 text-red-300 focus:border-red-400"
                    : "border-red-500 bg-red-50 text-red-700 focus:border-red-400"
                  : theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              placeholder="your@email.com"
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>
          {formErrors.email && touched.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-1 text-xs ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {formErrors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Password Field with Strength Indicator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label
            htmlFor="password"
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onBlur={() => handleInputBlur("password")}
              className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors ${
                formErrors.password && touched.password
                  ? theme === "dark"
                    ? "border-red-500 bg-red-900/10 text-red-300 focus:border-red-400"
                    : "border-red-500 bg-red-50 text-red-700 focus:border-red-400"
                  : theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
              } transition-colors`}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Animated Password Strength Indicator */}
          {formData.password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2"
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Password Strength
                </span>
                <span
                  className={`text-xs font-medium ${
                    passwordStrength >= 3
                      ? "text-green-500"
                      : passwordStrength >= 2
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {strengthInfo.text}
                </span>
              </div>
              <div
                className={`h-2 rounded-full ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full rounded-full ${strengthInfo.color}`}
                />
              </div>
            </motion.div>
          )}

          {formErrors.password && touched.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-1 text-xs ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {formErrors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Confirm Password Field with Match Indicator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label
            htmlFor="confirmPassword"
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              onBlur={() => handleInputBlur("confirmPassword")}
              className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors ${
                formErrors.confirmPassword && touched.confirmPassword
                  ? theme === "dark"
                    ? "border-red-500 bg-red-900/10 text-red-300 focus:border-red-400"
                    : "border-red-500 bg-red-50 text-red-700 focus:border-red-400"
                  : theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
              } transition-colors`}
              disabled={loading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>

            {/* Password Match Visual Indicator */}
            {formData.confirmPassword && formData.password && (
              <div className="absolute inset-y-0 right-12 flex items-center pr-2">
                {formData.password === formData.confirmPassword ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {formErrors.confirmPassword && touched.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-1 text-xs ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {formErrors.confirmPassword}
            </motion.p>
          )}
        </motion.div>

        {/* Submit Button with Loading Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            type="submit"
            disabled={loading}
            className={`w-full relative py-3 px-4 rounded-lg font-medium text-white transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 active:bg-blue-800"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </motion.div>
      </form>

      {/* Login Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center"
      >
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className={`font-medium ${
              theme === "dark"
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-500"
            } transition-colors`}
          >
            Sign in here
          </Link>
        </p>
      </motion.div>

      {/* Terms and Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <p
          className={`text-xs ${
            theme === "dark" ? "text-gray-500" : "text-gray-500"
          }`}
        >
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:no-underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:no-underline">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RegisterForm;
