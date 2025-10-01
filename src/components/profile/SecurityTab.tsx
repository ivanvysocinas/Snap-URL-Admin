import { FC, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Key,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDemoRestriction } from "@/hooks/useDemoRestrictionModal";
import api from "../../lib/api";

/**
 * Security settings tab component
 * Handles password changes and displays account security info with demo restrictions
 */
interface SecurityTabProps {
  variants: any;
  loading: Record<string, boolean>;
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  success: Record<string, boolean>;
  setSuccess: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const SecurityTab: FC<SecurityTabProps> = ({
  variants,
  loading,
  setLoading,
  errors,
  setErrors,
  success,
  setSuccess,
}) => {
  const { user } = useAuth();
  const { showDemoRestriction } = useDemoRestriction();

  // Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );

  /**
   * Handle password change with demo restriction check
   */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user?.role === "demo") {
      showDemoRestriction(
        "Demo Account Restriction",
        "Password change is not available in demo mode. Please use a full account to access all features.",
        "Change Password"
      );
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));
    setErrors({});

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: "New passwords don't match" });
      setLoading((prev) => ({ ...prev, password: false }));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      setLoading((prev) => ({ ...prev, password: false }));
      return;
    }

    try {
      const response = await api.auth.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        setSuccess((prev) => ({ ...prev, password: true }));
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(
          () => setSuccess((prev) => ({ ...prev, password: false })),
          3000
        );
      } else {
        throw new Error(response.message || "Failed to change password");
      }
    } catch (error) {
      setErrors({
        password:
          error instanceof Error ? error.message : "Failed to change password",
      });
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  /**
   * Toggle password visibility for form fields
   */
  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="card p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold dark:text-white">
          Security Settings
        </h3>
      </div>

      <div className="space-y-8">
        {/* Change Password */}
        <div>
          <h4 className="font-medium dark:text-white mb-4 flex items-center space-x-2">
            <Key className="w-5 h-5 text-orange-500" />
            <span>Change Password</span>
          </h4>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="input-base pr-10"
                  required
                  disabled={loading.password}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="input-base pr-10"
                  required
                  minLength={6}
                  disabled={loading.password}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="input-base pr-10"
                  required
                  disabled={loading.password}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {errors.password && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password}</span>
              </div>
            )}

            {success.password && (
              <div className="flex items-center space-x-2 text-green-500 text-sm">
                <Check className="w-4 h-4" />
                <span>Password changed successfully!</span>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading.password}
              className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              {loading.password ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Changing...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Change Password</span>
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Account Security Info */}
        <div>
          <h4 className="font-medium dark:text-white mb-4">Account Security</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="dark:text-gray-300">Last login</span>
              <span className="dark:text-white">Today, 2:30 PM</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="dark:text-gray-300">Password last changed</span>
              <span className="dark:text-white">2 months ago</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="dark:text-gray-300">Account status</span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
